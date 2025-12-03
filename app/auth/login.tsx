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
import { signIn, isUsingSupabase } from '../../src/lib/store';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signIn(email.trim(), password);
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
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
              Authentication requires Supabase to be configured. The app is currently running in local-only mode.
            </Text>
            <Text style={styles.notConfiguredText}>
              To enable authentication, add your Supabase URL and anon key to app.json.
            </Text>
            <Pressable
              style={styles.backHomeButton}
              onPress={() => router.replace('/')}
            >
              <Text style={styles.backHomeText}>Back to Home</Text>
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
              <Text style={styles.subtitle}>Welcome back</Text>
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
                    placeholder="Your password"
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
                <Pressable style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </Pressable>
              </Link>

              <Pressable
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.loginButtonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color={colors.textInverse} />
                  ) : (
                    <Text style={styles.loginButtonText}>Sign In</Text>
                  )}
                </LinearGradient>
              </Pressable>
            </View>

            {/* Sign up link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <Link href="/auth/signup" asChild>
                <Pressable>
                  <Text style={styles.signupLink}>Sign up</Text>
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
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    paddingVertical: spacing.md + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: colors.textInverse,
    fontSize: typography.sizes.md,
    fontWeight: '700',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
  },
  signupLink: {
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
  backHomeButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
  },
  backHomeText: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
});

