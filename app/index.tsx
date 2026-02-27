// ============================================================
// Splash Screen – Street Cricket Rush
// ============================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { GameAssets } from '@/constants/assets';
import { Fonts } from '@/constants/fonts';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withTiming(1, { duration: 500 });
    logoOpacity.value = withTiming(1, { duration: 400 });

    titleOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
    titleTranslateY.value = withDelay(400, withTiming(0, { duration: 400 }));

    subtitleOpacity.value = withDelay(700, withTiming(1, { duration: 400 }));

    const timer = setTimeout(() => router.replace('/(tabs)'), 2500);
    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));
  const subtitleStyle = useAnimatedStyle(() => ({ opacity: subtitleOpacity.value }));

  return (
    <View style={styles.container}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image source={GameAssets.mainCharacter} style={styles.logoImg} contentFit="contain" />
      </Animated.View>

      <Animated.View style={[styles.titleContainer, titleStyle]}>
        <Text style={styles.titleStreet}>STREET</Text>
        <Text style={styles.titleCricket}>CRICKET</Text>
        <Text style={styles.titleRush}>RUSH</Text>
      </Animated.View>

      <Animated.View style={subtitleStyle}>
        <Text style={styles.subtitle}>Tap. Smash. Score!</Text>
      </Animated.View>

      <Image source={GameAssets.stadionBg} style={styles.stadiumBg} contentFit="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A3E', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  bgCircle1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(74,144,226,0.12)', top: -50, right: -80 },
  bgCircle2: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(155,89,182,0.12)', bottom: 100, left: -60 },
  logoContainer: { marginBottom: 10 },
  logoImg: { width: 180, height: 200 },
  titleContainer: { alignItems: 'center', marginTop: 10 },
  titleStreet: {
    fontSize: 30, fontFamily: Fonts.display, color: Colors.accent, letterSpacing: 10,
    textShadowColor: 'rgba(255,165,0,0.4)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 8,
  },
  titleCricket: {
    fontSize: 54, fontFamily: Fonts.display, color: Colors.textWhite, letterSpacing: 5, marginTop: -6,
    textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 10,
  },
  titleRush: {
    fontSize: 48, fontFamily: Fonts.display, color: Colors.accentOrange, letterSpacing: 12, marginTop: -4,
    textShadowColor: 'rgba(255,100,0,0.4)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 8,
  },
  subtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 18, fontFamily: Fonts.display, marginTop: 16, letterSpacing: 3 },
  stadiumBg: { position: 'absolute', bottom: 0, width, height: height * 0.25, opacity: 0.3 },
});
