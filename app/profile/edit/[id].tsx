import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { spacing, radius, typography } from '../../../src/lib/theme';
import { useTheme } from '../../../src/context/ThemeContext';
import { Avatar, Button, ConfirmModal, Chip, useToast } from '../../../src/components/ui';
import {
  getProfile,
  updateProfile,
  deleteProfile,
  setCurrentUserId,
  type Profile,
} from '../../../src/lib/store';
import { useAuth } from '../../../src/context/AuthContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useToast();
  const { user: authUser, signOut } = useAuth();
  const { colors, gradientColors } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [hoursAvailable, setHoursAvailable] = useState('');
  const [payRate, setPayRate] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) {
        router.replace('/');
        return;
      }
      
      const profileData = await getProfile(id);
      if (!profileData) {
        showToast('Profile not found', 'error');
        router.replace('/');
        return;
      }
      
      setProfile(profileData);
      // Pre-fill all form fields with existing data
      setDisplayName(profileData.display_name);
      setTagline(profileData.tagline || '');
      setBio(profileData.bio || '');
      setLocation(profileData.location || '');
      setSkills(profileData.skills || []);
      setHoursAvailable(profileData.hours_available?.toString() || '');
      setPayRate(profileData.pay_rate || '');
      setContactEmail(profileData.contact_email || '');
      setContactPhone(profileData.contact_phone || '');
      setResumeUrl(profileData.resume_url || '');
      setIsAvailable(profileData.is_available);
      setLoading(false);
    }
    load();
  }, [id]);

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

  const handleSave = async () => {
    if (!profile || !displayName.trim()) return;

    setSaving(true);
    try {
      await updateProfile(profile.id, {
        display_name: displayName.trim(),
        tagline: tagline.trim() || null,
        bio: bio.trim() || null,
        location: location.trim() || null,
        skills: skills,
        hours_available: hoursAvailable ? parseInt(hoursAvailable) : null,
        pay_rate: payRate.trim() || null,
        contact_email: contactEmail.trim() || null,
        contact_phone: contactPhone.trim() || null,
        resume_url: resumeUrl.trim() || null,
        is_available: isAvailable,
      });
      showToast('Profile saved!', 'success');
      router.replace(`/profile/${profile.id}`);
    } catch (error) {
      console.error('Failed to save:', error);
      showToast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (profile) {
      await deleteProfile(profile.id);
      await setCurrentUserId(null);
      showToast('Card deleted', 'success');
      router.replace('/');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      await setCurrentUserId(null);
      showToast('Logged out successfully', 'success');
      router.replace('/');
    } catch (error) {
      console.error('Failed to logout:', error);
      showToast('Failed to logout', 'error');
    }
  };

  const styles = createStyles(colors);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <LinearGradient
          colors={gradientColors as any}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
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

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Card</Text>
          <Pressable onPress={handleSave} disabled={saving}>
            <Text style={[styles.saveButton, saving && styles.saveButtonDisabled]}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <Avatar name={displayName || 'You'} size={100} />
            <Text style={styles.avatarHint}>
              Avatar is generated from your name
            </Text>
          </View>

          {/* Availability Toggle */}
          <Pressable
            style={styles.availabilityToggle}
            onPress={() => setIsAvailable(!isAvailable)}
          >
            <View style={styles.availabilityLeft}>
              <View style={[
                styles.availabilityDot,
                { backgroundColor: isAvailable ? colors.success : colors.textMuted }
              ]} />
              <Text style={styles.availabilityText}>
                {isAvailable ? 'Available for work' : 'Not available'}
              </Text>
            </View>
            <Ionicons
              name={isAvailable ? 'toggle' : 'toggle-outline'}
              size={32}
              color={isAvailable ? colors.success : colors.textMuted}
            />
          </Pressable>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Display Name *</Text>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Your name"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tagline</Text>
              <TextInput
                style={styles.input}
                value={tagline}
                onChangeText={setTagline}
                placeholder="What do you do?"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="City, State or Remote"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>About</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell people about yourself..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Skills */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Skills</Text>
              <View style={styles.skillInputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Add a skill..."
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
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hours Available (per week)</Text>
              <TextInput
                style={styles.input}
                value={hoursAvailable}
                onChangeText={setHoursAvailable}
                placeholder="e.g., 20"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rate</Text>
              <TextInput
                style={styles.input}
                value={payRate}
                onChangeText={setPayRate}
                placeholder="e.g., $50-75/hr"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Email</Text>
              <TextInput
                style={styles.input}
                value={contactEmail}
                onChangeText={setContactEmail}
                placeholder="your@email.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Phone</Text>
              <TextInput
                style={styles.input}
                value={contactPhone}
                onChangeText={setContactPhone}
                placeholder="(555) 123-4567"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Resume URL (optional)</Text>
              <TextInput
                style={styles.input}
                value={resumeUrl}
                onChangeText={setResumeUrl}
                placeholder="https://your-resume.pdf"
                placeholderTextColor={colors.textMuted}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Actions */}
          <View style={styles.dangerZone}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            <Pressable style={styles.dangerButton} onPress={() => setShowDeleteModal(true)}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
              <Text style={[styles.dangerButtonText, { color: colors.error }]}>
                Delete This Card
              </Text>
            </Pressable>
          </View>

          {/* Account Section - Only show if logged in */}
          {authUser && (
            <View style={styles.accountSection}>
              <Text style={styles.dangerTitle}>Account</Text>
              <View style={styles.accountInfo}>
                <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
                <Text style={styles.accountEmail}>{authUser.email}</Text>
              </View>
              <Pressable style={styles.dangerButton} onPress={() => setShowLogoutModal(true)}>
                <Ionicons name="log-out-outline" size={20} color={colors.warning} />
                <Text style={[styles.dangerButtonText, { color: colors.warning }]}>
                  Sign Out
                </Text>
              </Pressable>
            </View>
          )}

          <View style={{ height: 50 }} />
        </ScrollView>
      </SafeAreaView>
      
      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Card"
        message="Delete this card? This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        destructive
      />
      <ConfirmModal
        visible={showLogoutModal}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmText="Sign Out"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
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
  saveButton: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.primary,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatarHint: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },

  // Availability
  availabilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgCard,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xl,
  },
  availabilityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  availabilityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  availabilityText: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  // Form
  form: {
    gap: spacing.lg,
  },
  inputGroup: {},
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

  // Danger Zone
  dangerZone: {
    marginTop: spacing.xxl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.bgElevated,
  },
  dangerTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  dangerButtonText: {
    fontSize: typography.sizes.md,
    color: colors.warning,
  },

  // Account Section
  accountSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.bgElevated,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  accountEmail: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
});

