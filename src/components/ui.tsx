import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, typography } from '../lib/theme';

// ===================
// CONTAINER
// ===================
interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Container({ children, style }: ContainerProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

// ===================
// GRADIENT BACKGROUND
// ===================
export function GradientBg({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={[colors.bg, '#12121a', colors.bg]}
      style={StyleSheet.absoluteFill}
    >
      {children}
    </LinearGradient>
  );
}

// ===================
// CARD
// ===================
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  const variantStyles = {
    default: styles.card,
    elevated: styles.cardElevated,
    outlined: styles.cardOutlined,
  };
  
  return <View style={[variantStyles[variant], style]}>{children}</View>;
}

// ===================
// TEXT COMPONENTS
// ===================
interface TextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function Title({ children, style }: TextProps) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Subtitle({ children, style }: TextProps) {
  return <Text style={[styles.subtitle, style]}>{children}</Text>;
}

export function Body({ children, style }: TextProps) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function Label({ children, style }: TextProps) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

export function Muted({ children, style }: TextProps) {
  return <Text style={[styles.muted, style]}>{children}</Text>;
}

// ===================
// BUTTON
// ===================
interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  fullWidth = false,
}: ButtonProps) {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.buttonFullWidth,
    disabled && styles.buttonDisabled,
    style,
  ];
  
  const textStyles = [
    styles.buttonText,
    styles[`buttonText_${variant}`],
    styles[`buttonText_${size}`],
  ];
  
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        ...buttonStyles,
        pressed && styles.buttonPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.textInverse : colors.textPrimary} />
      ) : (
        <Text style={textStyles}>{children}</Text>
      )}
    </Pressable>
  );
}

// ===================
// INPUT
// ===================
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, containerStyle, style, ...props }: InputProps) {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
      {error && <Text style={styles.inputErrorText}>{error}</Text>}
    </View>
  );
}

// ===================
// CHIP / TAG
// ===================
interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'accent';
  onPress?: () => void;
}

export function Chip({ children, variant = 'default', onPress }: ChipProps) {
  const chipStyles = [styles.chip, styles[`chip_${variant}`]];
  const textStyles = [styles.chipText, styles[`chipText_${variant}`]];
  
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={chipStyles}>
        <Text style={textStyles}>{children}</Text>
      </Pressable>
    );
  }
  
  return (
    <View style={chipStyles}>
      <Text style={textStyles}>{children}</Text>
    </View>
  );
}

// ===================
// AVATAR
// ===================
interface AvatarProps {
  name: string;
  size?: number;
  imageUrl?: string | null;
}

export function Avatar({ name, size = 48, imageUrl }: AvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  const bgColors = [
    '#FF6B4A', '#00F5D4', '#FFB347', '#A78BFA', '#F472B6', '#34D399'
  ];
  const colorIndex = name.charCodeAt(0) % bgColors.length;
  
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColors[colorIndex],
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{initials}</Text>
    </View>
  );
}

// ===================
// DIVIDER
// ===================
export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

// ===================
// BADGE
// ===================
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
}

export function Badge({ children, variant = 'info' }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[`badge_${variant}`]]}>
      <Text style={[styles.badgeText, styles[`badgeText_${variant}`]]}>{children}</Text>
    </View>
  );
}

// ===================
// STYLES
// ===================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  
  // Card
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  cardElevated: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardOutlined: {
    backgroundColor: 'transparent',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.bgElevated,
  },
  
  // Typography
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  body: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  muted: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  
  // Button base
  button: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  
  // Button variants
  button_primary: {
    backgroundColor: colors.primary,
  },
  button_secondary: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_accent: {
    backgroundColor: colors.accent,
  },
  
  // Button sizes
  button_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  button_md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  button_lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
  
  // Button text
  buttonText: {
    fontWeight: '700',
  },
  buttonText_primary: {
    color: colors.textInverse,
  },
  buttonText_secondary: {
    color: colors.textPrimary,
  },
  buttonText_ghost: {
    color: colors.primary,
  },
  buttonText_accent: {
    color: colors.textInverse,
  },
  buttonText_sm: {
    fontSize: typography.sizes.sm,
  },
  buttonText_md: {
    fontSize: typography.sizes.md,
  },
  buttonText_lg: {
    fontSize: typography.sizes.lg,
  },
  
  // Input
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.bgInput,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: colors.error,
  },
  inputErrorText: {
    fontSize: typography.sizes.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
  
  // Chip
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  chip_default: {
    backgroundColor: colors.bgElevated,
  },
  chip_primary: {
    backgroundColor: `${colors.primary}20`,
  },
  chip_accent: {
    backgroundColor: `${colors.accent}20`,
  },
  chipText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
  },
  chipText_default: {
    color: colors.textSecondary,
  },
  chipText_primary: {
    color: colors.primary,
  },
  chipText_accent: {
    color: colors.accent,
  },
  
  // Avatar
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontWeight: '700',
    color: colors.textInverse,
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.bgElevated,
    marginVertical: spacing.md,
  },
  
  // Badge
  badge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  badge_success: {
    backgroundColor: `${colors.success}20`,
  },
  badge_warning: {
    backgroundColor: `${colors.warning}20`,
  },
  badge_error: {
    backgroundColor: `${colors.error}20`,
  },
  badge_info: {
    backgroundColor: `${colors.accent}20`,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
  },
  badgeText_success: {
    color: colors.success,
  },
  badgeText_warning: {
    color: colors.warning,
  },
  badgeText_error: {
    color: colors.error,
  },
  badgeText_info: {
    color: colors.accent,
  },
});

