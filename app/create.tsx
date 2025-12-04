import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../src/lib/theme';
import { Button, Avatar } from '../src/components/ui';
import { createProfile, getCurrentUserId, setCurrentUserId, type SocialLink } from '../src/lib/store';

type PayPreference = 'hourly' | 'project' | 'salary' | 'negotiable';

const PAY_OPTIONS: { value: PayPreference; label: string; icon: string }[] = [
  { value: 'hourly', label: 'Hourly', icon: 'time-outline' },
  { value: 'project', label: 'Per Project', icon: 'briefcase-outline' },
  { value: 'salary', label: 'Salary', icon: 'wallet-outline' },
  { value: 'negotiable', label: 'Negotiable', icon: 'chatbubbles-outline' },
];

const SOCIAL_PLATFORMS = [
  { key: 'twitter', label: 'Twitter/X', icon: 'logo-twitter', placeholder: '@username' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'logo-linkedin', placeholder: 'linkedin.com/in/...' },
  { key: 'instagram', label: 'Instagram', icon: 'logo-instagram', placeholder: '@username' },
  { key: 'github', label: 'GitHub', icon: 'logo-github', placeholder: 'github.com/...' },
  { key: 'website', label: 'Website', icon: 'globe-outline', placeholder: 'yoursite.com' },
];

export default function CreateProfileScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [displayName, setDisplayName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [hoursAvailable, setHoursAvailable] = useState('');
  const [hoursFrequency, setHoursFrequency] = useState<'week' | 'month'>('week');
  const [payPreference, setPayPreference] = useState<PayPreference | null>(null);
  const [payRate, setPayRate] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = async () => {
    if (!displayName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const socials: SocialLink[] = Object.entries(socialLinks)
        .filter(([_, handle]) => handle.trim())
        .map(([platform, handle]) => ({
          platform: platform as SocialLink['platform'],
          handle: handle.trim(),
        }));

      const newProfile = await createProfile({
        display_name: displayName.trim(),
        tagline: tagline.trim() || null,
        bio: bio.trim() || null,
        location: location.trim() || null,
        skills,
        hours_available: hoursAvailable ? parseInt(hoursAvailable) : null,
        hours_frequency: hoursFrequency,
        pay_preference: payPreference,
        pay_rate: payRate.trim() || null,
        contact_email: contactEmail.trim() || null,
        contact_phone: contactPhone.trim() || null,
        resume_url: resumeUrl.trim() || null,
        social_links: socials,
        avatar_url: null,
        is_available: true,
      });

      // Set as current user if it's the first profile, otherwise ask
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        await setCurrentUserId(newProfile.id);
      }

      router.replace('/');
    } catch (error) {
      console.error('Failed to create profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return displayName.trim().length > 0;
    if (step === 2) return skills.length > 0;
    return true;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a0a0f', colors.bg, '#0a1a1f']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </Pressable>
            <View style={styles.progressBar}>
              {[1, 2, 3, 4].map(i => (
                <View
                  key={i}
                  style={[
                    styles.progressDot,
                    i <= step && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>Create your W2 Card</Text>
                <Text style={styles.stepSubtitle}>
                  How should people find and recognize you?
                </Text>
                <View style={styles.instructionBox}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
                  <Text style={styles.instructionText}>
                    Use your real name, business name, or any name you're comfortable with. This is your public W2 Card identity.
                  </Text>
                </View>

                <View style={styles.previewCard}>
                  <Avatar name={displayName || 'You'} size={80} />
                  <Text style={styles.previewName}>
                    {displayName || 'Your Name'}
                  </Text>
                  <Text style={styles.previewTagline}>
                    {tagline || 'What do you do?'}
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Display Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Your name or alias"
                    placeholderTextColor={colors.textMuted}
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoFocus
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Tagline</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Full-Stack Developer & Designer"
                    placeholderTextColor={colors.textMuted}
                    value={tagline}
                    onChangeText={setTagline}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Location</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., San Francisco, CA or Remote"
                    placeholderTextColor={colors.textMuted}
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>About You</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Tell people about yourself..."
                    placeholderTextColor={colors.textMuted}
                    value={bio}
                    onChangeText={setBio}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            )}

            {/* Step 2: Skills */}
            {step === 2 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>What can you do?</Text>
                <Text style={styles.stepSubtitle}>
                  Add your skills so people can find you
                </Text>
                <View style={styles.instructionBox}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
                  <Text style={styles.instructionText}>
                    List your abilities, tools, or services. Examples: "React", "Design", "Writing", "Accounting", "Plumbing", etc.
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Add Skills</Text>
                  <View style={styles.skillInputRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="e.g., React, Design, Writing..."
                      placeholderTextColor={colors.textMuted}
                      value={skillInput}
                      onChangeText={setSkillInput}
                      onSubmitEditing={addSkill}
                      returnKeyType="done"
                    />
                    <Pressable style={styles.addSkillButton} onPress={addSkill}>
                      <Ionicons name="add" size={24} color={colors.textInverse} />
                    </Pressable>
                  </View>
                </View>

                {skills.length > 0 && (
                  <View style={styles.skillsContainer}>
                    {skills.map((skill, i) => (
                      <Pressable
                        key={i}
                        style={styles.skillChip}
                        onPress={() => removeSkill(skill)}
                      >
                        <Text style={styles.skillChipText}>{skill}</Text>
                        <Ionicons name="close" size={16} color={colors.primary} />
                      </Pressable>
                    ))}
                  </View>
                )}

                <Text style={styles.hint}>
                  Tap a skill to remove it
                </Text>
              </View>
            )}

            {/* Step 3: Availability & Pay */}
            {step === 3 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>Your availability</Text>
                <Text style={styles.stepSubtitle}>
                  Let people know when and how you work
                </Text>
                <View style={styles.instructionBox}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
                  <Text style={styles.instructionText}>
                    Be honest about your availability. You can update this anytime. Rate is optional but helps people know what to expect.
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Hours Available</Text>
                  <View style={styles.hoursRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="e.g., 20"
                      placeholderTextColor={colors.textMuted}
                      value={hoursAvailable}
                      onChangeText={setHoursAvailable}
                      keyboardType="number-pad"
                    />
                    <View style={styles.frequencyToggle}>
                      <Pressable
                        style={[
                          styles.frequencyOption,
                          hoursFrequency === 'week' && styles.frequencyOptionActive,
                        ]}
                        onPress={() => setHoursFrequency('week')}
                      >
                        <Text style={[
                          styles.frequencyText,
                          hoursFrequency === 'week' && styles.frequencyTextActive,
                        ]}>
                          /week
                        </Text>
                      </Pressable>
                      <Pressable
                        style={[
                          styles.frequencyOption,
                          hoursFrequency === 'month' && styles.frequencyOptionActive,
                        ]}
                        onPress={() => setHoursFrequency('month')}
                      >
                        <Text style={[
                          styles.frequencyText,
                          hoursFrequency === 'month' && styles.frequencyTextActive,
                        ]}>
                          /month
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>How do you prefer to get paid?</Text>
                  <View style={styles.payOptionsGrid}>
                    {PAY_OPTIONS.map(option => (
                      <Pressable
                        key={option.value}
                        style={[
                          styles.payOption,
                          payPreference === option.value && styles.payOptionActive,
                        ]}
                        onPress={() => setPayPreference(option.value)}
                      >
                        <Ionicons
                          name={option.icon as any}
                          size={24}
                          color={payPreference === option.value ? colors.primary : colors.textMuted}
                        />
                        <Text style={[
                          styles.payOptionText,
                          payPreference === option.value && styles.payOptionTextActive,
                        ]}>
                          {option.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Your Rate (optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., $50-75/hr or $2000/project"
                    placeholderTextColor={colors.textMuted}
                    value={payRate}
                    onChangeText={setPayRate}
                  />
                </View>
              </View>
            )}

            {/* Step 4: Contact */}
            {step === 4 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>How can people reach you?</Text>
                <Text style={styles.stepSubtitle}>
                  Add your contact info and socials
                </Text>
                <View style={styles.instructionBox}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
                  <Text style={styles.instructionText}>
                    All contact info is optional. Add what you're comfortable sharing. People will use this to reach out directly.
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor={colors.textMuted}
                    value={contactEmail}
                    onChangeText={setContactEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone (optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="(555) 123-4567"
                    placeholderTextColor={colors.textMuted}
                    value={contactPhone}
                    onChangeText={setContactPhone}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Resume URL (optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="https://your-resume.pdf or link to your resume"
                    placeholderTextColor={colors.textMuted}
                    value={resumeUrl}
                    onChangeText={setResumeUrl}
                    keyboardType="url"
                    autoCapitalize="none"
                  />
                  <Text style={styles.hint}>
                    Link to your resume (Google Drive, Dropbox, personal website, etc.)
                  </Text>
                </View>

                <Text style={[styles.label, { marginBottom: spacing.md }]}>
                  Social Links
                </Text>
                {SOCIAL_PLATFORMS.map(platform => (
                  <View key={platform.key} style={styles.socialInputRow}>
                    <View style={styles.socialIcon}>
                      <Ionicons
                        name={platform.icon as any}
                        size={20}
                        color={socialLinks[platform.key] ? colors.primary : colors.textMuted}
                      />
                    </View>
                    <TextInput
                      style={[styles.input, { flex: 1, marginBottom: 0 }]}
                      placeholder={platform.placeholder}
                      placeholderTextColor={colors.textMuted}
                      value={socialLinks[platform.key] || ''}
                      onChangeText={(text) =>
                        setSocialLinks({ ...socialLinks, [platform.key]: text })
                      }
                      autoCapitalize="none"
                    />
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.bottomActions}>
            {step > 1 && (
              <Button
                variant="ghost"
                onPress={() => setStep(step - 1)}
                style={{ flex: 1 }}
              >
                Back
              </Button>
            )}
            
            {step < 4 ? (
              <Button
                onPress={() => setStep(step + 1)}
                disabled={!canProceed()}
                style={{ flex: step > 1 ? 2 : 1 }}
                fullWidth={step === 1}
              >
                Continue
              </Button>
            ) : (
              <Button
                onPress={handleSubmit}
                loading={isSubmitting}
                style={{ flex: 2 }}
              >
                Create My W2 Card
              </Button>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
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
  keyboardView: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.bgElevated,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  // Step Container
  stepContainer: {
    paddingTop: spacing.lg,
  },
  stepTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  stepSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },

  // Preview Card
  previewCard: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
  },
  previewName: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  previewTagline: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Input
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
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

  // Skills
  skillInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  addSkillButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: `${colors.primary}20`,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
  },
  skillChipText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  hint: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  instructionBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: `${colors.accent}15`,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  instructionText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Hours
  hoursRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  frequencyToggle: {
    flexDirection: 'row',
    backgroundColor: colors.bgInput,
    borderRadius: radius.md,
    padding: 4,
  },
  frequencyOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  frequencyOptionActive: {
    backgroundColor: colors.primary,
  },
  frequencyText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.textMuted,
  },
  frequencyTextActive: {
    color: colors.textInverse,
  },

  // Pay Options
  payOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  payOption: {
    width: '48%',
    backgroundColor: colors.bgInput,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  payOptionActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  payOptionText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.textMuted,
  },
  payOptionTextActive: {
    color: colors.primary,
  },

  // Social
  socialInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  socialIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.bgInput,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bottom Actions
  bottomActions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.bgElevated,
  },
});

