import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../lib/theme';

export function Footer() {
  const router = useRouter();

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        © 2025 TheNetwork20. Open source employment network.
      </Text>
      <View style={styles.footerLinks}>
        <Pressable onPress={() => router.push('/')}>
          <Text style={styles.footerLink}>Home</Text>
        </Pressable>
        <Text style={styles.footerDot}>•</Text>
        <Pressable onPress={() => router.push('/directory')}>
          <Text style={styles.footerLink}>Directory</Text>
        </Pressable>
        <Text style={styles.footerDot}>•</Text>
        <Pressable onPress={() => router.push('/jobs')}>
          <Text style={styles.footerLink}>Jobs</Text>
        </Pressable>
        <Text style={styles.footerDot}>•</Text>
        <Pressable onPress={() => router.push('/about')}>
          <Text style={styles.footerLink}>About</Text>
        </Pressable>
        <Text style={styles.footerDot}>•</Text>
        <Pressable onPress={() => router.push('/hire')}>
          <Text style={styles.footerLink}>For Employers</Text>
        </Pressable>
        <Text style={styles.footerDot}>•</Text>
        <Pressable onPress={() => router.push('/promotions')}>
          <Text style={styles.footerLink}>Promotions</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.bgElevated,
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  footerLink: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  footerDot: {
    color: colors.textMuted,
  },
});

