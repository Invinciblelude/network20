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

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to access your NW20 Card and market yourself
              </Text>
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
                    placeholder="••••••••"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
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

              <Link href="/auth/forgot-password" asChild>
                <Pressable style={styles.forgotLink}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </Pressable>
              </Link>
            </View>

            {/* Submit Button */}
            <Button
              onPress={handleLogin}
              disabled={isSubmitting || loading}
              size="lg"
              style={styles.submitButton}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Sign Up Link */}
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <Link href="/auth/signup" asChild>
                <Pressable>
                  <Text style={styles.signupLink}>Create one</Text>
                </Pressable>
              </Link>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            {/* Continue without account */}
            <Pressable
              style={styles.guestButton}
              onPress={() => router.push('/create')}
            >
              <Text style={styles.guestButtonText}>
                Continue as Guest
              </Text>
            </Pressable>
            <Text style={styles.guestNote}>
              Create a card without an account (limited features)
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
    marginBottom: spacing.xl,
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
  forgotLink: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  submitButton: {
    marginBottom: spacing.lg,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  signupText: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },
  signupLink: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.bgElevated,
  },
  dividerText: {
    paddingHorizontal: spacing.md,
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
  guestButton: {
    borderWidth: 1,
    borderColor: colors.bgElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  guestButtonText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
  guestNote: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

