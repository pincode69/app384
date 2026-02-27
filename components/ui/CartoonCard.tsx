// ============================================================
// CartoonCard – Rounded, shadowed card with deep casual 3D style
// ============================================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

interface CartoonCardProps {
  children: React.ReactNode;
  color?: string;
  borderColor?: string;
  style?: ViewStyle;
  padding?: number;
  glow?: boolean;
}

export function CartoonCard({
  children,
  color = Colors.cardBg,
  borderColor = Colors.cardBorder,
  style,
  padding = Layout.spacing.md,
  glow = false,
}: CartoonCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: color,
          borderColor,
          padding,
        },
        glow && {
          shadowColor: borderColor,
          shadowOpacity: 0.4,
          shadowRadius: 14,
        },
        style,
      ]}
    >
      {/* Inner top highlight for 3D feel */}
      <View style={styles.innerHighlight} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Layout.borderRadius.xl + 2,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  innerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    borderTopLeftRadius: Layout.borderRadius.xl,
    borderTopRightRadius: Layout.borderRadius.xl,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
});
