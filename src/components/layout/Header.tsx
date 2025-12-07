import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { spacing, radius, typography } from '../../lib/theme';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  showCreate?: boolean;
}

export function Header({ showCreate = true }: HeaderProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { user: authUser, loading: authLoading } = useAuth();
  const { colors, toggleTheme, isDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const isMobile = width < 768;

  const navigateTo = (path: string) => {
    setMenuOpen(false);
    router.push(path as any);
  };

  // Create styles with current theme colors
  const styles = createStyles(colors);

  return (
    <View style={styles.header}>
      <Pressable style={styles.logoContainer} onPress={() => navigateTo('/')}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoIconText}>NW</Text>
        </View>
        {!isMobile && <Text style={styles.logoText}>TheNetwork20</Text>}
      </Pressable>
      
      {isMobile ? (
        <>
          {/* Mobile: Hamburger Menu */}
          <View style={styles.mobileActions}>
            {/* Theme Toggle */}
            <Pressable onPress={toggleTheme} style={styles.themeToggle}>
              <Ionicons 
                name={isDark ? 'sunny' : 'moon'} 
                size={22} 
                color={isDark ? colors.warning : colors.primary} 
              />
            </Pressable>
            {showCreate && (
              <Pressable onPress={() => navigateTo('/create')} style={styles.createCardBtn}>
                <Ionicons name="add" size={20} color={colors.textInverse} />
              </Pressable>
            )}
            <Pressable onPress={() => setMenuOpen(true)} style={styles.menuButton}>
              <Ionicons name="menu" size={28} color={colors.textPrimary} />
            </Pressable>
          </View>

          {/* Mobile Menu Modal */}
          <Modal
            visible={menuOpen}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setMenuOpen(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.mobileMenu}>
                <View style={styles.mobileMenuHeader}>
                  <Text style={styles.mobileMenuTitle}>Menu</Text>
                  <Pressable onPress={() => setMenuOpen(false)} style={styles.closeButton}>
                    <Ionicons name="close" size={28} color={colors.textPrimary} />
                  </Pressable>
                </View>

                <Pressable style={styles.mobileNavLink} onPress={() => navigateTo('/')}>
                  <Ionicons name="home-outline" size={22} color={colors.textSecondary} />
                  <Text style={styles.mobileNavLinkText}>Home</Text>
                </Pressable>

                <Pressable style={styles.mobileNavLink} onPress={() => navigateTo('/directory')}>
                  <Ionicons name="people-outline" size={22} color={colors.textSecondary} />
                  <Text style={styles.mobileNavLinkText}>Directory</Text>
                </Pressable>

                <Pressable style={styles.mobileNavLink} onPress={() => navigateTo('/jobs')}>
                  <Ionicons name="briefcase-outline" size={22} color={colors.textSecondary} />
                  <Text style={styles.mobileNavLinkText}>Jobs</Text>
                </Pressable>

                <Pressable style={styles.mobileNavLink} onPress={() => navigateTo('/about')}>
                  <Ionicons name="information-circle-outline" size={22} color={colors.textSecondary} />
                  <Text style={styles.mobileNavLinkText}>About</Text>
                </Pressable>

                <Pressable style={styles.mobileNavLink} onPress={() => navigateTo('/hire')}>
                  <Ionicons name="business-outline" size={22} color={colors.textSecondary} />
                  <Text style={styles.mobileNavLinkText}>For Employers</Text>
                </Pressable>

                <Pressable style={styles.mobileNavLink} onPress={() => navigateTo('/promotions')}>
                  <Ionicons name="megaphone-outline" size={22} color={colors.textSecondary} />
                  <Text style={styles.mobileNavLinkText}>Promotions</Text>
                </Pressable>

                <View style={styles.mobileMenuDivider} />

                {/* Theme Toggle in Menu */}
                <Pressable style={styles.mobileNavLink} onPress={() => { toggleTheme(); setMenuOpen(false); }}>
                  <Ionicons 
                    name={isDark ? 'sunny' : 'moon'} 
                    size={22} 
                    color={isDark ? colors.warning : colors.primary} 
                  />
                  <Text style={styles.mobileNavLinkText}>
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </Text>
                </Pressable>

                <Pressable style={styles.mobileNavLink} onPress={() => navigateTo('/my-cards')}>
                  <Ionicons name="card-outline" size={22} color={colors.textSecondary} />
                  <Text style={styles.mobileNavLinkText}>My Cards</Text>
                </Pressable>

                {!authUser && !authLoading ? (
                  <Pressable style={styles.mobileNavLink} onPress={() => navigateTo('/auth/login')}>
                    <Ionicons name="log-in-outline" size={22} color={colors.primary} />
                    <Text style={[styles.mobileNavLinkText, { color: colors.primary }]}>Sign In</Text>
                  </Pressable>
                ) : authUser ? (
                  <View style={styles.mobileUserInfo}>
                    <Ionicons name="person-circle-outline" size={22} color={colors.success} />
                    <Text style={styles.mobileUserEmail}>{authUser.email}</Text>
                  </View>
                ) : null}

                {showCreate && (
                  <Pressable 
                    style={styles.mobileCreateBtn} 
                    onPress={() => navigateTo('/create')}
                  >
                    <Ionicons name="add-circle" size={22} color={colors.textInverse} />
                    <Text style={styles.mobileCreateBtnText}>Create Card</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </Modal>
        </>
      ) : (
        /* Desktop: Full Navigation */
        <View style={styles.headerNav}>
          <Pressable onPress={() => navigateTo('/directory')} style={styles.navLink}>
            <Text style={styles.navLinkText}>Directory</Text>
          </Pressable>
          <Pressable onPress={() => navigateTo('/jobs')} style={styles.navLink}>
            <Text style={styles.navLinkText}>Jobs</Text>
          </Pressable>
          <Pressable onPress={() => navigateTo('/about')} style={styles.navLink}>
            <Text style={styles.navLinkText}>About</Text>
          </Pressable>
          <Pressable onPress={() => navigateTo('/my-cards')} style={styles.navLink}>
            <Text style={styles.navLinkText}>My Cards</Text>
          </Pressable>
          {!authUser && !authLoading && (
            <Pressable onPress={() => navigateTo('/auth/login')} style={styles.navLink}>
              <Text style={styles.navLinkText}>Sign In</Text>
            </Pressable>
          )}
          {/* Theme Toggle */}
          <Pressable onPress={toggleTheme} style={styles.themeToggle}>
            <Ionicons 
              name={isDark ? 'sunny' : 'moon'} 
              size={20} 
              color={isDark ? colors.warning : colors.primary} 
            />
          </Pressable>
          {showCreate && (
            <Pressable onPress={() => navigateTo('/create')} style={styles.createCardBtn}>
              <Text style={styles.createCardBtnText}>Create Card</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

// Dynamic styles based on theme
const createStyles = (colors: any) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.bgElevated,
    backgroundColor: colors.bg,
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
  themeToggle: {
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.bgElevated,
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

  // Mobile Styles
  mobileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuButton: {
    padding: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  mobileMenu: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    maxHeight: '80%',
  },
  mobileMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.bgElevated,
    marginBottom: spacing.md,
  },
  mobileMenuTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  mobileNavLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  mobileNavLinkText: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  mobileMenuDivider: {
    height: 1,
    backgroundColor: colors.bgElevated,
    marginVertical: spacing.md,
  },
  mobileUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  mobileUserEmail: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  mobileCreateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  mobileCreateBtnText: {
    color: colors.textInverse,
    fontSize: typography.sizes.md,
    fontWeight: '700',
  },
});
