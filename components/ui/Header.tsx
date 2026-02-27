// ============================================================
// Header – Top bar with coins, gems, energy, and settings
// ============================================================

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CoinDisplay } from './CoinDisplay';
import { useGameStore } from '@/store/useGameStore';
import { Layout } from '@/constants/layout';
import { Fonts } from '@/constants/fonts';

interface HeaderProps {
  showSettings?: boolean;
  onSettingsPress?: () => void;
  showBack?: boolean;
  onBackPress?: () => void;
  title?: string;
}

export function Header({
  showSettings = false,
  onSettingsPress,
  showBack = false,
  onBackPress,
  title,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { coins, gems, energy } = useGameStore();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={onBackPress} style={styles.backBtn}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
      <View style={styles.right}>
        <CoinDisplay amount={energy} type="energy" size="small" />
        <CoinDisplay amount={coins} type="coins" size="small" />
        <CoinDisplay amount={gems} type="gems" size="small" />
        {showSettings && (
          <TouchableOpacity onPress={onSettingsPress} style={styles.settingsBtn}>
            <MaterialCommunityIcons name="cog" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontFamily: Fonts.display,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
