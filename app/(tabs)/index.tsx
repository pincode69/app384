// ============================================================
// Home / Main Menu – Street Cricket Rush
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { GameAssets } from '@/constants/assets';
import { Fonts } from '@/constants/fonts';
import { Header } from '@/components/ui/Header';
import { CartoonButton } from '@/components/ui/CartoonButton';
import { CartoonCard } from '@/components/ui/CartoonCard';
import { DailyRewardModal } from '@/components/ui/DailyRewardModal';
import { useGameStore } from '@/store/useGameStore';

const { width, height } = Dimensions.get('window');

const MATCH_SCHEDULE = [
  { day: 'MON', label: 'Friendly', icon: 'cricket', color: '#4A90E2', reward: 50 },
  { day: 'TUE', label: 'League', icon: 'trophy', color: '#FFD700', reward: 100 },
  { day: 'WED', label: 'Cup', icon: 'stadium-variant', color: '#4CD964', reward: 150 },
  { day: 'THU', label: 'Rivals', icon: 'sword-cross', color: '#FF8C42', reward: 120 },
  { day: 'FRI', label: 'League', icon: 'trophy', color: '#FFD700', reward: 100 },
  { day: 'SAT', label: 'Derby', icon: 'fire', color: '#FF3B54', reward: 200 },
  { day: 'SUN', label: 'Finals', icon: 'crown', color: '#9B59B6', reward: 300 },
];

function getMatchDays() {
  const todayIdx = (new Date().getDay() + 6) % 7; // 0=Mon, 6=Sun
  return MATCH_SCHEDULE.map((m, i) => ({
    ...m,
    done: false,
    isToday: i === todayIdx,
  }));
}

const MATCH_DAYS = getMatchDays();

export default function HomeScreen() {
  const [showDailyReward, setShowDailyReward] = useState(false);
  const todayIdx = MATCH_DAYS.findIndex((d) => d.isToday);
  const [selectedCalDay, setSelectedCalDay] = useState(todayIdx >= 0 ? todayIdx : 0);
  const { bestScore, level, totalGamesPlayed, energy, coins, medkits } = useGameStore();

  const floatY = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1800 }),
        withTiming(0, { duration: 1800 })
      ),
      -1,
      true
    );
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1200 }),
        withTiming(1, { duration: 1200 })
      ),
      -1,
      true
    );
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const calDay = MATCH_DAYS[selectedCalDay];

  return (
    <View style={styles.container}>
      <Image source={GameAssets.stadionBg} style={styles.bgImage} contentFit="cover" />
      <View style={styles.bgOverlay} />

      <Header showSettings onSettingsPress={() => router.push('/settings')} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero section */}
        <View style={styles.heroSection}>
          <Animated.View style={[styles.characterContainer, floatStyle]}>
            <Image source={GameAssets.mainCharacter} style={styles.characterImage} contentFit="contain" />
          </Animated.View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleStreet}>STREET</Text>
            <Text style={styles.titleCricket}>CRICKET RUSH</Text>
          </View>
        </View>

        {/* PLAY Button – pulsing */}
        <Animated.View style={pulseStyle}>
          <CartoonButton
            title="PLAY NOW"
            icon="play"
            onPress={() => router.push('/formation')}
            color={Colors.btnGreen}
            size="large"
            fullWidth
          />
        </Animated.View>

        <View style={{ height: 16 }} />

        {/* Stats row – clickable */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statCardWrap} activeOpacity={0.8} onPress={() => router.push('/formation')}>
            <View style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Image source={GameAssets.goldenCup} style={styles.statIconImg} contentFit="contain" />
              </View>
              <Text style={styles.statValue}>{bestScore}</Text>
              <Text style={styles.statLabel}>Best</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statCardWrap} activeOpacity={0.8} onPress={() => router.push('/(tabs)/team')}>
            <View style={[styles.statCard, styles.statCardAccent]}>
              <View style={[styles.statIconWrap, { backgroundColor: 'rgba(255,215,0,0.2)' }]}>
                <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
              </View>
              <Text style={styles.statValue}>Lv.{level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statCardWrap} activeOpacity={0.8} onPress={() => router.push('/(tabs)/bats')}>
            <View style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: 'rgba(74,144,226,0.2)' }]}>
                <MaterialCommunityIcons name="gamepad-variant" size={24} color="#4A90E2" />
              </View>
              <Text style={styles.statValue}>{totalGamesPlayed}</Text>
              <Text style={styles.statLabel}>Games</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick actions – more casual */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} activeOpacity={0.7} onPress={() => setShowDailyReward(true)}>
            <View style={styles.quickActionOuter}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FF8C42' }]}>
                <MaterialCommunityIcons name="gift" size={26} color="#fff" />
              </View>
            </View>
            <Text style={styles.quickActionLabel}>Daily{'\n'}Reward</Text>
            <View style={styles.quickActionNotif}><Text style={styles.quickActionNotifText}>!</Text></View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction} activeOpacity={0.7} onPress={() => router.push('/locations')}>
            <View style={styles.quickActionOuter}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#4A90E2' }]}>
                <MaterialCommunityIcons name="earth" size={26} color="#fff" />
              </View>
            </View>
            <Text style={styles.quickActionLabel}>Locations</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction} activeOpacity={0.7} onPress={() => router.push('/(tabs)/shop')}>
            <View style={styles.quickActionOuter}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#9B59B6' }]}>
                <MaterialCommunityIcons name="shopping" size={26} color="#fff" />
              </View>
            </View>
            <Text style={styles.quickActionLabel}>Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction} activeOpacity={0.7} onPress={() => router.push('/settings')}>
            <View style={styles.quickActionOuter}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#636E72' }]}>
                <MaterialCommunityIcons name="cog" size={26} color="#fff" />
              </View>
            </View>
            <Text style={styles.quickActionLabel}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* ========== MATCH CALENDAR ========== */}
        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <Image source={GameAssets.cards} style={{ width: 20, height: 20 }} />
            <Text style={styles.calendarTitle}>MATCH WEEK</Text>
          </View>

          {/* Day selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calDaysScroll}>
            {MATCH_DAYS.map((d, i) => (
              <TouchableOpacity
                key={d.day}
                style={[
                  styles.calDay,
                  selectedCalDay === i && styles.calDaySelected,
                  d.done && styles.calDayDone,
                  d.isToday && styles.calDayToday,
                ]}
                onPress={() => setSelectedCalDay(i)}
                activeOpacity={0.7}
              >
                <Text style={[styles.calDayText, selectedCalDay === i && styles.calDayTextSelected]}>{d.day}</Text>
                {d.done && <MaterialCommunityIcons name="check-circle" size={14} color="#4CD964" />}
                {d.isToday && !d.done && <View style={styles.calTodayDot} />}
                {!d.done && !d.isToday && <View style={styles.calLockDot} />}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Selected day detail */}
          <TouchableOpacity
            style={styles.calDetail}
            activeOpacity={0.8}
            onPress={() => {
              if (!calDay.done) router.push('/formation');
            }}
          >
            <View style={[styles.calDetailIcon, { backgroundColor: calDay.color + '25' }]}>
              <MaterialCommunityIcons name={calDay.icon as any} size={32} color={calDay.color} />
            </View>
            <View style={styles.calDetailInfo}>
              <Text style={styles.calDetailLabel}>{calDay.day} – {calDay.label}</Text>
              <View style={styles.calDetailReward}>
                <Image source={GameAssets.money} style={{ width: 14, height: 14 }} />
                <Text style={styles.calDetailRewardText}>+{calDay.reward} coins</Text>
              </View>
            </View>
            {calDay.done ? (
              <View style={styles.calDoneBadge}>
                <MaterialCommunityIcons name="check-bold" size={16} color="#fff" />
                <Text style={styles.calDoneText}>Done</Text>
              </View>
            ) : calDay.isToday ? (
              <View style={styles.calPlayBadge}>
                <MaterialCommunityIcons name="play" size={16} color="#fff" />
                <Text style={styles.calPlayText}>Play</Text>
              </View>
            ) : (
              <MaterialCommunityIcons name="lock" size={20} color="#6E6E8E" />
            )}
          </TouchableOpacity>
        </View>

        {/* Inventory row – medkits + energy */}
        <View style={styles.inventoryRow}>
          <TouchableOpacity style={styles.inventoryItem} activeOpacity={0.8} onPress={() => router.push('/(tabs)/shop')}>
            <Image source={GameAssets.medicalKit} style={styles.inventoryIcon} contentFit="contain" />
            <Text style={styles.inventoryCount}>x{medkits}</Text>
            <Text style={styles.inventoryLabel}>Medkits</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inventoryItem} activeOpacity={0.8} onPress={() => router.push('/(tabs)/shop')}>
            <Image source={GameAssets.energy} style={styles.inventoryIcon} contentFit="contain" />
            <Text style={styles.inventoryCount}>{energy}/5</Text>
            <Text style={styles.inventoryLabel}>Energy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inventoryItem} activeOpacity={0.8} onPress={() => router.push('/(tabs)/shop')}>
            <Image source={GameAssets.money} style={styles.inventoryIcon} contentFit="contain" />
            <Text style={styles.inventoryCount}>{coins}</Text>
            <Text style={styles.inventoryLabel}>Coins</Text>
          </TouchableOpacity>
        </View>

        {/* Season banner – NOW clickable */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/(tabs)/shop')}>
          <View style={styles.bannerOuter}>
            <View style={styles.bannerInner}>
              <View style={styles.bannerHighlight} />
              <View style={styles.bannerLeft}>
                <View style={styles.bannerBadge}>
                  <Text style={styles.bannerBadgeText}>NEW</Text>
                </View>
                <Text style={styles.bannerTitle}>Season 1 Pass</Text>
                <Text style={styles.bannerDesc}>Unlock exclusive skins & bats!</Text>
              </View>
              <Image source={GameAssets.seasonReward} style={styles.bannerIcon} contentFit="contain" />
              <View style={styles.bannerArrow}>
                <MaterialCommunityIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      <DailyRewardModal visible={showDailyReward} onClose={() => setShowDailyReward(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A3E' },
  bgImage: { position: 'absolute', width, height, opacity: 0.2 },
  bgOverlay: { position: 'absolute', width, height, backgroundColor: 'rgba(26,26,62,0.6)' },
  scrollContent: { paddingHorizontal: Layout.spacing.md, paddingBottom: 140 },

  // Hero
  heroSection: { alignItems: 'center', marginTop: 4, marginBottom: 10 },
  characterContainer: { width: 320, height: 340, marginBottom: 4 },
  characterImage: { width: '100%', height: '100%' },
  titleContainer: { alignItems: 'center' },
  titleStreet: {
    fontSize: 22, fontFamily: Fonts.display, color: Colors.accent, letterSpacing: 10,
    textShadowColor: 'rgba(255,165,0,0.4)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 8,
  },
  titleCricket: {
    fontSize: 36, fontFamily: Fonts.display, color: Colors.textWhite, letterSpacing: 4,
    textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 8,
  },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCardWrap: { flex: 1 },
  statCard: {
    alignItems: 'center', padding: 14, borderRadius: 20,
    backgroundColor: '#252860', borderWidth: 2.5, borderColor: '#3A3D8E',
    shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 8,
  },
  statCardAccent: { borderColor: '#FFD700', backgroundColor: '#2A2A50' },
  statIconWrap: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  statIconImg: { width: 26, height: 26 },
  statValue: { color: Colors.textWhite, fontSize: 18, fontFamily: Fonts.display },
  statLabel: { color: Colors.textGray, fontSize: 9, fontFamily: Fonts.display, marginTop: 2 },

  // Quick actions
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  quickAction: { alignItems: 'center', gap: 5, position: 'relative' },
  quickActionOuter: {
    borderRadius: 22, padding: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 6, elevation: 6,
  },
  quickActionIcon: {
    width: 54, height: 54, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
  },
  quickActionLabel: { color: Colors.textGray, fontSize: 9, fontFamily: Fonts.display, textAlign: 'center' },
  quickActionNotif: {
    position: 'absolute', top: -4, right: -4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#FF3B54', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#1A1A3E',
  },
  quickActionNotifText: { color: '#fff', fontSize: 10, fontWeight: '900' },

  // Calendar
  calendarSection: {
    backgroundColor: 'rgba(42,45,100,0.6)', borderRadius: 22,
    borderWidth: 2.5, borderColor: '#3A3D8E', padding: 14, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8,
  },
  calendarHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  calendarTitle: { color: '#FFD700', fontSize: 14, fontFamily: Fonts.display, letterSpacing: 1 },
  calDaysScroll: { gap: 8, paddingBottom: 4 },
  calDay: {
    width: 44, height: 56, borderRadius: 14,
    backgroundColor: '#1E2050', borderWidth: 2, borderColor: '#3A3D6E',
    alignItems: 'center', justifyContent: 'center', gap: 3,
  },
  calDaySelected: { borderColor: '#FFD700', backgroundColor: '#2A2860' },
  calDayDone: { borderColor: '#4CD964', backgroundColor: '#1A3028' },
  calDayToday: { borderColor: '#FF8C42', borderWidth: 2.5, backgroundColor: '#2A2040' },
  calDayText: { color: '#6E6E8E', fontSize: 9, fontFamily: Fonts.display },
  calDayTextSelected: { color: '#FFD700' },
  calTodayDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF8C42' },
  calLockDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3A3D6E' },
  calDetail: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  calDetailIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  calDetailInfo: { flex: 1 },
  calDetailLabel: { color: '#fff', fontSize: 14, fontFamily: Fonts.display },
  calDetailReward: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  calDetailRewardText: { color: '#FFD700', fontSize: 12, fontFamily: Fonts.display },
  calDoneBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#4CD964', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  calDoneText: { color: '#fff', fontSize: 11, fontFamily: Fonts.display },
  calPlayBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FF8C42', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  calPlayText: { color: '#fff', fontSize: 11, fontFamily: Fonts.display },

  // Inventory row
  inventoryRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  inventoryItem: {
    flex: 1, alignItems: 'center', padding: 12, borderRadius: 18,
    backgroundColor: '#252860', borderWidth: 2, borderColor: '#3A3D8E',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6,
  },
  inventoryIcon: { width: 28, height: 28, marginBottom: 4 },
  inventoryCount: { color: '#fff', fontSize: 16, fontFamily: Fonts.display },
  inventoryLabel: { color: Colors.textGray, fontSize: 9, fontFamily: Fonts.display, marginTop: 1 },

  // Season banner – 3D casual card
  bannerOuter: {
    borderRadius: 22, paddingBottom: 5,
    backgroundColor: '#1A2050',
    shadowColor: '#FFD700', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 10,
    marginBottom: 10,
  },
  bannerInner: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    borderRadius: 20, backgroundColor: '#252880',
    borderWidth: 2.5, borderColor: '#FFD700', borderBottomWidth: 0,
    overflow: 'hidden',
  },
  bannerHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  bannerLeft: { flex: 1 },
  bannerBadge: {
    backgroundColor: Colors.accentRed, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 3,
    alignSelf: 'flex-start', marginBottom: 6,
  },
  bannerBadgeText: { color: Colors.textWhite, fontSize: 10, fontFamily: Fonts.display },
  bannerTitle: { color: Colors.textWhite, fontSize: 17, fontFamily: Fonts.display },
  bannerDesc: { color: Colors.textGray, fontSize: 11, marginTop: 2 },
  bannerIcon: { width: 52, height: 52, marginHorizontal: 8 },
  bannerArrow: { padding: 4 },
});
