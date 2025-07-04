
-- Add tracking status to service bookings (only if columns don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_bookings' AND column_name = 'tracking_enabled') THEN
        ALTER TABLE public.service_bookings ADD COLUMN tracking_enabled BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_bookings' AND column_name = 'worker_eta') THEN
        ALTER TABLE public.service_bookings ADD COLUMN worker_eta TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_bookings' AND column_name = 'worker_distance') THEN
        ALTER TABLE public.service_bookings ADD COLUMN worker_distance NUMERIC;
    END IF;
END $$;

-- Create RLS policies for location_tracking if they don't exist
DO $$ 
BEGIN
    -- Enable RLS if not already enabled
    ALTER TABLE public.location_tracking ENABLE ROW LEVEL SECURITY;
    
    -- Create policies only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'location_tracking' AND policyname = 'Customers can view tracking of their bookings') THEN
        CREATE POLICY "Customers can view tracking of their bookings" 
          ON public.location_tracking 
          FOR SELECT 
          USING (
            booking_id IN (
              SELECT id FROM public.service_bookings WHERE customer_id = auth.uid()
            )
          );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'location_tracking' AND policyname = 'Workers can track their own location') THEN
        CREATE POLICY "Workers can track their own location" 
          ON public.location_tracking 
          FOR ALL 
          USING (
            worker_id IN (
              SELECT id FROM public.workers WHERE user_id = auth.uid()
            )
          );
    END IF;
END $$;

-- Enable realtime for location tracking only if not already added
DO $$ 
BEGIN
    ALTER TABLE public.location_tracking REPLICA IDENTITY FULL;
    
    -- Check if table is already in publication
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'location_tracking'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.location_tracking;
    END IF;
END $$;

-- Create function to calculate distance
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 NUMERIC, 
  lon1 NUMERIC, 
  lat2 NUMERIC, 
  lon2 NUMERIC
) RETURNS NUMERIC AS $$
BEGIN
  RETURN (
    6371 * acos(
      cos(radians(lat1)) * 
      cos(radians(lat2)) * 
      cos(radians(lon2) - radians(lon1)) + 
      sin(radians(lat1)) * 
      sin(radians(lat2))
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to update booking tracking info
CREATE OR REPLACE FUNCTION public.update_booking_tracking_info()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.service_bookings
  SET 
    worker_distance = public.calculate_distance(
      NEW.latitude, 
      NEW.longitude, 
      service_bookings.latitude, 
      service_bookings.longitude
    ),
    worker_eta = CASE 
      WHEN public.calculate_distance(
        NEW.latitude, 
        NEW.longitude, 
        service_bookings.latitude, 
        service_bookings.longitude
      ) <= 0.5 THEN now() + INTERVAL '5 minutes'
      ELSE now() + INTERVAL '1 minute' * (
        public.calculate_distance(
          NEW.latitude, 
          NEW.longitude, 
          service_bookings.latitude, 
          service_bookings.longitude
        ) * 3
      )
    END
  WHERE id = NEW.booking_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_booking_tracking_trigger ON public.location_tracking;
CREATE TRIGGER update_booking_tracking_trigger
  AFTER INSERT ON public.location_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_booking_tracking_info();
