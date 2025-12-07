import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { spacing, radius, typography } from '../src/lib/theme';
import { Button, useToast } from '../src/components/ui';
import { Header } from '../src/components/layout/Header';
import { Footer } from '../src/components/layout/Footer';
import { createJob } from '../src/lib/supabase';
import { useTheme } from '../src/context/ThemeContext';

export default function HireScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors, gradientColors } = useTheme();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auto-expand form if coming with ?post=true
  useEffect(() => {
    if (params.post === 'true') {
      setShowForm(true);
    }
  }, [params.post]);
  
  // Form state
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [payRange, setPayRange] = useState('');
  const [skillsNeeded, setSkillsNeeded] = useState('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const handleSubmitJob = async () => {
    if (!companyName.trim() || !jobTitle.trim() || !contactEmail.trim()) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await createJob({
        company_name: companyName.trim(),
        job_title: jobTitle.trim(),
        location: location.trim() || null,
        pay_range: payRange.trim() || null,
        skills_needed: skillsNeeded.split(',').map(s => s.trim()).filter(Boolean),
        description: description.trim() || null,
        contact_email: contactEmail.trim(),
      });
      showToast('Job posted successfully!', 'success');
      // Reset form
      setCompanyName('');
      setJobTitle('');
      setLocation('');
      setPayRange('');
      setSkillsNeeded('');
      setDescription('');
      setContactEmail('');
      setShowForm(false);
      router.push('/jobs');
    } catch (error) {
      console.error('Error posting job:', error);
      showToast('Failed to post job', 'error');
    } finally {
      setSubmitting(false);
    }
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
        >
          {/* Page Title */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>For Employers</Text>
            <Text style={styles.pageSubtitle}>
              Find talent fast or post a job.
            </Text>
          </View>

          {/* Hero Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>7+</Text>
              <Text style={styles.statLabel}>Candidates</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Skills</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>24hr</Text>
              <Text style={styles.statLabel}>Response</Text>
            </View>
          </View>

          {/* Benefits */}
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>Why Network 20?</Text>
            
            <View style={styles.benefitCard}>
              <Ionicons name="time-outline" size={28} color={colors.success} />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitHeading}>Skip the Job Boards</Text>
                <Text style={styles.benefitDesc}>
                  No more sifting through hundreds of unqualified resumes. Our candidates are ready to work.
                </Text>
              </View>
            </View>

            <View style={styles.benefitCard}>
              <Ionicons name="filter-outline" size={28} color={colors.primary} />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitHeading}>Filter by Skills</Text>
                <Text style={styles.benefitDesc}>
                  Search by specific skills, location, availability, and rate to find the perfect match.
                </Text>
              </View>
            </View>

            <View style={styles.benefitCard}>
              <Ionicons name="call-outline" size={28} color={colors.accent} />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitHeading}>Direct Contact</Text>
                <Text style={styles.benefitDesc}>
                  Reach out directly to candidates. No middleman, no fees, no delays.
                </Text>
              </View>
            </View>

            <View style={styles.benefitCard}>
              <Ionicons name="people-outline" size={28} color={colors.warning} />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitHeading}>Gen Z Workforce</Text>
                <Text style={styles.benefitDesc}>
                  Access the next generation of workers who are eager, adaptable, and tech-savvy.
                </Text>
              </View>
            </View>
          </View>

          {/* CTA */}
          <View style={styles.ctaSection}>
            <Button
              onPress={() => router.push('/directory')}
              size="lg"
              style={styles.ctaButton}
            >
              <Ionicons name="search" size={20} color={colors.textInverse} />
              <Text style={styles.ctaButtonText}>Browse Talent Directory</Text>
            </Button>
            
            <Button
              onPress={() => router.push('/jobs')}
              variant="secondary"
              style={{ marginTop: spacing.md }}
            >
              View Job Listings
            </Button>
          </View>

          {/* Post Job Section */}
          <View style={styles.postJobSection}>
            <Pressable 
              style={styles.postJobHeader}
              onPress={() => setShowForm(!showForm)}
            >
              <View style={styles.postJobHeaderLeft}>
                <Ionicons name="add-circle" size={28} color={colors.primary} />
                <View>
                  <Text style={styles.postJobTitle}>Post a Job</Text>
                  <Text style={styles.postJobSubtitle}>Free • Takes 2 minutes</Text>
                </View>
              </View>
              <Ionicons 
                name={showForm ? 'chevron-up' : 'chevron-down'} 
                size={24} 
                color={colors.textMuted} 
              />
            </Pressable>

            {showForm && (
              <View style={styles.postJobForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Company Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={companyName}
                    onChangeText={setCompanyName}
                    placeholder="Your company name"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Job Title *</Text>
                  <TextInput
                    style={styles.input}
                    value={jobTitle}
                    onChangeText={setJobTitle}
                    placeholder="e.g., General Laborer, Developer"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Location</Text>
                  <TextInput
                    style={styles.input}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="e.g., Sacramento, CA or Remote"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Pay Range</Text>
                  <TextInput
                    style={styles.input}
                    value={payRange}
                    onChangeText={setPayRange}
                    placeholder="e.g., $20-25/hr or $60-80k/year"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Skills Needed (comma separated)</Text>
                  <TextInput
                    style={styles.input}
                    value={skillsNeeded}
                    onChangeText={setSkillsNeeded}
                    placeholder="e.g., Construction, Carpentry, Teamwork"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Job Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Tell candidates about the role..."
                    placeholderTextColor={colors.textMuted}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Contact Email *</Text>
                  <TextInput
                    style={styles.input}
                    value={contactEmail}
                    onChangeText={setContactEmail}
                    placeholder="hr@yourcompany.com"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <Button
                  onPress={handleSubmitJob}
                  disabled={submitting}
                  size="lg"
                  style={{ marginTop: spacing.md }}
                >
                  {submitting ? (
                    <ActivityIndicator color={colors.textInverse} />
                  ) : (
                    'Post Job'
                  )}
                </Button>
              </View>
            )}
          </View>

          {/* Enterprise */}
          <View style={styles.enterpriseBox}>
            <Text style={styles.enterpriseTitle}>Enterprise Hiring?</Text>
            <Text style={styles.enterpriseDesc}>
              Need to hire multiple people or want a custom solution? Let's talk.
            </Text>
            <Pressable 
              style={styles.enterpriseLink}
              onPress={() => {
                if (typeof window !== 'undefined') {
                  window.open('mailto:nestinghome916@gmail.com?subject=Enterprise%20Hiring%20Inquiry', '_blank');
                }
              }}
            >
              <Ionicons name="mail-outline" size={18} color={colors.primary} />
              <Text style={styles.enterpriseLinkText}>Contact Us</Text>
            </Pressable>
          </View>

          {/* Looking for work? */}
          <View style={styles.switchSection}>
            <Text style={styles.switchText}>Looking for work instead?</Text>
            <Pressable onPress={() => router.push('/create')}>
              <Text style={styles.switchLink}>Create your NW20 Card →</Text>
            </Pressable>
          </View>

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

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  statNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: '800',
    color: colors.accent,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  // Benefits
  benefitsSection: {
    marginBottom: spacing.xl,
  },
  benefitsTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  benefitContent: {
    flex: 1,
  },
  benefitHeading: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  benefitDesc: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },

  // CTA
  ctaSection: {
    marginBottom: spacing.xl,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  ctaButtonText: {
    color: colors.textInverse,
    fontSize: typography.sizes.md,
    fontWeight: '700',
  },

  // Post Job Section
  postJobSection: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  postJobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  postJobHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  postJobTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  postJobSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  postJobForm: {
    padding: spacing.lg,
    paddingTop: 0,
    gap: spacing.md,
  },
  inputGroup: {},
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.bgInput,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 100,
    paddingTop: spacing.md,
  },

  // Enterprise
  enterpriseBox: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  enterpriseTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  enterpriseDesc: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  enterpriseLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  enterpriseLinkText: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: '600',
  },

  // Switch
  switchSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  switchText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  switchLink: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: '600',
  },
});
