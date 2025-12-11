import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { spacing, radius, typography } from '../src/lib/theme';
import { Header } from '../src/components/layout/Header';
import { Footer } from '../src/components/layout/Footer';
import { useTheme } from '../src/context/ThemeContext';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, gradientColors } = useTheme();
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
          {/* Create Card CTA - Primary Focus */}
          <View style={styles.createCardBanner}>
            <LinearGradient
              colors={[colors.primary, colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.createCardGradient}
            >
              <View style={styles.createCardContent}>
                <View style={styles.createCardIcon}>
                  <Ionicons name="card-outline" size={40} color="#FFF" />
                </View>
                <Text style={styles.createCardTitle}>Create Your NW20 Card</Text>
                <Text style={styles.createCardDesc}>
                  Build your digital employment card in minutes. Showcase your skills, set your availability, and get discovered by employers.
                </Text>
                <Pressable
                  style={styles.createCardBtn}
                  onPress={() => router.push('/create')}
                >
                  <Ionicons name="add-circle" size={22} color={colors.primary} />
                  <Text style={[styles.createCardBtnText, { color: colors.primary }]}>Start Building — It's Free</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </View>

          {/* Hero Section */}
          <View style={styles.hero}>
            <Text style={styles.heroTagline}>Connecting Talent to Opportunity</Text>
            <Text style={styles.heroTitle}>Your Digital{'\n'}Employment Card</Text>
            <Text style={styles.heroSubtitle}>
              Create your professional work card, share your skills, and get discovered by employers. Built for the modern workforce.
            </Text>

            <View style={styles.heroCTAs}>
              <Pressable
                style={styles.primaryBtn}
                onPress={() => router.push('/create')}
              >
                <Ionicons name="add-circle-outline" size={20} color={colors.textInverse} />
                <Text style={styles.primaryBtnText}>Create Your Card</Text>
              </Pressable>
              
              <Pressable
                style={styles.secondaryBtn}
                onPress={() => router.push('/directory')}
              >
                <Ionicons name="people-outline" size={20} color={colors.primary} />
                <Text style={styles.secondaryBtnText}>Browse Directory</Text>
              </Pressable>
            </View>
          </View>

          {/* Features Section */}
          <View style={styles.features}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            
            <View style={styles.featureGrid}>
              <View style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name="person-add-outline" size={28} color={colors.primary} />
                </View>
                <Text style={styles.featureTitle}>Create Your Card</Text>
                <Text style={styles.featureDesc}>
                  Build your professional profile with skills, availability, and contact info.
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name="qr-code-outline" size={28} color={colors.accent} />
                </View>
                <Text style={styles.featureTitle}>Share Your QR Code</Text>
                <Text style={styles.featureDesc}>
                  Every card gets a unique QR code. Share it at events, on resumes, anywhere.
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name="briefcase-outline" size={28} color={colors.success} />
                </View>
                <Text style={styles.featureTitle}>Get Discovered</Text>
                <Text style={styles.featureDesc}>
                  Employers browse the directory to find talent matching their needs.
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>Free</Text>
              <Text style={styles.statLabel}>Always</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>Gen Z</Text>
              <Text style={styles.statLabel}>Focused</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>Open</Text>
              <Text style={styles.statLabel}>Source</Text>
            </View>
          </View>

          {/* For Employers CTA */}
          <View style={styles.employerSection}>
            <Text style={styles.employerTitle}>Looking to Hire?</Text>
            <Text style={styles.employerDesc}>
              Browse our talent directory or post a job to find your next team member.
            </Text>
            <View style={styles.employerCTAs}>
              <Pressable
                style={styles.employerBtn}
                onPress={() => router.push('/hire')}
              >
                <Text style={styles.employerBtnText}>For Employers</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.primary} />
              </Pressable>
              <Pressable
                style={styles.employerBtn}
                onPress={() => router.push('/jobs')}
              >
                <Text style={styles.employerBtnText}>View Jobs</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.primary} />
              </Pressable>
            </View>
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
  createCardBanner: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  createCardGradient: {
    borderRadius: radius.xl,
  },
  createCardContent: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  createCardIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  createCardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  createCardDesc: {
    fontSize: typography.sizes.md,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    maxWidth: 500,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  createCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#FFF',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
  },
  createCardBtnText: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
  },
  hero: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  heroTagline: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 52,
  },
  heroSubtitle: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
    maxWidth: 600,
    lineHeight: 26,
  },
  heroCTAs: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
  },
  primaryBtnText: {
    color: colors.textInverse,
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'transparent',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryBtnText: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
  features: {
    paddingVertical: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
  },
  featureCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.xl,
    width: 300,
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  featureTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  featureDesc: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xl,
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.sizes.xxl,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.bgElevated,
  },
  employerSection: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bgElevated,
    marginBottom: spacing.xl,
  },
  employerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  employerDesc: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 400,
  },
  employerCTAs: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  employerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  employerBtnText: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
});
