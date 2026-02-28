// ============================================================
// Tab Layout – Bottom navigation (4 tabs, game-styled)
// ============================================================

import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { GameAssets } from '@/constants/assets';

const TAB_COLORS: Record<string, { bg: string; glow: string }> = {
  Home: { bg: '#4CD964', glow: 'rgba(76,217,100,0.5)' },
  Team: { bg: '#4A90E2', glow: 'rgba(74,144,226,0.5)' },
  Bats: { bg: '#FF8C42', glow: 'rgba(255,140,66,0.5)' },
  Shop: { bg: '#9B59B6', glow: 'rgba(155,89,182,0.5)' },
};

function TabIcon({
  iconName,
  label,
  focused,
  imgSource,
}: {
  iconName?: string;
  label: string;
  focused: boolean;
  imgSource?: any;
}) {
  const colors = TAB_COLORS[label] || TAB_COLORS.Home;

  return (
    <View style={styles.tabItem}>
      {/* Outer 3D ring */}
      <View
        style={[
          styles.iconOuter,
          focused && { backgroundColor: darken(colors.bg, 50), shadowColor: colors.glow },
          focused && styles.iconOuterFocused,
        ]}
      >
        <View
          style={[
            styles.iconInner,
            focused && { backgroundColor: colors.bg, borderColor: lighten(colors.bg, 40) },
          ]}
        >
          {/* Top bevel highlight */}
          <View style={styles.iconHighlight} />
          {imgSource ? (
            <Image source={imgSource} style={{ width: 22, height: 22 }} />
          ) : (
            <MaterialCommunityIcons
              name={iconName as any}
              size={focused ? 24 : 22}
              color={focused ? '#fff' : '#7E7EA0'}
            />
          )}
        </View>
      </View>
      <Text style={[styles.tabLabel, focused && { color: colors.bg }]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="home" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          title: 'Team',
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="account-group" label="Team" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="bats"
        options={{
          title: 'Bats',
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="cricket" label="Bats" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="shopping" label="Shop" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#141440',
    borderTopWidth: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: Platform.OS === 'ios' ? 120 : 100,
    paddingBottom: Platform.OS === 'ios' ? 22 : 10,
    paddingTop: 26,
    // 3D shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 22,
    // top border glow
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderTopWidth: 1,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconOuter: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#1E2060',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    // 3D depth effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  iconOuterFocused: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  iconInner: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    backgroundColor: '#2A2D6E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3A3D8E',
    overflow: 'hidden',
  },
  iconHighlight: {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: '45%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  tabLabel: {
    fontSize: 9,
    fontFamily: Fonts.display,
    color: '#6E6E8E',
    marginTop: 1,
  },
});
