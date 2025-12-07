import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  RefreshControl,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { spacing, radius, typography } from '../src/lib/theme';
import { Button, Chip } from '../src/components/ui';
import { Header } from '../src/components/layout/Header';
import { Footer } from '../src/components/layout/Footer';
import { getJobs, searchJobs, type Job } from '../src/lib/supabase';
import { useTheme } from '../src/context/ThemeContext';

export default function JobsScreen() {
  const router = useRouter();
  const { colors, gradientColors } = useTheme();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadJobs = useCallback(async () => {
    const data = searchQuery 
      ? await searchJobs(searchQuery)
      : await getJobs();
    setJobs(data);
    setLoading(false);
  }, [searchQuery]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  }, [loadJobs]);

  const handleApply = (email: string, jobTitle: string) => {
    const subject = encodeURIComponent(`Application for ${jobTitle}`);
    const body = encodeURIComponent(`Hi,\n\nI'm interested in the ${jobTitle} position.\n\nPlease find my Network 20 card here: [Your NW20 Card Link]\n\nBest regards`);
    Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
  };

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
            <Text style={styles.pageTitle}>Job Openings</Text>
            <Text style={styles.pageSubtitle}>
              Find your next opportunity.
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search" size={20} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by title, company, location..."
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

          {/* Results Count + Post Job Button */}
          <View style={styles.actionRow}>
            <Text style={styles.resultsCount}>
              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} available
            </Text>
            <Pressable
              style={styles.postBtn}
              onPress={() => router.push('/hire?post=true')}
            >
              <Ionicons name="add" size={18} color={colors.primary} />
              <Text style={styles.postBtnText}>Post a Job</Text>
            </Pressable>
          </View>

          {/* Jobs List */}
          {loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Loading jobs...</Text>
            </View>
          ) : jobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="briefcase-outline" size={64} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>
                {searchQuery ? 'No jobs found' : 'No jobs posted yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery 
                  ? 'Try a different search term'
                  : 'Be the first to post a job opening!'
                }
              </Text>
              {!searchQuery && (
                <Button
                  onPress={() => router.push('/hire?post=true')}
                  style={{ marginTop: spacing.lg }}
                >
                  Post a Job
                </Button>
              )}
            </View>
          ) : (
            <>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} onApply={handleApply} colors={colors} />
              ))}

              {/* Post Job CTA */}
              <View style={styles.postCta}>
                <Text style={styles.postCtaText}>Are you hiring?</Text>
                <Button
                  onPress={() => router.push('/hire?post=true')}
                  variant="secondary"
                >
                  Post a Job - It's Free
                </Button>
              </View>
            </>
          )}

          <Footer />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Job Card Component
function JobCard({ job, onApply, colors }: { job: Job; onApply: (email: string, title: string) => void; colors: any }) {
  const [expanded, setExpanded] = useState(false);
  const styles = createStyles(colors);

  return (
    <Pressable style={styles.jobCard} onPress={() => setExpanded(!expanded)}>
      <View style={styles.jobHeader}>
        <View style={styles.jobIcon}>
          <Ionicons name="business" size={24} color={colors.accent} />
        </View>
        <View style={styles.jobHeaderText}>
          <Text style={styles.companyName}>{job.company_name}</Text>
          <Text style={styles.jobTitle}>{job.job_title}</Text>
        </View>
        <Ionicons 
          name={expanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={colors.textMuted} 
        />
      </View>

      <View style={styles.jobMeta}>
        {job.location && (
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={16} color={colors.textMuted} />
            <Text style={styles.metaText}>{job.location}</Text>
          </View>
        )}
        {job.pay_range && (
          <View style={styles.metaItem}>
            <Ionicons name="cash-outline" size={16} color={colors.textMuted} />
            <Text style={styles.metaText}>{job.pay_range}</Text>
          </View>
        )}
      </View>

      {job.skills_needed && job.skills_needed.length > 0 && (
        <View style={styles.skillsRow}>
          {job.skills_needed.slice(0, 4).map((skill, i) => (
            <Chip key={i} variant="primary">{skill}</Chip>
          ))}
          {job.skills_needed.length > 4 && (
            <Chip variant="default">+{job.skills_needed.length - 4}</Chip>
          )}
        </View>
      )}

      {expanded && (
        <View style={styles.expandedContent}>
          {job.description && (
            <Text style={styles.description}>{job.description}</Text>
          )}
          <Pressable
            style={styles.applyButton}
            onPress={() => onApply(job.contact_email, job.job_title)}
          >
            <Ionicons name="mail-outline" size={18} color={colors.textInverse} />
            <Text style={styles.applyButtonText}>Apply Now</Text>
          </Pressable>
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

  // Action Row
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resultsCount: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  postBtnText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: '600',
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
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },

  // Job Card
  jobCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  jobIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: `${colors.accent}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobHeaderText: {
    flex: 1,
  },
  companyName: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  jobTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  jobMeta: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  expandedContent: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.bgElevated,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  applyButtonText: {
    color: colors.textInverse,
    fontSize: typography.sizes.md,
    fontWeight: '700',
  },

  // Post CTA
  postCta: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.bgElevated,
    marginTop: spacing.md,
  },
  postCtaText: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
});
