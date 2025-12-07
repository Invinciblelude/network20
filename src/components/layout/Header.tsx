import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography } from '../../lib/theme';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  showCreate?: boolean;
}

export function Header({ showCreate = true }: HeaderProps) {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();

  return (
    <View style={styles.header}>
      <Pressable style={styles.logoContainer} onPress={() => router.push('/')}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoIconText}>NW</Text>
        </View>
        <Text style={styles.logoText}>TheNetwork20</Text>
      </Pressable>
      
      <View style={styles.headerNav}>
        <Pressable onPress={() => router.push('/directory')} style={styles.navLink}>
          <Text style={styles.navLinkText}>Directory</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/jobs')} style={styles.navLink}>
          <Text style={styles.navLinkText}>Jobs</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/about')} style={styles.navLink}>
          <Text style={styles.navLinkText}>About</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/my-cards')} style={styles.navLink}>
          <Text style={styles.navLinkText}>My Cards</Text>
        </Pressable>
        {!authUser && !authLoading && (
          <Pressable onPress={() => router.push('/auth/login')} style={styles.navLink}>
            <Text style={styles.navLinkText}>Sign In</Text>
          </Pressable>
        )}
        {showCreate && (
          <Pressable onPress={() => router.push('/create')} style={styles.createCardBtn}>
            <Text style={styles.createCardBtnText}>Create Card</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.bgElevated,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '800',
  },
  logoText: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  navLink: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  navLinkText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  createCardBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  createCardBtnText: {
    color: colors.textInverse,
    fontSize: typography.sizes.sm,
    fontWeight: '600',
  },
});

