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
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../src/lib/theme';
import { Button } from '../../src/components/ui';
import { useAuth } from '../../src/context/AuthContext';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, loading } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async () => {
    if (!displayName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await signUp(email, password, displayName);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Text style={styles.successTitle}>Account Created!</Text>
            <Text style={styles.successText}>
              Check your email ({email}) to verify your account, then sign in to create your NW20 Card.
            </Text>
            <Button
              onPress={() => router.replace('/auth/login')}
              size="lg"
              style={{ marginTop: spacing.xl }}
            >
              Go to Sign In
            </Button>
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
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back Button */}
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </Pressable>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.logo}>
                NW20<Text style={styles.logoAccent}>Card</Text>
              </Text>
              <Text style={styles.title}>Create Your Account</Text>
              <Text style={styles.subtitle}>
                Sign up to own your credentials and market yourself for jobs
              </Text>
            </View>

            {/* Benefits */}
            <View style={styles.benefitsBox}>
              <View style={styles.benefitRow}>
                <Ionicons name="shield-checkmark" size={20} color={colors.success} />
                <Text style={styles.benefitText}>Own your professional credentials</Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="pencil" size={20} color={colors.success} />
                <Text style={styles.benefitText}>Edit your card anytime, anywhere</Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="analytics" size={20} color={colors.success} />
                <Text style={styles.benefitText}>Track who's viewing your profile</Text>
              </View>
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={20} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Your Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color={colors.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="John Doe"
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
                    placeholder="Re-enter your password"
                    placeholderTextColor={colors.textMuted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="new-password"
                  />
                </View>
              </View>
            </View>

            {/* Submit Button */}
            <Button
              onPress={handleSignUp}
              disabled={isSubmitting || loading}
              size="lg"
              style={styles.submitButton}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Sign In Link */}
            <View style={styles.signinRow}>
              <Text style={styles.signinText}>Already have an account? </Text>
              <Link href="/auth/login" asChild>
                <Pressable>
                  <Text style={styles.signinLink}>Sign In</Text>
                </Pressable>
              </Link>
            </View>

            {/* Terms */}
            <Text style={styles.termsText}>
              By creating an account, you agree to Network 20's Terms of Service and Privacy Policy
            </Text>
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
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -1,
    marginBottom: spacing.md,
  },
  logoAccent: {
    color: colors.primary,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  benefitsBox: {
    backgroundColor: `${colors.success}15`,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  benefitText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.error}20`,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    color: colors.error,
    fontSize: typography.sizes.sm,
  },
  form: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  submitButton: {
    marginBottom: spacing.lg,
  },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  signinText: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },
  signinLink: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: '600',
  },
  termsText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  successIcon: {
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  successText: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
});

