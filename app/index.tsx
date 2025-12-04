import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../src/lib/theme';
import { Avatar, Card, Chip, Badge, Button } from '../src/components/ui';
import { getProfiles, getCurrentUser, type Profile } from '../src/lib/store';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'available'>('all');

  const loadData = useCallback(async () => {
    const [allProfiles, user] = await Promise.all([
      getProfiles(),
      getCurrentUser(),
    ]);
    setProfiles(allProfiles);
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const filteredProfiles = profiles.filter(p => {
    // Apply availability filter
    if (filter === 'available' && !p.is_available) return false;
    
    // Apply search
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.display_name.toLowerCase().includes(q) ||
      p.tagline?.toLowerCase().includes(q) ||
      p.skills.some(s => s.toLowerCase().includes(q)) ||
      p.location?.toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.container}>
      {/* Gradient Background Effect */}
      <LinearGradient
        colors={['#1a0a0f', colors.bg, '#0a1a1f']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Decorative Elements */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              NW20<Text style={styles.logoAccent}>Card</Text>
            </Text>
            <Text style={styles.tagline}>Your Work Identity</Text>
          </View>
          
          <View style={styles.headerActions}>
            {currentUser && (
              <Pressable
                onPress={() => router.push('/my-cards')}
                style={styles.cardsButton}
              >
                <Ionicons name="card-outline" size={20} color={colors.textPrimary} />
              </Pressable>
            )}
            <Pressable
              onPress={() => router.push(currentUser ? '/profile' : '/create')}
              style={styles.profileButton}
            >
              {currentUser ? (
                <Avatar name={currentUser.display_name} size={44} />
              ) : (
                <View style={styles.addProfileIcon}>
                  <Ionicons name="add" size={24} color={colors.primary} />
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={20} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search skills, people, locations..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textMuted} />
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          <Pressable
            style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All People
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterChip, filter === 'available' && styles.filterChipActive]}
            onPress={() => setFilter('available')}
          >
            <View style={styles.availableDot} />
            <Text style={[styles.filterText, filter === 'available' && styles.filterTextActive]}>
              Available Now
            </Text>
          </Pressable>
        </View>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <Text style={styles.statsText}>
            <Text style={styles.statsNumber}>{filteredProfiles.length}</Text> people in the network
          </Text>
        </View>

        {/* Profiles List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {filteredProfiles.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="card-outline" size={64} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>
                {searchQuery ? 'No cards found' : 'Welcome to NW20 Card'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ? (
                  'Try a different search term'
                ) : (
                  'Create your NW20 Card to get started!\n\n' +
                  '• Showcase your skills and abilities\n' +
                  '• Get a QR code to share instantly\n' +
                  '• Be searchable in the directory\n' +
                  '• Get discovered by people who need you'
                )}
              </Text>
              {!currentUser && (
                <Button
                  onPress={() => router.push('/create')}
                  style={{ marginTop: spacing.lg }}
                  size="lg"
                >
                  Create Your NW20 Card
                </Button>
              )}
            </View>
          ) : (
            filteredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))
          )}
          
          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Floating Action Button */}
        {!currentUser && (
          <Pressable
            style={styles.fab}
            onPress={() => router.push('/create')}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.fabGradient}
            >
              <Ionicons name="add" size={28} color={colors.textInverse} />
            </LinearGradient>
          </Pressable>
        )}
      </SafeAreaView>
    </View>
  );
}

// Profile Card Component
function ProfileCard({ profile }: { profile: Profile }) {
  const router = useRouter();
  
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/profile/${profile.id}`)}
    >
      <View style={styles.cardHeader}>
        <Avatar name={profile.display_name} size={56} />
        <View style={styles.cardHeaderText}>
          <View style={styles.nameRow}>
            <Text style={styles.cardName}>{profile.display_name}</Text>
            {profile.is_available && (
              <Badge variant="success">Available</Badge>
            )}
          </View>
          {profile.tagline && (
            <Text style={styles.cardTagline} numberOfLines={1}>
              {profile.tagline}
            </Text>
          )}
          {profile.location && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={colors.textMuted} />
              <Text style={styles.locationText}>{profile.location}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Skills */}
      {profile.skills.length > 0 && (
        <View style={styles.skillsRow}>
          {profile.skills.slice(0, 4).map((skill, i) => (
            <Chip key={i} variant="primary">{skill}</Chip>
          ))}
          {profile.skills.length > 4 && (
            <Chip variant="default">+{profile.skills.length - 4}</Chip>
          )}
        </View>
      )}

      {/* Quick Stats */}
      <View style={styles.cardFooter}>
        {profile.hours_available && (
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={16} color={colors.accent} />
            <Text style={styles.statText}>
              {profile.hours_available}hrs/{profile.hours_frequency}
            </Text>
          </View>
        )}
        {profile.pay_rate && (
          <View style={styles.statItem}>
            <Ionicons name="cash-outline" size={16} color={colors.accent} />
            <Text style={styles.statText}>{profile.pay_rate}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  safeArea: {
    flex: 1,
  },
  
  // Decorative
  decorCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primary,
    opacity: 0.05,
  },
  decorCircle2: {
    position: 'absolute',
    bottom: 100,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: colors.accent,
    opacity: 0.03,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  logo: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  logoAccent: {
    color: colors.primary,
  },
  tagline: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButton: {
    padding: 2,
  },
  addProfileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bgElevated,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
  },

  // Filters
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.bgCard,
    gap: spacing.xs,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.textInverse,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },

  // Stats
  statsBar: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  statsText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  statsNumber: {
    color: colors.primary,
    fontWeight: '700',
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },

  // Card
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: spacing.md,
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
    marginTop: spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.bgElevated,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
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
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

