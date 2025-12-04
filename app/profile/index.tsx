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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../src/lib/theme';
import { Avatar, Button } from '../../src/components/ui';
import {
  getCurrentUser,
  updateProfile,
  deleteProfile,
  setCurrentUserId,
  type Profile,
} from '../../src/lib/store';

export default function EditProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [hoursAvailable, setHoursAvailable] = useState('');
  const [payRate, setPayRate] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) {
        router.replace('/create');
        return;
      }
      setProfile(user);
      setDisplayName(user.display_name);
      setTagline(user.tagline || '');
      setBio(user.bio || '');
      setLocation(user.location || '');
      setHoursAvailable(user.hours_available?.toString() || '');
      setPayRate(user.pay_rate || '');
      setContactEmail(user.contact_email || '');
      setResumeUrl(user.resume_url || '');
      setIsAvailable(user.is_available);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!profile || !displayName.trim()) return;

    setSaving(true);
    try {
      await updateProfile(profile.id, {
        display_name: displayName.trim(),
        tagline: tagline.trim() || null,
        bio: bio.trim() || null,
        location: location.trim() || null,
        hours_available: hoursAvailable ? parseInt(hoursAvailable) : null,
        pay_rate: payRate.trim() || null,
        contact_email: contactEmail.trim() || null,
        resume_url: resumeUrl.trim() || null,
        is_available: isAvailable,
      });
      router.back();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = typeof window !== 'undefined'
      ? window.confirm('Delete this card? This cannot be undone.')
      : true;
    
    if (confirmed && profile) {
      await deleteProfile(profile.id);
      await setCurrentUserId(null);
      router.replace('/');
    }
  };

  const handleSwitchCard = async () => {
    await setCurrentUserId(null);
    router.replace('/my-cards');
  };

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
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profile</Text>
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
              <Text style={styles.label}>Display Name</Text>
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
            <Text style={styles.dangerTitle}>Manage Card</Text>
            <Pressable style={styles.dangerButton} onPress={handleSwitchCard}>
              <Ionicons name="swap-horizontal-outline" size={20} color={colors.accent} />
              <Text style={[styles.dangerButtonText, { color: colors.accent }]}>Switch to Another Card</Text>
            </Pressable>
            <Pressable style={styles.dangerButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
              <Text style={[styles.dangerButtonText, { color: colors.error }]}>
                Delete This Card
              </Text>
            </Pressable>
          </View>

          {/* Back to Directory */}
          <Pressable 
            style={styles.backToHome}
            onPress={() => router.push('/')}
          >
            <Ionicons name="grid-outline" size={18} color={colors.textMuted} />
            <Text style={styles.backToHomeText}>Back to Directory</Text>
          </Pressable>

          <View style={{ height: 50 }} />
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
  backToHome: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  backToHomeText: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    fontWeight: '500',
  },
});

