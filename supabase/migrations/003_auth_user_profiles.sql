-- Migration: Allow authenticated users to manage their own profiles
-- This updates the RLS policies to support both:
-- 1. Anonymous users (user_id IS NULL) - for guest card creation
-- 2. Authenticated users (user_id = auth.uid()) - for owned cards

-- First, drop the anonymous-only policies
DROP POLICY IF EXISTS "Anyone can insert anonymous profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can update anonymous profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can delete anonymous profiles" ON profiles;

-- Create new policies that support both anonymous and authenticated users

-- INSERT: Allow anyone to create profiles
-- - Anonymous users create profiles with user_id = NULL
-- - Authenticated users create profiles with user_id = auth.uid()
CREATE POLICY "Users can create profiles"
ON profiles FOR INSERT
WITH CHECK (
  user_id IS NULL OR user_id = auth.uid()
);

-- UPDATE: Allow users to update their own profiles
-- - Anonymous profiles (user_id IS NULL) can be updated by anyone (they use local storage for ownership)
-- - Authenticated profiles can only be updated by the owner
CREATE POLICY "Users can update their own profiles"
ON profiles FOR UPDATE
USING (
  user_id IS NULL OR user_id = auth.uid()
)
WITH CHECK (
  user_id IS NULL OR user_id = auth.uid()
);

-- DELETE: Allow users to delete their own profiles
CREATE POLICY "Users can delete their own profiles"
ON profiles FOR DELETE
USING (
  user_id IS NULL OR user_id = auth.uid()
);

-- SELECT: Public profiles can be read by anyone (already exists, but let's ensure it)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (is_public = true);

-- Also allow users to read their own non-public profiles
CREATE POLICY "Users can view their own profiles"
ON profiles FOR SELECT
USING (user_id = auth.uid());

-- Add index for faster user_id lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

