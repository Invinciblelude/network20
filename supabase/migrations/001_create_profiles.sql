-- Network 20 - Profiles Table
-- This migration creates the profiles table and necessary policies

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  tagline TEXT,
  skills TEXT[] DEFAULT '{}',
  hours_available INTEGER,
  hours_frequency TEXT DEFAULT 'week' CHECK (hours_frequency IN ('week', 'month')),
  pay_preference TEXT CHECK (pay_preference IN ('hourly', 'project', 'salary', 'negotiable')),
  pay_rate TEXT,
  location TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  social_links JSONB DEFAULT '[]',
  bio TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Create index on skills for search
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON public.profiles USING GIN(skills);

-- Create index for full-text search
CREATE INDEX IF NOT EXISTS idx_profiles_search ON public.profiles USING GIN(
  to_tsvector('english', COALESCE(display_name, '') || ' ' || COALESCE(tagline, '') || ' ' || COALESCE(bio, '') || ' ' || COALESCE(location, ''))
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view public profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles 
  FOR SELECT 
  USING (is_public = true);

-- Policy: Users can view their own profiles (even if not public)
CREATE POLICY "Users can view own profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete own profile" 
  ON public.profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, contact_email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant access to authenticated users
GRANT SELECT ON public.profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.profiles TO authenticated;

-- Grant access to anon users (for viewing public profiles)
GRANT SELECT ON public.profiles TO anon;

