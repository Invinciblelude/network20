-- Allow anonymous profile creation (no auth required)
-- This enables anyone to create a W2 Card without signing up

-- Drop the old insert policy that requires auth
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create new policy allowing anyone to insert profiles
CREATE POLICY "Anyone can create a profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to update profiles with null user_id (anonymous profiles)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Anyone can update anonymous profiles" 
  ON public.profiles 
  FOR UPDATE 
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

-- Allow anyone to delete anonymous profiles
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Anyone can delete anonymous profiles" 
  ON public.profiles 
  FOR DELETE 
  USING (user_id IS NULL);

-- Grant insert permission to anonymous users
GRANT INSERT ON public.profiles TO anon;
GRANT UPDATE ON public.profiles TO anon;
GRANT DELETE ON public.profiles TO anon;

