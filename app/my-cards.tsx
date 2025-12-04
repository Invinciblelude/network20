import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../src/lib/theme';
import { Avatar, Card, Button, Badge } from '../src/components/ui';
import {
  getProfiles,
  getCurrentUserId,
  setCurrentUserId,
  deleteProfile,
  type Profile,
} from '../src/lib/store';

export default function MyCardsScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentUserId, setCurrentUserIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    const [allProfiles, currentId] = await Promise.all([
      getProfiles(),
      getCurrentUserId(),
    ]);
    setProfiles(allProfiles);
    setCurrentUserIdState(currentId);
    setLoading(false);
  }

  async function switchProfile(id: string) {
    await setCurrentUserId(id);
    setCurrentUserIdState(id);
    router.replace('/');
  }

  async function handleDelete(id: string, name: string) {
    Alert.alert(
      'Delete Card',
      `Are you sure you want to delete "${name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteProfile(id);
            if (currentUserId === id) {
              await setCurrentUserId(null);
              setCurrentUserIdState(null);
            }
            await loadProfiles();
          },
        },
      ]
    );
  }

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
        colors={['#1a0a0f', colors.bg, '#0a1a1f']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>My W2 Cards</Text>
          <Pressable
            onPress={() => router.push('/create')}
            style={styles.addButton}
          >
            <Ionicons name="add" size={24} color={colors.primary} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {profiles.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="card-outline" size={64} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No cards yet</Text>
              <Text style={styles.emptySubtitle}>
                Create your first W2 Card to get started!
              </Text>
              <Button
                onPress={() => router.push('/create')}
                style={{ marginTop: spacing.lg }}
              >
                Create Your First W2 Card
              </Button>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>
                {profiles.length} {profiles.length === 1 ? 'Card' : 'Cards'}
              </Text>
              <Text style={styles.sectionSubtitle}>
                Switch between cards or create a new one
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
                        <Text style={styles.actionButtonText}>Switch to This Card</Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        style={[styles.actionButton, styles.viewButton]}
                        onPress={() => router.push(`/profile/${profile.id}`)}
                      >
                        <Ionicons name="eye-outline" size={20} color={colors.textPrimary} />
                        <Text style={[styles.actionButtonText, { color: colors.textPrimary }]}>
                          View Card
                        </Text>
                      </Pressable>
                    )}
                    <Pressable
                      style={[styles.actionButton, styles.editButton]}
                      onPress={() => router.push(`/profile`)}
                    >
                      <Ionicons name="pencil-outline" size={20} color={colors.accent} />
                      <Text style={[styles.actionButtonText, { color: colors.accent }]}>
                        Edit
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDelete(profile.id, profile.display_name)}
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
                style={{ marginTop: spacing.xl }}
                fullWidth
              >
                <Ionicons name="add-circle-outline" size={20} color={colors.textPrimary} />
                <Text style={{ marginLeft: spacing.xs, color: colors.textPrimary, fontWeight: '700' }}>
                  Create Another W2 Card
                </Text>
              </Button>

              <View style={{ height: 50 }} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.bgElevated,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },

  // Section
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
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

