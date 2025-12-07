import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { spacing, radius, typography } from '../src/lib/theme';
import { Avatar, Chip, Badge, Button } from '../src/components/ui';
import { Header } from '../src/components/layout/Header';
import { Footer } from '../src/components/layout/Footer';
import { getProfiles, type Profile } from '../src/lib/store';
import { useTheme } from '../src/context/ThemeContext';

export default function DirectoryScreen() {
  const router = useRouter();
  const { colors, gradientColors } = useTheme();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'available'>('all');

  const loadData = useCallback(async () => {
    const allProfiles = await getProfiles();
    setProfiles(allProfiles);
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
    if (filter === 'available' && !p.is_available) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.display_name.toLowerCase().includes(q) ||
      p.tagline?.toLowerCase().includes(q) ||
      p.skills.some(s => s.toLowerCase().includes(q)) ||
      p.location?.toLowerCase().includes(q)
    );
  });

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors as any}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <Header />

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
          {/* Page Title */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Network Directory</Text>
            <Text style={styles.pageSubtitle}>
              Find professionals, freelancers, and workers.
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search" size={20} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, skill, or location..."
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

          {/* Results Count */}
          <Text style={styles.resultsCount}>
            {filteredProfiles.length} {filteredProfiles.length === 1 ? 'profile' : 'profiles'} found
          </Text>

          {/* Profiles List */}
          {filteredProfiles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No profiles found.</Text>
              <Pressable onPress={() => router.push('/create')}>
                <Text style={styles.emptyLink}>Be the first to join!</Text>
              </Pressable>
            </View>
          ) : (
            filteredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} colors={colors} />
            ))
          )}

          <Footer />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ProfileCard({ profile, colors }: { profile: Profile; colors: any }) {
  const router = useRouter();
  const styles = createStyles(colors);
  
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

      {(profile.hours_available || profile.pay_rate) && (
        <View style={styles.cardFooter}>
          {profile.hours_available && (
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={colors.accent} />
              <Text style={styles.metaText}>
                {profile.hours_available}hrs/{profile.hours_frequency}
              </Text>
            </View>
          )}
          {profile.pay_rate && (
            <View style={styles.metaItem}>
              <Ionicons name="cash-outline" size={16} color={colors.accent} />
              <Text style={styles.metaText}>{profile.pay_rate}</Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  safeArea: {
    flex: 1,
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

  // Search
  searchContainer: {
    marginBottom: spacing.md,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },

  // Filters
  filterRow: {
    flexDirection: 'row',
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

  // Results
  resultsCount: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.lg,
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
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },
  emptyLink: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: '600',
    marginTop: spacing.sm,
  },

  // Card
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
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
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
});
