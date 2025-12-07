import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { spacing, radius, typography } from '../src/lib/theme';
import { Header } from '../src/components/layout/Header';
import { Footer } from '../src/components/layout/Footer';
import { useTheme } from '../src/context/ThemeContext';

export default function PromotionsScreen() {
  const router = useRouter();
  const { colors, gradientColors } = useTheme();
  const styles = createStyles(colors);

  const openLink = (path: string) => {
    if (typeof window !== 'undefined') {
      window.open(path, '_blank');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors as any}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <Header showCreate={false} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Page Title */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Promotions</Text>
            <Text style={styles.pageSubtitle}>
              Marketing materials to help spread the word
            </Text>
          </View>

          {/* Printables Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🖨️ Printable Materials</Text>
            
            <Pressable 
              style={styles.card}
              onPress={() => openLink('/flyer.html')}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="document-text" size={32} color={colors.primary} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Full Page Flyer</Text>
                <Text style={styles.cardDesc}>
                  8.5" x 11" poster with QR code. Perfect for bulletin boards and windows.
                </Text>
              </View>
              <Ionicons name="open-outline" size={24} color={colors.textMuted} />
            </Pressable>

            <Pressable 
              style={styles.card}
              onPress={() => openLink('/cards.html')}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="albums" size={32} color={colors.accent} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Mini Cards (8 per page)</Text>
                <Text style={styles.cardDesc}>
                  Business card sized (3.5" x 2"). Print, cut, and hand out.
                </Text>
              </View>
              <Ionicons name="open-outline" size={24} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* Digital Assets Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📱 Digital Assets</Text>
            
            <Pressable 
              style={styles.card}
              onPress={() => router.push('/profile/52fb5bcc-b84a-4cc7-abe0-e720366c91da')}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="qr-code" size={32} color={colors.success} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Your Profile QR Code</Text>
                <Text style={styles.cardDesc}>
                  View your profile page with shareable QR code and link.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
            </Pressable>

            <View style={styles.linkBox}>
              <Text style={styles.linkLabel}>Your Profile Link:</Text>
              <Text style={styles.linkText} selectable>
                thenetwork20.com/profile/52fb5bcc-b84a-4cc7-abe0-e720366c91da
              </Text>
            </View>
          </View>

          {/* Social Media Templates */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💬 Social Media Copy</Text>
            
            <View style={styles.templateCard}>
              <View style={styles.templateHeader}>
                <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
                <Text style={styles.templateTitle}>Twitter/X</Text>
              </View>
              <Text style={styles.templateText} selectable>
                Built a digital work card instead of carrying around a resume 📱{'\n\n'}
                Shows my skills, availability, and contact - all scannable via QR code.{'\n\n'}
                Check it out: thenetwork20.com{'\n\n'}
                Want your own? Free at thenetwork20.com ⚡
              </Text>
            </View>

            <View style={styles.templateCard}>
              <View style={styles.templateHeader}>
                <Ionicons name="logo-facebook" size={20} color="#4267B2" />
                <Text style={styles.templateTitle}>Facebook / Nextdoor</Text>
              </View>
              <Text style={styles.templateText} selectable>
                🔧 Looking for work in the area!{'\n\n'}
                I just made a digital work card that shows my skills, availability, and how to reach me - all in one place.{'\n\n'}
                Check it out: thenetwork20.com/profile/52fb5bcc-b84a-4cc7-abe0-e720366c91da{'\n\n'}
                If you know anyone hiring, feel free to share! 🙏{'\n\n'}
                P.S. If you're also looking for work, you can create your own free card at thenetwork20.com
              </Text>
            </View>

            <View style={styles.templateCard}>
              <View style={styles.templateHeader}>
                <Ionicons name="logo-linkedin" size={20} color="#0077B5" />
                <Text style={styles.templateTitle}>LinkedIn</Text>
              </View>
              <Text style={styles.templateText} selectable>
                I've been thinking about how outdated the resume process is.{'\n\n'}
                So I built something different - a digital work card that:{'\n'}
                • Shows your skills at a glance{'\n'}
                • Has a QR code you can share anywhere{'\n'}
                • Takes 60 seconds to create{'\n'}
                • Is completely free{'\n\n'}
                Here's mine: thenetwork20.com/profile/52fb5bcc-b84a-4cc7-abe0-e720366c91da{'\n\n'}
                #JobSearch #CareerTips #OpenToWork
              </Text>
            </View>

            <View style={styles.templateCard}>
              <View style={styles.templateHeader}>
                <Ionicons name="logo-instagram" size={20} color="#E4405F" />
                <Text style={styles.templateTitle}>Instagram Caption</Text>
              </View>
              <Text style={styles.templateText} selectable>
                No more paper resumes 📄➡️📱{'\n\n'}
                Made a digital work card with a QR code. Scan it to see my skills, availability & how to reach me.{'\n\n'}
                Link in bio or: thenetwork20.com{'\n\n'}
                Create yours free in 60 seconds ⚡{'\n\n'}
                #JobSearch #GenZ #OpenToWork #DigitalResume #NW20Card
              </Text>
            </View>

            <View style={styles.templateCard}>
              <View style={styles.templateHeader}>
                <Ionicons name="chatbubbles" size={20} color={colors.success} />
                <Text style={styles.templateTitle}>Text Message</Text>
              </View>
              <Text style={styles.templateText} selectable>
                Hey! I made this digital work card thing - can you check it out and let me know what you think?{'\n\n'}
                thenetwork20.com/profile/52fb5bcc-b84a-4cc7-abe0-e720366c91da{'\n\n'}
                If you're looking for work too, you can make one free at thenetwork20.com
              </Text>
            </View>
          </View>

          {/* Tips Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Distribution Tips</Text>
            
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>📍</Text>
                <Text style={styles.tipText}>Post flyers at coffee shops, libraries, and community centers</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>🎓</Text>
                <Text style={styles.tipText}>Share with college career centers and trade schools</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>🤝</Text>
                <Text style={styles.tipText}>Hand out mini cards at job fairs and networking events</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>📱</Text>
                <Text style={styles.tipText}>Post in local Facebook groups for job seekers</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>🏪</Text>
                <Text style={styles.tipText}>Ask local businesses if you can leave cards at the counter</Text>
              </View>
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

  // Section
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  // Cards
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.bgElevated,
    gap: spacing.md,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardDesc: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  // Link Box
  linkBox: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  linkLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  linkText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontFamily: 'monospace',
  },

  // Template Cards
  templateCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.bgElevated,
  },
  templateTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  templateText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  // Tips
  tipsList: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.bgElevated,
    gap: spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  tipEmoji: {
    fontSize: 20,
  },
  tipText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

