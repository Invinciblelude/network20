import 'react-native-url-polyfill/dist/polyfill';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || '';

// Create client only if configured
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// Types for our database
export interface Profile {
  id: string;
  display_name: string;
  tagline: string | null;
  skills: string[];
  hours_available: number | null;
  hours_frequency: 'week' | 'month';
  pay_preference: 'hourly' | 'project' | 'salary' | 'negotiable' | null;
  pay_rate: string | null;
  location: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  social_links: SocialLink[];
  bio: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'instagram' | 'github' | 'website' | 'other';
  handle: string;
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>;
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;

