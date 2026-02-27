// ============================================================
// Bat Upgrade Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { GameAssets } from '@/constants/assets';
import { Fonts } from '@/constants/fonts';
import { Header } from '@/components/ui/Header';
import { CartoonButton } from '@/components/ui/CartoonButton';
import { CartoonCard } from '@/components/ui/CartoonCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useGameStore } from '@/store/useGameStore';

const { width } = Dimensions.get('window');

export default function BatsScreen() {
  const { batsList, selectedBatId, selectBat, unlockBat, upgradeBat, coins } = useGameStore();
  const [selectedId, setSelectedId] = useState(selectedBatId);
  const selectedBat = batsList.find((b) => b.id === selectedId);

  return (
    <View style={styles.container}>
      <View style={styles.bgDecor1} />
      <View style={styles.bgDecor2} />
      <Header title="BATS" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {selectedBat && (
          <CartoonCard
            color={selectedBat.isUnlocked ? selectedBat.color + '30' : '#2A2D6E'}
            borderColor={selectedBat.isUnlocked ? selectedBat.color : '#3A3D8E'}
            style={styles.previewCard}
          >
            <MaterialCommunityIcons
              name={selectedBat.icon as any}
              size={64}
              color={selectedBat.color}
            />
            <Text style={styles.previewName}>{selectedBat.name}</Text>
            <Text style={styles.previewDesc}>{selectedBat.description}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <MaterialCommunityIcons name="lightning-bolt" size={16} color={Colors.accentRed} />
                <Text style={styles.statLabel}>Power</Text>
                <View style={{ flex: 1 }}><ProgressBar progress={selectedBat.power / 5} color={Colors.accentRed} height={14} /></View>
                <Text style={styles.statValue}>{selectedBat.power}/5</Text>
              </View>
              <View style={styles.statRow}>
                <MaterialCommunityIcons name="target" size={16} color={Colors.accentGreen} />
                <Text style={styles.statLabel}>Hit Zone</Text>
                <View style={{ flex: 1 }}><ProgressBar progress={selectedBat.hitZone / 5} color={Colors.accentGreen} height={14} /></View>
                <Text style={styles.statValue}>{selectedBat.hitZone}/5</Text>
              </View>
              <View style={styles.statRow}>
                <MaterialCommunityIcons name="fire" size={16} color={Colors.accentOrange} />
                <Text style={styles.statLabel}>Combo</Text>
                <View style={{ flex: 1 }}><ProgressBar progress={selectedBat.comboBonus / 5} color={Colors.accentOrange} height={14} /></View>
                <Text style={styles.statValue}>{selectedBat.comboBonus}/5</Text>
              </View>
            </View>

            <View style={styles.levelRow}>
              <Text style={styles.levelText}>Level {selectedBat.level}/{selectedBat.maxLevel}</Text>
              {Array.from({ length: selectedBat.maxLevel }).map((_, i) => (
                <View key={i} style={[styles.levelDot, i < selectedBat.level && { backgroundColor: Colors.accent }]} />
              ))}
            </View>

            <View style={styles.actionRow}>
              {!selectedBat.isUnlocked ? (
                <CartoonButton
                  title={`UNLOCK  ${selectedBat.upgradeCost}`}
                  icon="lock-open"
                  onPress={() => unlockBat(selectedBat.id)}
                  color={Colors.btnOrange}
                  size="medium"
                  fullWidth
                  disabled={coins < selectedBat.upgradeCost}
                />
              ) : selectedBat.level < selectedBat.maxLevel ? (
                <View style={{ width: '100%', gap: 8 }}>
                  <CartoonButton
                    title={`UPGRADE  ${selectedBat.upgradeCost * selectedBat.level}`}
                    icon="arrow-up-bold"
                    onPress={() => upgradeBat(selectedBat.id)}
                    color={Colors.btnBlue}
                    size="medium"
                    fullWidth
                    disabled={coins < selectedBat.upgradeCost * selectedBat.level}
                  />
                  {selectedBat.id !== selectedBatId && (
                    <CartoonButton title="EQUIP" icon="check" onPress={() => selectBat(selectedBat.id)} color={Colors.btnGreen} size="small" fullWidth />
                  )}
                </View>
              ) : (
                <View style={styles.maxBadge}>
                  <MaterialCommunityIcons name="star" size={18} color={Colors.textDark} />
                  <Text style={styles.maxBadgeText}>MAX LEVEL</Text>
                </View>
              )}
              {selectedBat.isUnlocked && selectedBat.id === selectedBatId && (
                <View style={styles.equippedBadge}>
                  <MaterialCommunityIcons name="check-bold" size={14} color="#fff" />
                  <Text style={styles.equippedText}>EQUIPPED</Text>
                </View>
              )}
            </View>
          </CartoonCard>
        )}

        <Text style={styles.sectionTitle}>ALL BATS</Text>
        {batsList.map((bat, index) => (
          <Animated.View key={bat.id} entering={FadeIn.delay(index * 60).duration(200)}>
            <TouchableOpacity onPress={() => setSelectedId(bat.id)} activeOpacity={0.8}>
              <CartoonCard
                color={selectedId === bat.id ? bat.color + '40' : '#2A2D6E'}
                borderColor={selectedId === bat.id ? Colors.accent : '#3A3D8E'}
                style={styles.batListCard}
              >
                <MaterialCommunityIcons name={bat.icon as any} size={34} color={bat.color} />
                <View style={styles.batInfo}>
                  <Text style={styles.batName}>{bat.name}</Text>
                  <Text style={styles.batLevel}>Lv.{bat.level}</Text>
                </View>
                {!bat.isUnlocked && <MaterialCommunityIcons name="lock" size={20} color="#6E6E8E" />}
                {bat.id === selectedBatId && bat.isUnlocked && (
                  <View style={styles.equipBadge}>
                    <MaterialCommunityIcons name="check" size={16} color="#fff" />
                  </View>
                )}
              </CartoonCard>
            </TouchableOpacity>
          </Animated.View>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A3E' },
  bgDecor1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(155,89,182,0.1)', top: 100, right: -60 },
  bgDecor2: { position: 'absolute', width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(74,144,226,0.08)', bottom: 150, left: -80 },
  scrollContent: { paddingHorizontal: Layout.spacing.md, paddingBottom: 130 },
  previewCard: { alignItems: 'center', padding: 20, marginBottom: 20 },
  previewName: { color: Colors.textWhite, fontSize: 24, fontFamily: Fonts.display, marginTop: 8 },
  previewDesc: { color: Colors.textGray, fontSize: 13, marginTop: 4, textAlign: 'center' },
  statsContainer: { width: '100%', marginTop: 16, gap: 10 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statLabel: { color: Colors.textWhite, fontSize: 12, fontFamily: Fonts.display, width: 60 },
  statValue: { color: Colors.textGray, fontSize: 12, fontFamily: Fonts.display, width: 30, textAlign: 'right' },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  levelText: { color: Colors.textGray, fontSize: 12, fontWeight: '700', marginRight: 4 },
  levelDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#3A3D6E', borderWidth: 2, borderColor: '#4A4D7E' },
  actionRow: { width: '100%', marginTop: 16, gap: 8, alignItems: 'center' },
  maxBadge: { flexDirection: 'row', gap: 6, backgroundColor: Colors.accent, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 8, alignItems: 'center' },
  maxBadgeText: { color: Colors.textDark, fontFamily: Fonts.display, fontSize: 16 },
  equippedBadge: { flexDirection: 'row', gap: 4, backgroundColor: Colors.accentGreen, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 6, alignItems: 'center' },
  equippedText: { color: Colors.textWhite, fontFamily: Fonts.display, fontSize: 13 },
  sectionTitle: { color: Colors.textWhite, fontSize: 20, fontFamily: Fonts.display, marginBottom: 12, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  batListCard: { flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 8 },
  batInfo: { flex: 1, marginLeft: 12 },
  batName: { color: Colors.textWhite, fontSize: 16, fontFamily: Fonts.display },
  batLevel: { color: Colors.textGray, fontSize: 12, fontFamily: Fonts.display },
  equipBadge: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.accentGreen, alignItems: 'center', justifyContent: 'center' },
});
