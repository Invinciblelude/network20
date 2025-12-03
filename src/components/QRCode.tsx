import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import QRCodeLib from 'react-qr-code';

interface QRCodeProps {
  value: string;
  size?: number;
  backgroundColor?: string;
  foregroundColor?: string;
}

export function QRCode({ 
  value, 
  size = 200, 
  backgroundColor = '#FFFFFF',
  foregroundColor = '#000000' 
}: QRCodeProps) {
  // For web, use the QRCode component from react-qr-code
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { width: size, height: size, backgroundColor }]}>
        <QRCodeLib
          value={value}
          size={size}
          bgColor={backgroundColor}
          fgColor={foregroundColor}
          level="H"
        />
      </View>
    );
  }

  // For native, we'll use a simple placeholder for now
  // In production, you'd use react-native-qrcode-svg
  return (
    <View style={[styles.container, { width: size, height: size, backgroundColor: '#f0f0f0' }]}>
      {/* Native QR code would go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 8,
  },
});

