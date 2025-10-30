-- Fix notifications INSERT policy
-- Allow the send-notification edge function to insert notifications
-- This requires using the service role key in the edge function

-- Add INSERT policy for notifications (edge functions with service role can bypass this)
CREATE POLICY "System can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Note: Edge function should use SUPABASE_SERVICE_ROLE_KEY for inserting notifications