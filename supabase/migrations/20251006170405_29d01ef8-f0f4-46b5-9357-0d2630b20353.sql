-- 1) Tighten profiles access: remove risky policy and add safe public view
DROP POLICY IF EXISTS "Users can view public profile fields of others" ON public.profiles;

-- Create a SECURITY DEFINER function that returns only safe fields
CREATE OR REPLACE FUNCTION public.get_public_profiles()
RETURNS TABLE (id uuid, full_name text, avatar_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, full_name, avatar_url
  FROM public.profiles
$$;

-- Create a view over the function (for easy querying from the client)
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles AS
SELECT * FROM public.get_public_profiles();

-- Lock down execution to authenticated users only
REVOKE ALL ON FUNCTION public.get_public_profiles() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_profiles() TO authenticated;
GRANT SELECT ON public.public_profiles TO authenticated;

-- 2) Fix wallet_transactions policy to allow legitimate inserts without blocking the system
DROP POLICY IF EXISTS "Only system can create wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Users can create own wallet transactions"
ON public.wallet_transactions
FOR INSERT
WITH CHECK (user_id = auth.uid());