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
import { signUp, isUsingSupabase } from '../../src/lib/store';

export default function SignupScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateForm = (): string | null => {
    if (!displayName.trim()) return 'Please enter your name';
    if (!email.trim()) return 'Please enter your email';
    if (!password) return 'Please enter a password';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSignup = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signUp(email.trim(), password, displayName.trim());
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If Supabase isn't configured, show info message
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
              Account creation requires Supabase to be configured. The app is currently running in local-only mode.
            </Text>
            <Text style={styles.notConfiguredText}>
              You can still create local profiles without an account!
            </Text>
            <Pressable
              style={styles.createLocalButton}
              onPress={() => router.replace('/create')}
            >
              <Text style={styles.createLocalText}>Create Local Profile</Text>
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
              <Ionicons name="checkmark-circle" size={80} color={colors.success} />
            </View>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successText}>
              We've sent a confirmation link to{'\n'}
              <Text style={styles.successEmail}>{email}</Text>
            </Text>
            <Text style={styles.successHint}>
              Click the link in the email to activate your account, then come back and sign in.
            </Text>
            <Pressable
              style={styles.successButton}
              onPress={() => router.replace('/auth/login')}
            >
              <Text style={styles.successButtonText}>Go to Sign In</Text>
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
      
      {/* Decorative elements */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

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
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>
                Network<Text style={styles.logoAccent}>20</Text>
              </Text>
              <Text style={styles.subtitle}>Create your account</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={20} color={colors.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Display Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color={colors.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="Your name"
                    placeholderTextColor={colors.textMuted}
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                </View>
              </View>

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
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="At least 6 characters"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="new-password"
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.textMuted}
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor={colors.textMuted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="new-password"
                  />
                </View>
              </View>

              <Pressable
                style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                onPress={handleSignup}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.signupButtonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color={colors.textInverse} />
                  ) : (
                    <Text style={styles.signupButtonText}>Create Account</Text>
                  )}
                </LinearGradient>
              </Pressable>

              <Text style={styles.terms}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            {/* Sign in link */}
            <View style={styles.signinContainer}>
              <Text style={styles.signinText}>Already have an account? </Text>
              <Link href="/auth/login" asChild>
                <Pressable>
                  <Text style={styles.signinLink}>Sign in</Text>
                </Pressable>
              </Link>
            </View>
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
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  logoAccent: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
    marginTop: spacing.sm,
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
  signupButton: {
    borderRadius: radius.md,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonGradient: {
    paddingVertical: spacing.md + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonText: {
    color: colors.textInverse,
    fontSize: typography.sizes.md,
    fontWeight: '700',
  },
  terms: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
  },
  signinLink: {
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
  createLocalButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  createLocalText: {
    color: colors.textInverse,
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

