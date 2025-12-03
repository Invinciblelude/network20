import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { colors } from '../src/lib/theme';
import { getProfiles, clearAllProfiles } from '../src/lib/store';

export default function RootLayout() {
  useEffect(() => {
    // Clear demo profiles on first load
    async function clearDemoData() {
      const profiles = await getProfiles();
      // Check if any profiles have example.com emails (demo data)
      const hasDemoData = profiles.some(p => 
        p.contact_email?.includes('@example.com') ||
        p.display_name === 'Maya Chen' ||
        p.display_name === 'Marcus Johnson' ||
        p.display_name === 'Sarah Williams' ||
        p.display_name === 'DeShawn Carter' ||
        p.display_name === 'Elena Rodriguez'
      );
      
      if (hasDemoData) {
        await clearAllProfiles();
        // Force page reload to show empty state
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }
    }
    clearDemoData();
  }, []);

  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}

