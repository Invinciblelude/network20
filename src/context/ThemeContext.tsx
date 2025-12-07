import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { ThemeMode, darkColors, lightColors, gradients } from '../lib/theme';

const THEME_STORAGE_KEY = '@nw20_theme';

interface ThemeContextType {
  mode: ThemeMode;
  colors: typeof darkColors;
  gradientColors: readonly string[];
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setMode(savedTheme);
        } else if (systemColorScheme) {
          // Use system preference if no saved preference
          setMode(systemColorScheme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      } finally {
        setIsLoaded(true);
      }
    }
    loadTheme();
  }, [systemColorScheme]);

  // Save theme preference
  const saveTheme = async (newMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    saveTheme(newMode);
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
    saveTheme(newMode);
  };

  const colors = mode === 'light' ? lightColors : darkColors;
  const gradientColors = mode === 'light' ? gradients.light : gradients.dark;

  // Don't render until theme is loaded to avoid flash
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        mode,
        colors,
        gradientColors,
        toggleTheme,
        setTheme,
        isDark: mode === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook that returns just colors for components that don't need full context
export function useColors() {
  const { colors } = useTheme();
  return colors;
}

