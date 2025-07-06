-- Update profiles table to support admin and call center user types
-- Add new user types for admin and call center staff
DO $$
BEGIN
  -- Check if the user_type column exists and update its default constraint
  ALTER TABLE public.profiles 
  ALTER COLUMN user_type DROP DEFAULT;
  
  ALTER TABLE public.profiles 
  ALTER COLUMN user_type SET DEFAULT 'customer';
END
$$;

-- Create initial admin user (you'll need to create this account manually via Supabase auth)
-- This is just a placeholder to show the structure
-- INSERT INTO public.profiles (id, full_name, user_type, phone_number) 
-- VALUES ('placeholder-admin-id', 'Admin User', 'admin', '+1234567890');