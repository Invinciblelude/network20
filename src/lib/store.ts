// Local storage for profiles when Supabase isn't configured
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Profile, ProfileInsert, ProfileUpdate } from './supabase';

const PROFILES_KEY = 'network20_profiles';
const CURRENT_USER_KEY = 'network20_current_user';

// Generate a simple ID
function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Get all profiles
export async function getProfiles(): Promise<Profile[]> {
  try {
    const data = await AsyncStorage.getItem(PROFILES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Get single profile by ID
export async function getProfile(id: string): Promise<Profile | null> {
  const profiles = await getProfiles();
  return profiles.find(p => p.id === id) || null;
}

// Create profile
export async function createProfile(data: Omit<ProfileInsert, 'id'>): Promise<Profile> {
  const profiles = await getProfiles();
  const now = new Date().toISOString();
  
  const newProfile: Profile = {
    id: generateId(),
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
    created_at: now,
    updated_at: now,
  };
  
  profiles.unshift(newProfile);
  await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  await AsyncStorage.setItem(CURRENT_USER_KEY, newProfile.id);
  
  return newProfile;
}

// Update profile
export async function updateProfile(id: string, data: ProfileUpdate): Promise<Profile | null> {
  const profiles = await getProfiles();
  const index = profiles.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  profiles[index] = {
    ...profiles[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
  
  await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  return profiles[index];
}

// Delete profile
export async function deleteProfile(id: string): Promise<boolean> {
  const profiles = await getProfiles();
  const filtered = profiles.filter(p => p.id !== id);
  
  if (filtered.length === profiles.length) return false;
  
  await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(filtered));
  
  const currentUser = await getCurrentUserId();
  if (currentUser === id) {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  }
  
  return true;
}

// Get current user ID
export async function getCurrentUserId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(CURRENT_USER_KEY);
  } catch {
    return null;
  }
}

// Set current user
export async function setCurrentUserId(id: string | null): Promise<void> {
  if (id) {
    await AsyncStorage.setItem(CURRENT_USER_KEY, id);
  } else {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  }
}

// Get current user profile
export async function getCurrentUser(): Promise<Profile | null> {
  const id = await getCurrentUserId();
  if (!id) return null;
  return getProfile(id);
}

// Search profiles
export async function searchProfiles(query: string): Promise<Profile[]> {
  const profiles = await getProfiles();
  const lowerQuery = query.toLowerCase();
  
  return profiles.filter(p => 
    p.display_name.toLowerCase().includes(lowerQuery) ||
    p.tagline?.toLowerCase().includes(lowerQuery) ||
    p.skills.some(s => s.toLowerCase().includes(lowerQuery)) ||
    p.location?.toLowerCase().includes(lowerQuery) ||
    p.bio?.toLowerCase().includes(lowerQuery)
  );
}

// Clear all profiles (useful for resetting)
export async function clearAllProfiles(): Promise<void> {
  await AsyncStorage.removeItem(PROFILES_KEY);
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}

