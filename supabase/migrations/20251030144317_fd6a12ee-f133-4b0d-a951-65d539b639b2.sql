-- Create public_workers view to expose only non-sensitive worker data
CREATE OR REPLACE FUNCTION public.get_public_workers()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  experience_years integer,
  kyc_verified boolean,
  is_available boolean,
  rating numeric,
  total_jobs integer,
  skills text[],
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    user_id,
    experience_years,
    kyc_verified,
    is_available,
    rating,
    total_jobs,
    skills,
    created_at,
    updated_at
  FROM public.workers
$$;

-- Create view for easier access
CREATE OR REPLACE VIEW public.public_workers AS
SELECT * FROM public.get_public_workers();

-- Grant access to authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_workers() TO authenticated;
GRANT SELECT ON public.public_workers TO authenticated;

-- Update workers RLS policies to protect KYC data
DROP POLICY IF EXISTS "Anyone can view verified workers" ON public.workers;

-- Policy 1: Users can view their own complete worker profile (including KYC data)
CREATE POLICY "Workers can view own complete profile"
ON public.workers
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy 2: Admins can view all worker data including KYC
CREATE POLICY "Admins can view all workers"
ON public.workers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Remove direct wallet update capability from users
DROP POLICY IF EXISTS "Users can update own wallet" ON public.wallets;

-- Users can only view their wallet, not update it directly
-- Updates must go through the secure edge function