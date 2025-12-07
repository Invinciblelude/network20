import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, AuthUser, onAuthStateChange, signIn, signUp, signOut, getCurrentAuthUser } from '../lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load initial user
  useEffect(() => {
    async function loadUser() {
      try {
        const authUser = await getCurrentAuthUser();
        setUser(authUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  // Subscribe to auth changes
  useEffect(() => {
    const { data } = onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await signIn(email, password);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignUp = useCallback(async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    try {
      await signUp(email, password, displayName);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const authUser = await getCurrentAuthUser();
    setUser(authUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

