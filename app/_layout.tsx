import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Platform } from 'react-native';
import { colors } from '../src/lib/theme';
import { ToastProvider } from '../src/components/ui';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
  const router = useRouter();

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
    <AuthProvider>
      <SafeAreaProvider>
        <ToastProvider>
          <View style={{ flex: 1, backgroundColor: colors.bg }}>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.bg },
                animation: 'slide_from_right',
              }}
            />
          </View>
        </ToastProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
