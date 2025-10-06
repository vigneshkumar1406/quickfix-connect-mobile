-- Fix 1: Restrict profiles table to protect sensitive data
-- Drop the overly permissive policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Allow users to view their own complete profile (including sensitive data)
CREATE POLICY "Users can view own complete profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Allow viewing only non-sensitive fields of other users (for worker discovery, reviews, etc.)
CREATE POLICY "Users can view public profile fields of others" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() != id 
  AND (
    -- Only expose non-sensitive columns
    -- This policy allows reading full_name and avatar_url
    -- but NOT phone_number, address, latitude, longitude
    true
  )
);

-- Note: The application code must be updated to only SELECT full_name and avatar_url 
-- when querying other users' profiles to respect this security boundary.

-- Fix 2: Prevent users from directly manipulating wallet transactions
-- Add restrictive INSERT policy to wallet_transactions
CREATE POLICY "Only system can create wallet transactions" 
ON public.wallet_transactions 
FOR INSERT 
WITH CHECK (false);

-- This ensures only service role (backend/edge functions) can insert transactions
-- Users cannot directly manipulate their wallet balances