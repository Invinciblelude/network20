import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { spacing, radius, typography } from '../src/lib/theme';
import { useTheme } from '../src/context/ThemeContext';
import { Avatar, Card, Button, Badge, ConfirmModal, useToast } from '../src/components/ui';
import { Header } from '../src/components/layout/Header';
import { Footer } from '../src/components/layout/Footer';
import {
  getProfiles,
  getCurrentUserId,
  setCurrentUserId,
  deleteProfile,
  type Profile,
} from '../src/lib/store';
import { useAuth } from '../src/context/AuthContext';

export default function MyCardsScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user: authUser } = useAuth();
  const { colors, gradientColors } = useTheme();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentUserId, setCurrentUserIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ visible: boolean; id: string; name: string }>({
    visible: false,
    id: '',
    name: '',
  });

  useEffect(() => {
    loadProfiles();
  }, [authUser]);

  async function loadProfiles() {
    const [allProfiles, currentId] = await Promise.all([
      getProfiles(),
      getCurrentUserId(),
    ]);
    
    // Filter to only show profiles owned by the authenticated user
    const myProfiles = authUser 
      ? allProfiles.filter(p => p.user_id === authUser.id)
      : [];
    
    setProfiles(myProfiles);
    setCurrentUserIdState(currentId);
    setLoading(false);
  }

  async function switchProfile(id: string) {
    await setCurrentUserId(id);
    setCurrentUserIdState(id);
    showToast('Switched card', 'success');
    router.replace('/');
  }

  function handleDeletePress(id: string, name: string) {
    setDeleteModal({ visible: true, id, name });
  }

  async function confirmDelete() {
    const { id, name } = deleteModal;
    setDeleteModal({ visible: false, id: '', name: '' });
    
    await deleteProfile(id);
    if (currentUserId === id) {
      await setCurrentUserId(null);
      setCurrentUserIdState(null);
    }
    await loadProfiles();
    showToast(`"${name}" deleted`, 'success');
  }

  const styles = createStyles(colors);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors as any}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <ConfirmModal
        visible={deleteModal.visible}
        title="Delete Card"
        message={`Delete "${deleteModal.name}"? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ visible: false, id: '', name: '' })}
        destructive
      />

      <SafeAreaView style={styles.safeArea}>
        <Header showCreate={false} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Page Title */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>My NW20 Cards</Text>
            <Text style={styles.pageSubtitle}>
              Manage your employment cards.
            </Text>
          </View>

          {!authUser ? (
            <View style={styles.emptyState}>
              <Ionicons name="lock-closed-outline" size={64} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Sign in required</Text>
              <Text style={styles.emptySubtitle}>
                Sign in to create and manage your NW20 Cards
              </Text>
              <Button
                onPress={() => router.push('/auth/login')}
                style={{ marginTop: spacing.lg }}
              >
                Sign In
              </Button>
            </View>
          ) : profiles.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="card-outline" size={64} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No cards yet</Text>
              <Text style={styles.emptySubtitle}>
                Create your first NW20 Card to get started!
              </Text>
              <Button
                onPress={() => router.push('/create')}
                style={{ marginTop: spacing.lg }}
              >
                Create Your First NW20 Card
              </Button>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>
                {profiles.length} {profiles.length === 1 ? 'Card' : 'Cards'}
              </Text>

              {profiles.map((profile) => (
                <Card key={profile.id} style={styles.profileCard}>
                  <View style={styles.cardHeader}>
                    <Avatar name={profile.display_name} size={64} />
                    <View style={styles.cardHeaderText}>
                      <View style={styles.nameRow}>
                        <Text style={styles.cardName}>{profile.display_name}</Text>
                        {currentUserId === profile.id && (
                          <Badge variant="success">Active</Badge>
                        )}
                      </View>
                      {profile.tagline && (
                        <Text style={styles.cardTagline} numberOfLines={1}>
                          {profile.tagline}
                        </Text>
                      )}
                      {profile.location && (
                        <View style={styles.locationRow}>
                          <Ionicons
                            name="location-outline"
                            size={14}
                            color={colors.textMuted}
                          />
                          <Text style={styles.locationText}>{profile.location}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {profile.skills.length > 0 && (
                    <View style={styles.skillsRow}>
                      {profile.skills.slice(0, 3).map((skill, i) => (
                        <View key={i} style={styles.skillChip}>
                          <Text style={styles.skillText}>{skill}</Text>
                        </View>
                      ))}
                      {profile.skills.length > 3 && (
                        <Text style={styles.moreSkills}>
                          +{profile.skills.length - 3} more
                        </Text>
                      )}
                    </View>
                  )}

                  <View style={styles.cardActions}>
                    {currentUserId !== profile.id ? (
                      <Pressable
                        style={styles.actionButton}
                        onPress={() => switchProfile(profile.id)}
                      >
                        <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
                        <Text style={styles.actionButtonText}>Switch</Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        style={[styles.actionButton, styles.viewButton]}
                        onPress={() => router.push(`/profile/${profile.id}`)}
                      >
                        <Ionicons name="eye-outline" size={20} color={colors.textInverse} />
                        <Text style={[styles.actionButtonText, { color: colors.textInverse }]}>
                          View
                        </Text>
                      </Pressable>
                    )}
                    <Pressable
                      style={[styles.actionButton, styles.editButton]}
                      onPress={() => router.push(`/profile/edit/${profile.id}`)}
                    >
                      <Ionicons name="pencil-outline" size={20} color={colors.accent} />
                      <Text style={[styles.actionButtonText, { color: colors.accent }]}>
                        Edit
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeletePress(profile.id, profile.display_name)}
                    >
                      <Ionicons name="trash-outline" size={20} color={colors.error} />
                      <Text style={[styles.actionButtonText, { color: colors.error }]}>
                        Delete
                      </Text>
                    </Pressable>
                  </View>
                </Card>
              ))}

              <Button
                onPress={() => router.push('/create')}
                variant="secondary"
                style={{ marginTop: spacing.lg }}
                fullWidth
              >
                <Ionicons name="add-circle-outline" size={20} color={colors.textPrimary} />
                <Text style={{ marginLeft: spacing.xs, color: colors.textPrimary, fontWeight: '700' }}>
                  Create Another Card
                </Text>
              </Button>
            </>
          )}

          <Footer />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
  },
  loadingText: {
    fontSize: typography.sizes.lg,
    color: colors.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },

  // Page Header
  pageHeader: {
    paddingVertical: spacing.xl,
  },
  pageTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pageSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  // Section
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  // Profile Card
  profileCard: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeaderText: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  cardName: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardTagline: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  skillChip: {
    backgroundColor: `${colors.primary}20`,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
  },
  skillText: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
    color: colors.primary,
  },
  moreSkills: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    alignSelf: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.bgElevated,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.bgInput,
  },
  viewButton: {
    backgroundColor: colors.primary,
  },
  editButton: {
    backgroundColor: `${colors.accent}20`,
  },
  deleteButton: {
    backgroundColor: `${colors.error}20`,
  },
  actionButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.primary,
  },

  // Empty State
  emptyState: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
