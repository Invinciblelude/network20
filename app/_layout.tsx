import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Platform } from 'react-native';
import { ToastProvider } from '../src/components/ui';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';

function RootLayoutContent() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  // Handle GitHub Pages SPA redirect
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const query = window.location.search;
      if (query.startsWith('?/')) {
        const path = query.slice(2).split('&')[0].replace(/~and~/g, '&');
        window.history.replaceState(null, '', '/' + path);
        router.replace('/' + path as any);
      }
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'slide_from_right',
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <ToastProvider>
            <RootLayoutContent />
          </ToastProvider>
        </SafeAreaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
