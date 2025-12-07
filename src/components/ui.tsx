import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
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
  Animated,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, radius, typography, colors as defaultColors } from '../lib/theme';
import { useTheme } from '../context/ThemeContext';

// ===================
// TOAST SYSTEM
// ===================
type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return { showToast: () => {} };
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'info', visible: false });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setToast({ message, type, visible: true });
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    timeoutRef.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setToast(prev => ({ ...prev, visible: false }));
      });
    }, 2500);
  }, [fadeAnim]);

  const toastColors = {
    success: colors.success,
    error: colors.error,
    info: colors.accent,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 100,
              left: 20,
              right: 20,
              backgroundColor: colors.bgElevated,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.lg,
              borderRadius: radius.md,
              borderLeftWidth: 4,
              borderLeftColor: toastColors[toast.type],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              zIndex: 9999,
            },
            { opacity: fadeAnim },
          ]}
        >
          <Text style={{ color: colors.textPrimary, fontSize: typography.sizes.md, fontWeight: '500' }}>
            {toast.message}
          </Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

// ===================
// CONFIRM MODAL
// ===================
interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmModalProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable 
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: spacing.lg,
        }} 
        onPress={onCancel}
      >
        <Pressable 
          style={{
            backgroundColor: colors.bgCard,
            borderRadius: radius.lg,
            padding: spacing.xl,
            width: '100%',
            maxWidth: 340,
          }} 
          onPress={e => e.stopPropagation()}
        >
          <Text style={{
            fontSize: typography.sizes.lg,
            fontWeight: '700',
            color: colors.textPrimary,
            marginBottom: spacing.sm,
          }}>{title}</Text>
          <Text style={{
            fontSize: typography.sizes.md,
            color: colors.textSecondary,
            marginBottom: spacing.xl,
            lineHeight: 22,
          }}>{message}</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Pressable 
              style={{
                flex: 1,
                backgroundColor: colors.bgElevated,
                paddingVertical: spacing.md,
                borderRadius: radius.md,
                alignItems: 'center',
              }} 
              onPress={onCancel}
            >
              <Text style={{
                color: colors.textSecondary,
                fontWeight: '600',
                fontSize: typography.sizes.md,
              }}>{cancelText}</Text>
            </Pressable>
            <Pressable
              style={{
                flex: 1,
                backgroundColor: destructive ? colors.error : colors.primary,
                paddingVertical: spacing.md,
                borderRadius: radius.md,
                alignItems: 'center',
              }}
              onPress={onConfirm}
            >
              <Text style={{
                color: destructive ? '#fff' : colors.textInverse,
                fontWeight: '600',
                fontSize: typography.sizes.md,
              }}>
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ===================
// CONTAINER
// ===================
interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Container({ children, style }: ContainerProps) {
  const { colors } = useTheme();
  return <View style={[{ flex: 1, backgroundColor: colors.bg }, style]}>{children}</View>;
}

// ===================
// GRADIENT BACKGROUND
// ===================
export function GradientBg({ children }: { children: React.ReactNode }) {
  const { gradientColors } = useTheme();
  return (
    <LinearGradient
      colors={gradientColors as any}
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
  const { colors } = useTheme();
  
  const variantStyles: Record<string, ViewStyle> = {
    default: {
      backgroundColor: colors.bgCard,
      borderRadius: radius.lg,
      padding: spacing.lg,
    },
    elevated: {
      backgroundColor: colors.bgElevated,
      borderRadius: radius.lg,
      padding: spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderRadius: radius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.bgElevated,
    },
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
  const { colors } = useTheme();
  return (
    <Text style={[{
      fontSize: typography.sizes.xxl,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: -0.5,
    }, style]}>{children}</Text>
  );
}

export function Subtitle({ children, style }: TextProps) {
  const { colors } = useTheme();
  return (
    <Text style={[{
      fontSize: typography.sizes.lg,
      fontWeight: '600',
      color: colors.textPrimary,
    }, style]}>{children}</Text>
  );
}

export function Body({ children, style }: TextProps) {
  const { colors } = useTheme();
  return (
    <Text style={[{
      fontSize: typography.sizes.md,
      color: colors.textSecondary,
      lineHeight: 24,
    }, style]}>{children}</Text>
  );
}

export function Label({ children, style }: TextProps) {
  const { colors } = useTheme();
  return (
    <Text style={[{
      fontSize: typography.sizes.sm,
      fontWeight: '600',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    }, style]}>{children}</Text>
  );
}

export function Muted({ children, style }: TextProps) {
  const { colors } = useTheme();
  return (
    <Text style={[{
      fontSize: typography.sizes.sm,
      color: colors.textMuted,
    }, style]}>{children}</Text>
  );
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
  const { colors } = useTheme();

  const variantStyles: Record<string, ViewStyle> = {
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.textMuted },
    ghost: { backgroundColor: 'transparent' },
    accent: { backgroundColor: colors.accent },
  };

  const sizeStyles: Record<string, ViewStyle> = {
    sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, minHeight: 36 },
    md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, minHeight: 48 },
    lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, minHeight: 56 },
  };

  const textColors: Record<string, string> = {
    primary: colors.textInverse,
    secondary: colors.textPrimary,
    ghost: colors.primary,
    accent: colors.textInverse,
  };

  const textSizes: Record<string, number> = {
    sm: typography.sizes.sm,
    md: typography.sizes.md,
    lg: typography.sizes.lg,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          borderRadius: radius.full,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        },
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && { width: '100%' },
        disabled && { opacity: 0.5 },
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <Text style={{ fontWeight: '700', color: textColors[variant], fontSize: textSizes[size] }}>
          {children}
        </Text>
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
  const { colors } = useTheme();
  
  return (
    <View style={[{ marginBottom: spacing.md }, containerStyle]}>
      {label && (
        <Text style={{
          fontSize: typography.sizes.sm,
          fontWeight: '600',
          color: colors.textSecondary,
          marginBottom: spacing.xs,
        }}>{label}</Text>
      )}
      <TextInput
        style={[
          {
            backgroundColor: colors.bgInput,
            borderRadius: radius.md,
            padding: spacing.md,
            fontSize: typography.sizes.md,
            color: colors.textPrimary,
            borderWidth: 1,
            borderColor: error ? colors.error : 'transparent',
          },
          style,
        ]}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
      {error && (
        <Text style={{
          fontSize: typography.sizes.xs,
          color: colors.error,
          marginTop: spacing.xs,
        }}>{error}</Text>
      )}
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
  const { colors } = useTheme();

  const variantStyles: Record<string, ViewStyle> = {
    default: { backgroundColor: colors.bgElevated },
    primary: { backgroundColor: `${colors.primary}20` },
    accent: { backgroundColor: `${colors.accent}20` },
  };

  const textColors: Record<string, string> = {
    default: colors.textSecondary,
    primary: colors.primary,
    accent: colors.accent,
  };

  const chipStyle: ViewStyle = {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    ...variantStyles[variant],
  };

  const textStyle: TextStyle = {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: textColors[variant],
  };

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={chipStyle}>
        <Text style={textStyle}>{children}</Text>
      </Pressable>
    );
  }
  
  return (
    <View style={chipStyle}>
      <Text style={textStyle}>{children}</Text>
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
  const { colors } = useTheme();
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
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bgColors[colorIndex],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontWeight: '700', color: colors.textInverse, fontSize: size * 0.4 }}>
        {initials}
      </Text>
    </View>
  );
}

// ===================
// DIVIDER
// ===================
export function Divider({ style }: { style?: ViewStyle }) {
  const { colors } = useTheme();
  return (
    <View style={[{
      height: 1,
      backgroundColor: colors.bgElevated,
      marginVertical: spacing.md,
    }, style]} />
  );
}

// ===================
// BADGE
// ===================
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
}

export function Badge({ children, variant = 'info' }: BadgeProps) {
  const { colors } = useTheme();

  const variantStyles: Record<string, { bg: string; text: string }> = {
    success: { bg: `${colors.success}20`, text: colors.success },
    warning: { bg: `${colors.warning}20`, text: colors.warning },
    error: { bg: `${colors.error}20`, text: colors.error },
    info: { bg: `${colors.accent}20`, text: colors.accent },
  };

  return (
    <View style={{
      paddingVertical: 2,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.sm,
      alignSelf: 'flex-start',
      backgroundColor: variantStyles[variant].bg,
    }}>
      <Text style={{
        fontSize: typography.sizes.xs,
        fontWeight: '700',
        color: variantStyles[variant].text,
      }}>{children}</Text>
    </View>
  );
}
