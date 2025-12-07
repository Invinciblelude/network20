// Network 20 - Bold & Distinctive Theme
// Supports both dark and light mode

export type ThemeMode = 'dark' | 'light';

// Dark theme colors
export const darkColors = {
  // Core palette - warm coral meets deep space
  primary: '#FF6B4A', // Vibrant coral
  primaryLight: '#FF8A70',
  primaryDark: '#E54D2E',
  
  // Accent - electric mint for highlights
  accent: '#00F5D4',
  accentMuted: '#00C4AA',
  
  // Backgrounds - deep and rich
  bg: '#0A0A0F', // Near black with warmth
  bgCard: '#141419',
  bgElevated: '#1C1C24',
  bgInput: '#22222C',
  
  // Text hierarchy
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  textInverse: '#0A0A0F',
  
  // Status
  success: '#00F5D4',
  warning: '#FFB347',
  error: '#FF6B6B',
  
  // Gradients
  gradientStart: '#FF6B4A',
  gradientEnd: '#FF8A70',
  gradientAccent: '#00F5D4',
};

// Light theme colors
export const lightColors = {
  // Core palette - same primary for brand consistency
  primary: '#FF6B4A',
  primaryLight: '#FF8A70',
  primaryDark: '#E54D2E',
  
  // Accent
  accent: '#00B4A0',
  accentMuted: '#00C4AA',
  
  // Backgrounds - clean and bright
  bg: '#FFFFFF',
  bgCard: '#F8F8FA',
  bgElevated: '#F0F0F5',
  bgInput: '#E8E8ED',
  
  // Text hierarchy
  textPrimary: '#1A1A2E',
  textSecondary: '#4A4A5A',
  textMuted: '#8A8A9A',
  textInverse: '#FFFFFF',
  
  // Status
  success: '#00B4A0',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Gradients
  gradientStart: '#FF6B4A',
  gradientEnd: '#FF8A70',
  gradientAccent: '#00B4A0',
};

// Default export for backward compatibility (dark mode)
export const colors = darkColors;

// Function to get colors based on theme
export function getColors(mode: ThemeMode) {
  return mode === 'light' ? lightColors : darkColors;
}

// Gradient backgrounds for each theme
export const gradients = {
  dark: ['#1a0a0f', '#0A0A0F', '#0a1a1f'] as const,
  light: ['#fff5f3', '#FFFFFF', '#f3fff9'] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    hero: 48,
  },
};
