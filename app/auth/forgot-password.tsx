import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../src/lib/theme';
import { resetPassword, isUsingSupabase } from '../../src/lib/store';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(email.trim());
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If Supabase isn't configured
  if (!isUsingSupabase()) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a0a0f', colors.bg, '#0a1a1f']}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </Pressable>
          </View>
          
          <View style={styles.notConfigured}>
            <Ionicons name="cloud-offline-outline" size={80} color={colors.textMuted} />
            <Text style={styles.notConfiguredTitle}>Backend Not Configured</Text>
            <Text style={styles.notConfiguredText}>
              Password reset requires Supabase to be configured.
            </Text>
            <Pressable
              style={styles.backButton2}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Go Back</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Success state
  if (success) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a0a0f', colors.bg, '#0a1a1f']}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="mail-outline" size={80} color={colors.success} />
            </View>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successText}>
              We've sent password reset instructions to{'\n'}
              <Text style={styles.successEmail}>{email}</Text>
            </Text>
            <Text style={styles.successHint}>
              Click the link in the email to reset your password. If you don't see it, check your spam folder.
            </Text>
            <Pressable
              style={styles.successButton}
              onPress={() => router.replace('/auth/login')}
            >
              <Text style={styles.successButtonText}>Back to Sign In</Text>
            </Pressable>
          </View>
        </SafeAreaView>
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="key-outline" size={40} color={colors.primary} />
              </View>
            </View>

            {/* Content */}
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.description}>
              No worries! Enter your email address and we'll send you a link to reset your password.
            </Text>

            {/* Form */}
            <View style={styles.form}>
              {error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={20} color={colors.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    autoFocus
                  />
                </View>
              </View>

              <Pressable
                style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.resetButtonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color={colors.textInverse} />
                  ) : (
                    <Text style={styles.resetButtonText}>Send Reset Link</Text>
                  )}
                </LinearGradient>
              </Pressable>
            </View>

            {/* Back to login */}
            <Link href="/auth/login" asChild>
              <Pressable style={styles.backToLogin}>
                <Ionicons name="arrow-back" size={16} color={colors.primary} />
                <Text style={styles.backToLoginText}>Back to Sign In</Text>
              </Pressable>
            </Link>
          </ScrollView>
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  form: {
    marginBottom: spacing.xl,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: `${colors.error}15`,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  errorText: {
    flex: 1,
    color: colors.error,
    fontSize: typography.sizes.sm,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  resetButton: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  resetButtonGradient: {
    paddingVertical: spacing.md + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: colors.textInverse,
    fontSize: typography.sizes.md,
    fontWeight: '700',
  },
  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  backToLoginText: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
  notConfigured: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  notConfiguredTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  notConfiguredText: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 24,
  },
  backButton2: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  successIcon: {
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  successText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 24,
  },
  successEmail: {
    color: colors.primary,
    fontWeight: '600',
  },
  successHint: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 20,
  },
  successButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  successButtonText: {
    color: colors.textInverse,
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
});

