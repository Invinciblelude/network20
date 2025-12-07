import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Linking,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { spacing, radius, typography } from '../../src/lib/theme';
import { Avatar, Chip, Badge, Button } from '../../src/components/ui';
import { Header } from '../../src/components/layout/Header';
import { Footer } from '../../src/components/layout/Footer';
import { QRCode } from '../../src/components/QRCode';
import { getProfile, getCurrentUserId, type Profile } from '../../src/lib/store';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { Platform } from 'react-native';

const SOCIAL_ICONS: Record<string, string> = {
  twitter: 'logo-twitter',
  linkedin: 'logo-linkedin',
  instagram: 'logo-instagram',
  github: 'logo-github',
  website: 'globe-outline',
  other: 'link-outline',
};

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { colors, gradientColors } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isGuestOwner, setIsGuestOwner] = useState(false); // Owns via local storage but not signed in
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const [p, currentUserId] = await Promise.all([
        getProfile(id),
        getCurrentUserId(),
      ]);
      setProfile(p);
      
      // Check if user owns this profile
      const isOwner = currentUserId === id;
      setIsOwnProfile(isOwner);
      
      // Check if this is a guest-owned profile (local storage but not signed in)
      // Guest profiles have user_id = null
      setIsGuestOwner(isOwner && p?.user_id === null && !authUser);
      
      setLoading(false);
    }
    load();
  }, [id, authUser]);

  const getProfileUrl = () => {
    if (!profile) return '';
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return `${window.location.origin}/profile/${profile.id}`;
    }
    return `https://thenetwork20.com/profile/${profile.id}`;
  };

  const copyToClipboard = async () => {
    const url = getProfileUrl();
    if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const openProfileUrl = () => {
    const url = getProfileUrl();
    Linking.openURL(url);
  };

  const handleShare = async () => {
    if (!profile) return;
    try {
      const url = getProfileUrl();
      await Share.share({
        message: `Check out ${profile.display_name}'s NW20 Card!\n\n${profile.tagline || ''}\nSkills: ${profile.skills.join(', ')}\n\nView card: ${url}`,
        url: url,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleContact = (type: 'email' | 'phone') => {
    if (!profile) return;
    if (type === 'email' && profile.contact_email) {
      Linking.openURL(`mailto:${profile.contact_email}`);
    } else if (type === 'phone' && profile.contact_phone) {
      Linking.openURL(`tel:${profile.contact_phone}`);
    }
  };

  const handleSocialLink = (platform: string, handle: string) => {
    let url = handle;
    if (!handle.startsWith('http')) {
      switch (platform) {
        case 'twitter':
          url = `https://twitter.com/${handle.replace('@', '')}`;
          break;
        case 'linkedin':
          url = handle.includes('linkedin.com') ? `https://${handle}` : `https://linkedin.com/in/${handle}`;
          break;
        case 'instagram':
          url = `https://instagram.com/${handle.replace('@', '')}`;
          break;
        case 'github':
          url = handle.includes('github.com') ? `https://${handle}` : `https://github.com/${handle}`;
          break;
        case 'website':
          url = handle.startsWith('http') ? handle : `https://${handle}`;
          break;
      }
    }
    Linking.openURL(url);
  };

  const styles = createStyles(colors);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={gradientColors as any}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safeArea}>
          <Header />
          <View style={[styles.container, styles.centered]}>
            <Ionicons name="person-outline" size={64} color={colors.textMuted} />
            <Text style={styles.errorTitle}>Profile not found</Text>
            <Button onPress={() => router.push('/directory')} style={{ marginTop: spacing.lg }}>
              Browse Directory
            </Button>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors as any}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <Header showCreate={false} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Avatar name={profile.display_name} size={100} />
            <View style={styles.nameSection}>
              <Text style={styles.displayName}>{profile.display_name}</Text>
              {profile.is_available && (
                <Badge variant="success">Available for work</Badge>
              )}
            </View>
            {profile.tagline && (
              <Text style={styles.tagline}>{profile.tagline}</Text>
            )}
            {profile.location && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={16} color={colors.textMuted} />
                <Text style={styles.locationText}>{profile.location}</Text>
              </View>
            )}
            
            {/* Share Button */}
            <Pressable onPress={handleShare} style={styles.shareBtn}>
              <Ionicons name="share-outline" size={18} color={colors.primary} />
              <Text style={styles.shareBtnText}>Share</Text>
            </Pressable>
          </View>

          {/* Quick Stats */}
          {(profile.hours_available || profile.pay_preference || profile.pay_rate) && (
            <View style={styles.statsCard}>
              {profile.hours_available && (
                <View style={styles.statBox}>
                  <View style={styles.statIcon}>
                    <Ionicons name="time-outline" size={20} color={colors.accent} />
                  </View>
                  <Text style={styles.statValue}>{profile.hours_available}</Text>
                  <Text style={styles.statLabel}>hrs/{profile.hours_frequency}</Text>
                </View>
              )}
              {profile.pay_preference && (
                <View style={styles.statBox}>
                  <View style={styles.statIcon}>
                    <Ionicons name="wallet-outline" size={20} color={colors.accent} />
                  </View>
                  <Text style={styles.statValue}>
                    {profile.pay_preference.charAt(0).toUpperCase() + profile.pay_preference.slice(1)}
                  </Text>
                  <Text style={styles.statLabel}>preferred</Text>
                </View>
              )}
              {profile.pay_rate && (
                <View style={styles.statBox}>
                  <View style={styles.statIcon}>
                    <Ionicons name="cash-outline" size={20} color={colors.accent} />
                  </View>
                  <Text style={styles.statValue}>{profile.pay_rate}</Text>
                  <Text style={styles.statLabel}>rate</Text>
                </View>
              )}
            </View>
          )}

          {/* Bio */}
          {profile.bio && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bioText}>{profile.bio}</Text>
            </View>
          )}

          {/* Skills */}
          {profile.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillsGrid}>
                {profile.skills.map((skill, i) => (
                  <Chip key={i} variant="primary">{skill}</Chip>
                ))}
              </View>
            </View>
          )}

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Get in Touch</Text>
            <View style={styles.contactButtons}>
              {profile.contact_email && (
                <Pressable
                  style={styles.contactButton}
                  onPress={() => handleContact('email')}
                >
                  <Ionicons name="mail-outline" size={24} color={colors.primary} />
                  <Text style={styles.contactButtonText}>{profile.contact_email}</Text>
                </Pressable>
              )}
              {profile.contact_phone && (
                <Pressable
                  style={styles.contactButton}
                  onPress={() => handleContact('phone')}
                >
                  <Ionicons name="call-outline" size={24} color={colors.primary} />
                  <Text style={styles.contactButtonText}>{profile.contact_phone}</Text>
                </Pressable>
              )}
            </View>

            {/* Social Links */}
            {profile.social_links.length > 0 && (
              <View style={styles.socialLinks}>
                {profile.social_links.map((link, i) => (
                  <Pressable
                    key={i}
                    style={styles.socialButton}
                    onPress={() => handleSocialLink(link.platform, link.handle)}
                  >
                    <Ionicons
                      name={SOCIAL_ICONS[link.platform] as any || 'link-outline'}
                      size={24}
                      color={colors.textPrimary}
                    />
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Resume */}
          {profile.resume_url && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resume</Text>
              <Pressable
                style={styles.resumeButton}
                onPress={() => Linking.openURL(profile.resume_url!)}
              >
                <Ionicons name="document-text-outline" size={24} color={colors.primary} />
                <Text style={styles.resumeButtonText}>View Resume</Text>
                <Ionicons name="open-outline" size={20} color={colors.textMuted} />
              </Pressable>
            </View>
          )}

          {/* QR Code */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Share This Card</Text>
            <View style={styles.qrContainer}>
              <Pressable style={styles.qrCard} onPress={copyToClipboard}>
                <QRCode 
                  value={getProfileUrl()} 
                  size={180}
                  backgroundColor={colors.bgCard}
                  foregroundColor={colors.textPrimary}
                />
                <Text style={styles.qrHint}>
                  {copied ? '✓ Link copied!' : 'Tap to copy link'}
                </Text>
              </Pressable>
              
              <View style={styles.urlContainer}>
                <Text style={styles.urlText} numberOfLines={1}>
                  {getProfileUrl()}
                </Text>
                <Pressable style={styles.copyButton} onPress={copyToClipboard}>
                  <Ionicons 
                    name={copied ? "checkmark" : "copy-outline"} 
                    size={20} 
                    color={copied ? colors.success : colors.primary} 
                  />
                </Pressable>
              </View>
              
              <Pressable style={styles.openLinkButton} onPress={openProfileUrl}>
                <Ionicons name="open-outline" size={18} color={colors.textPrimary} />
                <Text style={styles.openLinkText}>Open Link</Text>
              </Pressable>
            </View>
          </View>

          {/* CTA */}
          {!isOwnProfile && profile.contact_email && (
            <Button
              onPress={() => handleContact('email')}
              fullWidth
              size="lg"
              style={{ marginTop: spacing.lg }}
            >
              <Text style={{ color: colors.textInverse, fontWeight: '700', fontSize: 16 }}>
                Contact {profile.display_name.split(' ')[0]}
              </Text>
            </Button>
          )}

          {/* Edit section for own profile */}
          {isOwnProfile && (
            <View style={styles.editSection}>
              <Text style={styles.editHint}>This is your NW20 Card</Text>
              
              {/* Edit Button */}
              <Button
                onPress={() => router.push(`/profile/edit/${profile.id}`)}
                fullWidth
                size="lg"
                variant="secondary"
              >
                <Ionicons name="pencil" size={20} color={colors.textPrimary} style={{ marginRight: 8 }} />
                <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 16 }}>
                  Edit My Card
                </Text>
              </Button>

              {/* Sign up prompt for guest users */}
              {isGuestOwner && (
                <View style={styles.claimCard}>
                  <View style={styles.claimCardIcon}>
                    <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.claimCardTitle}>Claim Your Card</Text>
                  <Text style={styles.claimCardDesc}>
                    Sign up to keep your card safe, edit it from any device, and unlock more features.
                  </Text>
                  <Button
                    onPress={() => router.push('/auth/signup')}
                    fullWidth
                    size="lg"
                    style={{ marginTop: spacing.md }}
                  >
                    <Ionicons name="person-add" size={20} color={colors.textInverse} style={{ marginRight: 8 }} />
                    <Text style={{ color: colors.textInverse, fontWeight: '700', fontSize: 16 }}>
                      Sign Up to Claim
                    </Text>
                  </Button>
                  <Text style={styles.claimCardNote}>
                    Already have an account?{' '}
                    <Text style={styles.claimCardLink} onPress={() => router.push('/auth/login')}>
                      Sign in
                    </Text>
                  </Text>
                </View>
              )}

              {/* Show signed-in status */}
              {authUser && profile.user_id === authUser.id && (
                <View style={styles.ownedBadge}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                  <Text style={styles.ownedBadgeText}>Owned by you</Text>
                </View>
              )}
            </View>
          )}

          {/* Create Your Own Card CTA */}
          <View style={styles.createOwnCard}>
            <Text style={styles.createOwnCardTitle}>Create Your Own NW20 Card</Text>
            <Text style={styles.createOwnCardSubtitle}>
              Free digital work card in 60 seconds
            </Text>
            <Button
              onPress={() => router.push('/create')}
              fullWidth
              size="lg"
              style={{ marginTop: spacing.md }}
            >
              <Ionicons name="add-circle" size={20} color={colors.textInverse} style={{ marginRight: 8 }} />
              <Text style={{ color: colors.textInverse, fontWeight: '700', fontSize: 16 }}>
                Get Started
              </Text>
            </Button>
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
  errorTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },

  // Profile Header
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  displayName: {
    fontSize: typography.sizes.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  tagline: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  locationText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: `${colors.primary}20`,
  },
  shareBtnText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: '600',
  },

  // Stats Card
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.accent}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },

  // Section
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  bioText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  // Contact
  contactButtons: {
    gap: spacing.sm,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgCard,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  contactButtonText: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgCard,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  resumeButtonText: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrCard: {
    backgroundColor: colors.bgCard,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  qrHint: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: radius.md,
    marginTop: spacing.md,
    paddingLeft: spacing.md,
    maxWidth: '100%',
    overflow: 'hidden',
  },
  urlText: {
    flex: 1,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    paddingVertical: spacing.sm,
  },
  copyButton: {
    padding: spacing.md,
    backgroundColor: colors.bgCard,
    borderLeftWidth: 1,
    borderLeftColor: colors.bgElevated,
  },
  openLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  openLinkText: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  editSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.bgElevated,
    alignItems: 'center',
  },
  editHint: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  createOwnCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  createOwnCardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  createOwnCardSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  // Claim Card (for guest users)
  claimCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: `${colors.primary}10`,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    alignItems: 'center',
  },
  claimCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  claimCardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  claimCardDesc: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  claimCardNote: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  claimCardLink: {
    color: colors.primary,
    fontWeight: '600',
  },

  // Owned badge
  ownedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: `${colors.success}15`,
    borderRadius: radius.full,
  },
  ownedBadgeText: {
    fontSize: typography.sizes.xs,
    color: colors.success,
    fontWeight: '600',
  },
});
