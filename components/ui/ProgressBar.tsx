// ============================================================
// ProgressBar – Animated cartoon progress bar
// ============================================================

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  bgColor?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  progress,
  color = Colors.accentGreen,
  bgColor = 'rgba(0,0,0,0.2)',
  height = 16,
  showLabel = false,
  label,
}: ProgressBarProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.track,
          {
            backgroundColor: bgColor,
            height,
            borderRadius: height / 2,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              width: `${clampedProgress * 100}%`,
              height: height - 4,
              borderRadius: (height - 4) / 2,
            },
          ]}
        />
      </View>
      {showLabel && (
        <Text style={styles.label}>
          {label || `${Math.round(clampedProgress * 100)}%`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  track: {
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 2,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  fill: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  label: {
    textAlign: 'center',
    color: Colors.textWhite,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
});
