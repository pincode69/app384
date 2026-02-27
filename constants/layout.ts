// ============================================================
// Street Cricket Rush – Layout Constants
// ============================================================

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
  window: { width, height },
  isSmallDevice: width < 375,

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius (cartoon rounded style)
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    round: 999,
  },

  // Font sizes
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 18,
    xl: 22,
    xxl: 28,
    hero: 36,
    title: 44,
  },

  // Game constants
  game: {
    ballSize: 50,
    batWidth: 80,
    batHeight: 20,
    hitZoneHeight: 120,
    obstacleSize: 60,
    laneCount: 3,
    laneWidth: width / 3,
  },
} as const;
