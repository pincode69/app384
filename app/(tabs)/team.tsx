// ============================================================
// Team Tab – Hero select, bat select, boosters, pre-game setup
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
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
import { useGameStore } from '@/store/useGameStore';

const { width } = Dimensions.get('window');

export default function TeamScreen() {
  const {
    charactersList,
    batsList,
    locationsList,
    boosters,
    selectedCharacterId,
    selectedBatId,
    selectedLocationId,
    activeBoosters,
    selectCharacter,
    selectBat,
    selectLocation,
    toggleBooster,
    buyBooster,
    unlockCharacter,
    energy,
    useEnergy,
    coins,
    bestScore,
  } = useGameStore();

  const [tab, setTab] = useState<'hero' | 'gear' | 'boost'>('hero');

  const selectedChar = charactersList.find((c) => c.id === selectedCharacterId);
  const selectedBatObj = batsList.find((b) => b.id === selectedBatId);
  const selectedLoc = locationsList.find((l) => l.id === selectedLocationId);

  const handlePlay = () => {
    if (energy <= 0) return;
    router.push('/formation');
  };

  return (
    <View style={styles.container}>
      <Image source={GameAssets.clothesRoomBg} style={styles.bgImage} contentFit="cover" />
      <View style={styles.bgOverlay} />

      <Header title="TEAM" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Current lineup summary */}
        <CartoonCard color="#2A2D6E" borderColor="#FFD700" style={styles.lineupCard}>
          <View style={styles.lineupRow}>
            <View style={styles.lineupItem}>
              <View style={[styles.lineupCircle, { borderColor: selectedChar?.color || '#4A90E2' }]}>
                <MaterialCommunityIcons
                  name={(selectedChar?.icon || 'cricket') as any}
                  size={28}
                  color={selectedChar?.color || '#4A90E2'}
                />
              </View>
              <Text style={styles.lineupLabel}>{selectedChar?.name || 'Hero'}</Text>
            </View>
            <View style={styles.lineupItem}>
              <View style={[styles.lineupCircle, { borderColor: selectedBatObj?.color || '#C4956A' }]}>
                <MaterialCommunityIcons
                  name={(selectedBatObj?.icon || 'cricket') as any}
                  size={28}
                  color={selectedBatObj?.color || '#C4956A'}
                />
              </View>
              <Text style={styles.lineupLabel}>{selectedBatObj?.name || 'Bat'}</Text>
            </View>
            <View style={styles.lineupItem}>
              <View style={[styles.lineupCircle, { borderColor: selectedLoc?.accentColor || '#FFD700' }]}>
                <MaterialCommunityIcons
                  name={(selectedLoc?.icon || 'city-variant') as any}
                  size={28}
                  color={selectedLoc?.accentColor || '#FFD700'}
                />
              </View>
              <Text style={styles.lineupLabel}>{selectedLoc?.name || 'City'}</Text>
            </View>
          </View>

          {/* Active boosters */}
          {activeBoosters.length > 0 && (
            <View style={styles.activeBoostersRow}>
              <MaterialCommunityIcons name="lightning-bolt" size={16} color="#FFD700" />
              <Text style={styles.activeBoostersText}>
                {activeBoosters.length} booster{activeBoosters.length > 1 ? 's' : ''} active
              </Text>
            </View>
          )}
        </CartoonCard>

        {/* Sub-tabs */}
        <View style={styles.subTabs}>
          {(['hero', 'gear', 'boost'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.subTab, tab === t && styles.subTabActive]}
              onPress={() => setTab(t)}
            >
              <MaterialCommunityIcons
                name={t === 'hero' ? 'account' : t === 'gear' ? 'sword-cross' : 'rocket-launch'}
                size={18}
                color={tab === t ? '#fff' : '#6E6E8E'}
              />
              <Text style={[styles.subTabText, tab === t && styles.subTabTextActive]}>
                {t === 'hero' ? 'HEROES' : t === 'gear' ? 'GEAR' : 'BOOSTERS'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hero selection */}
        {tab === 'hero' && (
          <Animated.View entering={FadeIn.duration(200)}>
            <View style={styles.grid}>
              {charactersList.map((char) => {
                const isSelected = selectedCharacterId === char.id;
                return (
                  <TouchableOpacity
                    key={char.id}
                    onPress={() => {
                      if (char.isUnlocked) selectCharacter(char.id);
                      else if (coins >= char.price) unlockCharacter(char.id);
                    }}
                    activeOpacity={0.8}
                  >
                    <CartoonCard
                      color={isSelected ? char.color + '40' : '#2A2D6E'}
                      borderColor={isSelected ? '#FFD700' : '#3A3D8E'}
                      style={styles.charCard}
                    >
                      <MaterialCommunityIcons
                        name={char.icon as any}
                        size={40}
                        color={char.isUnlocked ? char.color : '#555'}
                      />
                      <Text style={styles.charName}>{char.name}</Text>
                      {!char.isUnlocked && (
                        <View style={styles.lockOverlay}>
                          <MaterialCommunityIcons name="lock" size={22} color="#fff" />
                          <View style={styles.priceTag}>
                            <Image source={GameAssets.money} style={styles.priceIcon} />
                            <Text style={styles.priceText}>{char.price}</Text>
                          </View>
                        </View>
                      )}
                      {isSelected && char.isUnlocked && (
                        <View style={styles.checkBadge}>
                          <MaterialCommunityIcons name="check" size={14} color="#fff" />
                        </View>
                      )}
                    </CartoonCard>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Gear – bat & location */}
        {tab === 'gear' && (
          <Animated.View entering={FadeIn.duration(200)}>
            <Text style={styles.sectionTitle}>SELECT BAT</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.horizRow}>
                {batsList.map((bat) => {
                  const isSelected = selectedBatId === bat.id;
                  return (
                    <TouchableOpacity
                      key={bat.id}
                      onPress={() => bat.isUnlocked && selectBat(bat.id)}
                      activeOpacity={0.8}
                    >
                      <CartoonCard
                        color={isSelected ? bat.color + '40' : '#2A2D6E'}
                        borderColor={isSelected ? '#FFD700' : '#3A3D8E'}
                        style={styles.gearCard}
                      >
                        <MaterialCommunityIcons
                          name={bat.icon as any}
                          size={36}
                          color={bat.isUnlocked ? bat.color : '#555'}
                        />
                        <Text style={styles.gearName}>{bat.name}</Text>
                        <Text style={styles.gearStat}>PWR: {bat.power}</Text>
                        {!bat.isUnlocked && (
                          <View style={styles.lockSmall}>
                            <MaterialCommunityIcons name="lock" size={16} color="#fff" />
                          </View>
                        )}
                      </CartoonCard>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>SELECT LOCATION</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.horizRow}>
                {locationsList.map((loc) => {
                  const isSelected = selectedLocationId === loc.id;
                  return (
                    <TouchableOpacity
                      key={loc.id}
                      onPress={() => loc.isUnlocked && selectLocation(loc.id)}
                      activeOpacity={0.8}
                    >
                      <CartoonCard
                        color={isSelected ? loc.bgColor + 'CC' : '#2A2D6E'}
                        borderColor={isSelected ? '#FFD700' : '#3A3D8E'}
                        style={styles.gearCard}
                      >
                        <MaterialCommunityIcons
                          name={loc.icon as any}
                          size={36}
                          color={loc.isUnlocked ? loc.accentColor : '#555'}
                        />
                        <Text style={styles.gearName}>{loc.name}</Text>
                        {!loc.isUnlocked && (
                          <View style={styles.lockSmall}>
                            <MaterialCommunityIcons name="lock" size={16} color="#fff" />
                          </View>
                        )}
                      </CartoonCard>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </Animated.View>
        )}

        {/* Boosters */}
        {tab === 'boost' && (
          <Animated.View entering={FadeIn.duration(200)}>
            <View style={styles.boosterGrid}>
              {boosters.map((booster) => {
                const isActive = activeBoosters.includes(booster.id);
                return (
                  <TouchableOpacity
                    key={booster.id}
                    onPress={() => {
                      if (booster.owned > 0) toggleBooster(booster.id);
                    }}
                    onLongPress={() => buyBooster(booster.id)}
                    activeOpacity={0.8}
                  >
                    <CartoonCard
                      color={isActive ? '#2D6E3A' : '#2A2D6E'}
                      borderColor={isActive ? Colors.accentGreen : '#3A3D8E'}
                      style={styles.boosterCard}
                    >
                      <View style={styles.boosterHeader}>
                        <MaterialCommunityIcons
                          name={booster.icon as any}
                          size={32}
                          color={isActive ? Colors.accentGreen : '#8E8EA0'}
                        />
                        {isActive && (
                          <View style={styles.activeDot} />
                        )}
                      </View>
                      <Text style={styles.boosterName}>{booster.name}</Text>
                      <Text style={styles.boosterDesc}>{booster.description}</Text>
                      <View style={styles.boosterFooter}>
                        <Text style={styles.boosterOwned}>x{booster.owned}</Text>
                        <TouchableOpacity
                          style={styles.buySmallBtn}
                          onPress={() => buyBooster(booster.id)}
                        >
                          {booster.currency === 'coins' ? (
                            <Image source={GameAssets.money} style={{ width: 12, height: 12 }} />
                          ) : (
                            <MaterialCommunityIcons name="diamond-stone" size={12} color="#C77DFF" />
                          )}
                          <Text style={styles.buySmallText}>{booster.price}</Text>
                        </TouchableOpacity>
                      </View>
                    </CartoonCard>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.boosterHint}>
              Tap to toggle, hold to buy more
            </Text>
          </Animated.View>
        )}

        {/* PLAY button */}
        <View style={styles.playSection}>
          <CartoonButton
            title={energy > 0 ? 'START GAME' : 'NO ENERGY'}
            icon={energy > 0 ? 'play' : 'battery-alert'}
            onPress={handlePlay}
            color={energy > 0 ? Colors.btnGreen : Colors.btnRed}
            size="large"
            fullWidth
            disabled={energy <= 0}
          />
          <View style={styles.energyInfo}>
            <Image source={GameAssets.energy} style={{ width: 18, height: 18 }} />
            <Text style={styles.energyText}>{energy}/5 Energy</Text>
          </View>
        </View>

        {/* Best score */}
        <CartoonCard color="#2A2D6E" borderColor="#3A3D8E" style={styles.tipCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
            <Text style={styles.tipTitle}>TIP</Text>
          </View>
          <Text style={styles.tipText}>
            Tap at the perfect moment for combo hits! Chain perfect hits to multiply your score up to 5x!
          </Text>
        </CartoonCard>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A3E' },
  bgImage: { position: 'absolute', width, height: '100%', opacity: 0.12 },
  bgOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(26,26,62,0.6)' },
  scrollContent: { paddingHorizontal: Layout.spacing.md, paddingBottom: 130 },

  // Lineup
  lineupCard: { marginBottom: 16 },
  lineupRow: { flexDirection: 'row', justifyContent: 'space-around' },
  lineupItem: { alignItems: 'center', gap: 6 },
  lineupCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 3,
    alignItems: 'center', justifyContent: 'center',
  },
  lineupLabel: { color: Colors.textGray, fontSize: 11, fontFamily: Fonts.display },
  activeBoostersRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    justifyContent: 'center', marginTop: 10,
  },
  activeBoostersText: { color: '#FFD700', fontSize: 12, fontWeight: '700' },

  // Sub-tabs
  subTabs: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  subTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: Layout.borderRadius.lg,
    backgroundColor: '#2A2D5E',
    borderWidth: 2.5,
    borderColor: '#3A3D7E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  subTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primaryLight, shadowColor: Colors.primary, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
  subTabText: { color: '#6E6E8E', fontSize: 11, fontFamily: Fonts.display },
  subTabTextActive: { color: '#fff' },

  // Hero grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  charCard: { width: (width - 56) / 2, height: 120, alignItems: 'center', justifyContent: 'center', padding: 16 },
  charName: { color: Colors.textWhite, fontSize: 13, fontFamily: Fonts.display, marginTop: 8, textAlign: 'center' },
  lockOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  priceTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  priceIcon: { width: 14, height: 14 },
  priceText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  checkBadge: {
    position: 'absolute', top: 8, right: 8,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.accentGreen,
    alignItems: 'center', justifyContent: 'center',
  },

  // Gear
  sectionTitle: {
    color: Colors.textWhite, fontSize: 16, fontFamily: Fonts.display,
    marginBottom: 10, letterSpacing: 1,
  },
  horizRow: { flexDirection: 'row', gap: 10, paddingRight: 16 },
  gearCard: { width: 110, height: 110, alignItems: 'center', justifyContent: 'center', padding: 14 },
  gearName: { color: Colors.textWhite, fontSize: 11, fontFamily: Fonts.display, marginTop: 6, textAlign: 'center' },
  gearStat: { color: Colors.accentGreen, fontSize: 10, fontFamily: Fonts.display, marginTop: 2 },
  lockSmall: {
    position: 'absolute', top: 6, right: 6,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Boosters
  boosterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  boosterCard: { width: (width - 52) / 2, height: 150, padding: 14 },
  boosterHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  activeDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.accentGreen, marginLeft: 6,
  },
  boosterName: { color: Colors.textWhite, fontSize: 14, fontFamily: Fonts.display },
  boosterDesc: { color: Colors.textGray, fontSize: 10, marginTop: 2, lineHeight: 14 },
  boosterFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 8,
  },
  boosterOwned: { color: Colors.textGray, fontSize: 13, fontWeight: '800' },
  buySmallBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  buySmallText: { color: Colors.textWhite, fontSize: 11, fontWeight: '700' },
  boosterHint: {
    color: Colors.textGray, fontSize: 11, textAlign: 'center',
    marginTop: 8, fontStyle: 'italic',
  },

  // Play
  playSection: { marginTop: 20, marginBottom: 16 },
  energyInfo: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    justifyContent: 'center', marginTop: 10,
  },
  energyText: { color: Colors.textGray, fontSize: 14, fontWeight: '700' },

  // Tip
  tipCard: { padding: 14 },
  tipTitle: { color: '#FFD700', fontSize: 14, fontFamily: Fonts.display },
  tipText: { color: Colors.textGray, fontSize: 12, lineHeight: 18, marginTop: 6 },
});
