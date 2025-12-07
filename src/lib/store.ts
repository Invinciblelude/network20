/**
 * Data Store - Unified data layer with Supabase and local fallback
 * 
 * This module provides a seamless data layer that:
 * - Uses Supabase when configured for real backend persistence
 * - Falls back to AsyncStorage for local-only operation
 * - Maintains the same API regardless of backend
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SupabaseAPI from './supabase';
import type { Profile, ProfileInsert, ProfileUpdate, SocialLink } from './database.types';

// Re-export types
export type { Profile, ProfileInsert, ProfileUpdate, SocialLink };

// Check if we're using Supabase or local storage
const useSupabase = SupabaseAPI.isSupabaseConfigured;

// Local storage keys
const PROFILES_KEY = 'network20_profiles';
const CURRENT_USER_KEY = 'network20_current_user';

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

function generateId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

async function getLocalProfiles(): Promise<Profile[]> {
  try {
    const data = await AsyncStorage.getItem(PROFILES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

async function saveLocalProfiles(profiles: Profile[]): Promise<void> {
  await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

// ============================================
// UNIFIED API - These work with both backends
// ============================================

/**
 * Get all profiles (public profiles from Supabase, or all from local)
 */
export async function getProfiles(): Promise<Profile[]> {
  if (useSupabase) {
    return SupabaseAPI.getProfiles();
  }
  return getLocalProfiles();
}

/**
 * Get a single profile by ID
 */
export async function getProfile(id: string): Promise<Profile | null> {
  if (useSupabase) {
    return SupabaseAPI.getProfile(id);
  }
  
  const profiles = await getLocalProfiles();
  return profiles.find(p => p.id === id) || null;
}

/**
 * Create a new profile
 */
export async function createProfile(data: Omit<ProfileInsert, 'id' | 'user_id'>): Promise<Profile> {
  if (useSupabase) {
    const profile = await SupabaseAPI.createProfile(data);
    if (!profile) throw new Error('Failed to create profile');
    // Save the profile ID locally so we know it's "ours"
    await AsyncStorage.setItem(CURRENT_USER_KEY, profile.id);
    return profile;
  }
  
  // Local storage creation
  const profiles = await getLocalProfiles();
  const now = new Date().toISOString();
  
  const newProfile: Profile = {
    id: generateId(),
    user_id: null,
    display_name: data.display_name,
    tagline: data.tagline || null,
    skills: data.skills || [],
    hours_available: data.hours_available || null,
    hours_frequency: data.hours_frequency || 'week',
    pay_preference: data.pay_preference || null,
    pay_rate: data.pay_rate || null,
    location: data.location || null,
    contact_email: data.contact_email || null,
    contact_phone: data.contact_phone || null,
    social_links: data.social_links || [],
    bio: data.bio || null,
    avatar_url: data.avatar_url || null,
    resume_url: data.resume_url || null,
    is_available: data.is_available ?? true,
    is_public: data.is_public ?? true,
    created_at: now,
    updated_at: now,
  };
  
  profiles.unshift(newProfile);
  await saveLocalProfiles(profiles);
  await AsyncStorage.setItem(CURRENT_USER_KEY, newProfile.id);
  
  return newProfile;
}

/**
 * Update an existing profile
 */
export async function updateProfile(id: string, data: ProfileUpdate): Promise<Profile | null> {
  if (useSupabase) {
    return SupabaseAPI.updateProfile(id, data);
  }
  
  const profiles = await getLocalProfiles();
  const index = profiles.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  profiles[index] = {
    ...profiles[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
  
  await saveLocalProfiles(profiles);
  return profiles[index];
}

/**
 * Delete a profile
 */
export async function deleteProfile(id: string): Promise<boolean> {
  if (useSupabase) {
    return SupabaseAPI.deleteProfile(id);
  }
  
  const profiles = await getLocalProfiles();
  const filtered = profiles.filter(p => p.id !== id);
  
  if (filtered.length === profiles.length) return false;
  
  await saveLocalProfiles(filtered);
  
  const currentUser = await getCurrentUserId();
  if (currentUser === id) {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  }
  
  return true;
}

/**
 * Search profiles by query text
 */
export async function searchProfiles(query: string): Promise<Profile[]> {
  if (useSupabase) {
    return SupabaseAPI.searchProfiles(query);
  }
  
  const profiles = await getLocalProfiles();
  const lowerQuery = query.toLowerCase();
  
  return profiles.filter(p =>
    p.display_name.toLowerCase().includes(lowerQuery) ||
    p.tagline?.toLowerCase().includes(lowerQuery) ||
    p.skills.some(s => s.toLowerCase().includes(lowerQuery)) ||
    p.location?.toLowerCase().includes(lowerQuery) ||
    p.bio?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get only available profiles
 */
export async function getAvailableProfiles(): Promise<Profile[]> {
  if (useSupabase) {
    return SupabaseAPI.getAvailableProfiles();
  }
  
  const profiles = await getLocalProfiles();
  return profiles.filter(p => p.is_available);
}

// ============================================
// CURRENT USER MANAGEMENT
// ============================================

/**
 * Get current user ID - checks auth first, then falls back to local storage
 */
export async function getCurrentUserId(): Promise<string | null> {
  // First check if user is authenticated
  if (useSupabase) {
    const authUser = await SupabaseAPI.getCurrentAuthUser();
    if (authUser) {
      // User is logged in - find their profile by user_id
      const profile = await SupabaseAPI.getCurrentUserProfile();
      if (profile) {
        return profile.id;
      }
    }
  }
  
  // Fall back to local storage for anonymous users
  try {
    return await AsyncStorage.getItem(CURRENT_USER_KEY);
  } catch {
    return null;
  }
}

/**
 * Set current user ID (for anonymous users - local storage)
 */
export async function setCurrentUserId(id: string | null): Promise<void> {
  if (id) {
    await AsyncStorage.setItem(CURRENT_USER_KEY, id);
  } else {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  }
}

/**
 * Get current user's profile - checks auth first, then local storage
 */
export async function getCurrentUser(): Promise<Profile | null> {
  // First check if user is authenticated
  if (useSupabase) {
    const authUser = await SupabaseAPI.getCurrentAuthUser();
    if (authUser) {
      // User is logged in - get their profile
      return SupabaseAPI.getCurrentUserProfile();
    }
  }
  
  // Fall back to local storage for anonymous users
  const id = await AsyncStorage.getItem(CURRENT_USER_KEY);
  if (!id) return null;
  return getProfile(id);
}

/**
 * Get profile for authenticated user (by user_id)
 */
export async function getAuthenticatedUserProfile(): Promise<Profile | null> {
  if (!useSupabase) return null;
  return SupabaseAPI.getCurrentUserProfile();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Clear all local data (useful for testing/reset)
 */
export async function clearAllProfiles(): Promise<void> {
  await AsyncStorage.removeItem(PROFILES_KEY);
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * Check if backend is using Supabase
 */
export function isUsingSupabase(): boolean {
  return useSupabase;
}

// ============================================
// AUTH RE-EXPORTS (for convenience)
// ============================================

export const signUp = SupabaseAPI.signUp;
export const signIn = SupabaseAPI.signIn;
export const signOut = SupabaseAPI.signOut;
export const resetPassword = SupabaseAPI.resetPassword;
export const onAuthStateChange = SupabaseAPI.onAuthStateChange;
export const getCurrentAuthUser = SupabaseAPI.getCurrentAuthUser;
