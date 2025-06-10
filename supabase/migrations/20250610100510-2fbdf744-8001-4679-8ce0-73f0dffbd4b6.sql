
-- Create table for worker portfolios
CREATE TABLE public.worker_portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL,
  image_url TEXT,
  completion_date DATE,
  customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for service galleries (multiple images per service type)
CREATE TABLE public.service_galleries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolios', 'portfolios', true);

-- Create storage bucket for service gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('service-gallery', 'service-gallery', true);

-- Add RLS policies for worker portfolios
ALTER TABLE public.worker_portfolios ENABLE ROW LEVEL SECURITY;

-- Workers can manage their own portfolios
CREATE POLICY "Workers can manage their own portfolios" 
  ON public.worker_portfolios 
  FOR ALL 
  USING (
    worker_id IN (
      SELECT id FROM public.workers WHERE user_id = auth.uid()
    )
  );

-- Everyone can view portfolios (public)
CREATE POLICY "Anyone can view portfolios" 
  ON public.worker_portfolios 
  FOR SELECT 
  USING (true);

-- Add RLS policies for service galleries
ALTER TABLE public.service_galleries ENABLE ROW LEVEL SECURITY;

-- Everyone can view service gallery (public)
CREATE POLICY "Anyone can view service gallery" 
  ON public.service_galleries 
  FOR SELECT 
  USING (true);

-- Only authenticated users can manage service gallery
CREATE POLICY "Authenticated users can manage service gallery" 
  ON public.service_galleries 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Add updated_at trigger for portfolios
CREATE TRIGGER update_worker_portfolios_updated_at
  BEFORE UPDATE ON public.worker_portfolios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage policies for portfolios bucket
CREATE POLICY "Anyone can view portfolio images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'portfolios');

CREATE POLICY "Authenticated users can upload portfolio images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'portfolios' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own portfolio images" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'portfolios' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own portfolio images" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'portfolios' AND auth.role() = 'authenticated');

-- Create storage policies for service-gallery bucket
CREATE POLICY "Anyone can view service gallery images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'service-gallery');

CREATE POLICY "Authenticated users can manage service gallery images" 
  ON storage.objects 
  FOR ALL 
  USING (bucket_id = 'service-gallery' AND auth.role() = 'authenticated');

-- Insert sample service gallery images
INSERT INTO public.service_galleries (service_type, title, description, image_url, display_order, is_featured) VALUES
('Plumbing', 'Professional Pipe Installation', 'High-quality pipe installation and repair services', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop&crop=center', 1, true),
('Plumbing', 'Bathroom Renovation', 'Complete bathroom plumbing solutions', 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop&crop=center', 2, false),
('Electrical', 'Modern Wiring Solutions', 'Safe and efficient electrical installations', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&crop=center', 1, true),
('Electrical', 'Smart Home Setup', 'Advanced smart home electrical systems', 'https://images.unsplash.com/photo-1558618047-8c8147b5faa5?w=400&h=300&fit=crop&crop=center', 2, false),
('Carpentry', 'Custom Furniture', 'Handcrafted wooden furniture and fixtures', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center', 1, true),
('Carpentry', 'Kitchen Cabinets', 'Beautiful custom kitchen cabinet installations', 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=400&h=300&fit=crop&crop=center', 2, false),
('Home Cleaning', 'Deep Cleaning Service', 'Thorough and professional home cleaning', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&crop=center', 1, true),
('Home Cleaning', 'Kitchen Deep Clean', 'Specialized kitchen cleaning and sanitization', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&crop=center', 2, false),
('Painting', 'Interior Wall Painting', 'Professional interior painting services', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop&crop=center', 1, true),
('Painting', 'Exterior House Painting', 'Durable exterior painting solutions', 'https://images.unsplash.com/photo-1609767499946-4d89e125c1ca?w=400&h=300&fit=crop&crop=center', 2, false);
