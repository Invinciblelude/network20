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
import { colors, spacing, radius, typography } from '../src/lib/theme';
import { Button } from '../src/components/ui';
import { Header } from '../src/components/layout/Header';
import { Footer } from '../src/components/layout/Footer';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a0a0f', colors.bg, '#0a1a1f']}
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
            <Text style={styles.pageTitle}>About Network 20</Text>
            <Text style={styles.pageSubtitle}>
              Connecting talent to opportunity.
            </Text>
          </View>

          {/* Mission Statement */}
          <View style={styles.missionBox}>
            <Text style={styles.missionLabel}>OUR MISSION</Text>
            <Text style={styles.missionText}>
              Network 20 is the bridge between talented individuals and corporations seeking to build their workforce.
            </Text>
          </View>

          {/* The Problem */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="alert-circle" size={24} color={colors.warning} />
              <Text style={styles.sectionTitle}>The Problem</Text>
            </View>
            <Text style={styles.sectionText}>
              There's a workforce shortage, and connecting people to jobs has been done manually for too long. Job seekers struggle to get noticed, and employers can't find the talent they need.
            </Text>
          </View>

          {/* The Solution */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb" size={24} color={colors.success} />
              <Text style={styles.sectionTitle}>The Solution</Text>
            </View>
            <Text style={styles.sectionText}>
              We built a platform where anyone can create a digital work card in minutes, share it instantly via QR code or link, and get discovered by employers actively looking to hire.
            </Text>
          </View>

          {/* Built for Gen Z */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="rocket" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Built for Gen Z</Text>
            </View>
            <Text style={styles.sectionText}>
              Modern, mobile-first, no friction. Network 20 is designed for the next generation workforce—people who want to create the best opportunities for themselves without the traditional barriers.
            </Text>
          </View>

          {/* How It Works */}
          <View style={styles.howItWorks}>
            <Text style={styles.howItWorksTitle}>How It Works</Text>
            
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Create Your Card</Text>
                <Text style={styles.stepDesc}>Sign up and fill in your skills, experience, and availability</Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Share Everywhere</Text>
                <Text style={styles.stepDesc}>Get a QR code and link to share at events, online, or in person</Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Get Discovered</Text>
                <Text style={styles.stepDesc}>Employers browse the directory and find you based on your skills</Text>
              </View>
            </View>
          </View>

          {/* CTA */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaText}>Ready to get started?</Text>
            <Button
              onPress={() => router.push('/create')}
              size="lg"
              style={{ marginTop: spacing.md }}
            >
              Create Your Card
            </Button>
            <Pressable
              onPress={() => router.push('/directory')}
              style={styles.browseLink}
            >
              <Text style={styles.browseLinkText}>or browse the directory</Text>
            </Pressable>
          </View>

          <Footer />
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

  // Mission
  missionBox: {
    backgroundColor: `${colors.primary}15`,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  missionLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  missionText: {
    fontSize: typography.sizes.xl,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 32,
  },

  // Sections
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    lineHeight: 26,
  },

  // How It Works
  howItWorks: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  howItWorksTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.textInverse,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  stepDesc: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },

  // CTA
  ctaSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  ctaText: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  browseLink: {
    marginTop: spacing.md,
  },
  browseLinkText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
});
