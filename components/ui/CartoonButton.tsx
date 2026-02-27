// ============================================================
// CartoonButton – Big, bold, 3D casual cartoon button
// ============================================================

import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Fonts } from '@/constants/fonts';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface CartoonButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  darkColor?: string;
  textColor?: string;
  icon?: string;
  iconSize?: number;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function CartoonButton({
  title,
  onPress,
  color = Colors.btnGreen,
  darkColor,
  textColor = Colors.textWhite,
  icon,
  iconSize,
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: CartoonButtonProps) {
  const scale = useSharedValue(1);
  const bottomColor = darkColor || darkenColor(color);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.94, { duration: 80 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 140 });
  }, []);

  const sizeStyles = {
    small: { paddingVertical: 9, paddingHorizontal: 18, fontSize: 13, iconSz: 15, bottom: 4 },
    medium: { paddingVertical: 14, paddingHorizontal: 28, fontSize: 17, iconSz: 20, bottom: 5 },
    large: { paddingVertical: 18, paddingHorizontal: 36, fontSize: 21, iconSz: 24, bottom: 6 },
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      disabled={disabled}
      style={[
        animatedStyle,
        fullWidth && { width: '100%' },
        { opacity: disabled ? 0.5 : 1 },
      ]}
    >
      <View
        style={[
          styles.buttonOuter,
          {
            backgroundColor: bottomColor,
            paddingBottom: sizeStyles[size].bottom,
          },
          fullWidth && { width: '100%' },
          style,
        ]}
      >
        <View
          style={[
            styles.buttonInner,
            {
              backgroundColor: color,
              paddingVertical: sizeStyles[size].paddingVertical,
              paddingHorizontal: sizeStyles[size].paddingHorizontal,
            },
          ]}
        >
          {/* Top highlight */}
          <View style={styles.highlight} />
          {icon && (
            <MaterialCommunityIcons
              name={icon as any}
              size={iconSize || sizeStyles[size].iconSz}
              color={textColor}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            style={[
              styles.text,
              { color: textColor, fontSize: sizeStyles[size].fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      </View>
    </AnimatedTouchable>
  );
}

function darkenColor(hex: string): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - 45);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - 45);
  const b = Math.max(0, (num & 0x0000ff) - 45);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const styles = StyleSheet.create({
  buttonOuter: {
    borderRadius: Layout.borderRadius.xl + 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonInner: {
    borderRadius: Layout.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.25)',
    borderBottomWidth: 0,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: '45%',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  text: {
    fontFamily: Fonts.display,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
