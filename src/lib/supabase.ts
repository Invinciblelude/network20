import 'react-native-url-polyfill/dist/polyfill';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import type { Database, Profile, ProfileInsert, ProfileUpdate, SocialLink } from './database.types';

// Re-export types for convenience
export type { Profile, ProfileInsert, ProfileUpdate, SocialLink };

// Get Supabase credentials from expo config
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create typed Supabase client
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// ============================================
// AUTH HELPERS
// ============================================

export interface AuthUser {
  id: string;
  email: string | undefined;
  displayName?: string;
}

/**
 * Get current authenticated user
 */
export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  if (!supabase) return null;
  
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  
  return {
    id: user.id,
    email: user.email,
    displayName: user.user_metadata?.display_name,
  };
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, displayName?: string) {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });
  
  if (error) throw error;
  return data;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

/**
 * Sign out
 */
export async function signOut() {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  if (!supabase) {
    // Return a no-op unsubscribe function
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  
  return supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email,
        displayName: session.user.user_metadata?.display_name,
      });
    } else {
      callback(null);
    }
  });
}

// ============================================
// PROFILE DATA HELPERS
// ============================================

/**
 * Get all public profiles
 */
export async function getProfiles(): Promise<Profile[]> {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Get profile by ID
 */
export async function getProfile(id: string): Promise<Profile | null> {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
}

/**
 * Get profile for current user
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  if (!supabase) return null;
  
  const user = await getCurrentAuthUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
}

/**
 * Create a new profile
 */
export async function createProfile(profileData: Omit<ProfileInsert, 'id' | 'user_id'>): Promise<Profile | null> {
  if (!supabase) return null;
  
  const user = await getCurrentAuthUser();
  if (!user) throw new Error('Must be logged in to create a profile');
  
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      ...profileData,
      user_id: user.id,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
  
  return data;
}

/**
 * Update profile
 */
export async function updateProfile(id: string, updates: ProfileUpdate): Promise<Profile | null> {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
  
  return data;
}

/**
 * Delete profile
 */
export async function deleteProfile(id: string): Promise<boolean> {
  if (!supabase) return false;
  
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting profile:', error);
    return false;
  }
  
  return true;
}

/**
 * Search profiles by text
 */
export async function searchProfiles(query: string): Promise<Profile[]> {
  if (!supabase) return [];
  
  // Simple search using ilike on multiple fields
  const searchTerm = `%${query}%`;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_public', true)
    .or(`display_name.ilike.${searchTerm},tagline.ilike.${searchTerm},bio.ilike.${searchTerm},location.ilike.${searchTerm}`)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error searching profiles:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Search profiles by skill
 */
export async function searchProfilesBySkill(skill: string): Promise<Profile[]> {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_public', true)
    .contains('skills', [skill])
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error searching by skill:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Get available profiles only
 */
export async function getAvailableProfiles(): Promise<Profile[]> {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_public', true)
    .eq('is_available', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching available profiles:', error);
    return [];
  }
  
  return data || [];
}
