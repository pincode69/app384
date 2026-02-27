// ============================================================
// Formation Screen – Set up team positions on the cricket field
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { GameAssets } from '@/constants/assets';
import { Fonts } from '@/constants/fonts';
import { CartoonButton } from '@/components/ui/CartoonButton';
import { CartoonCard } from '@/components/ui/CartoonCard';
import { useMatchStore } from '@/store/useMatchStore';
import { useGameStore } from '@/store/useGameStore';
import { fieldPositions } from '@/data/players';
import { MatchPlayer } from '@/types/game';

const { width } = Dimensions.get('window');
const FIELD_SIZE = width - 32;

export default function FormationScreen() {
  const insets = useSafeAreaInsets();
  const { initMatch, players, bench, setFormation, startMatch } = useMatchStore();
  const { energy, useEnergy, activeBoosters } = useGameStore();

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  useEffect(() => { initMatch(); }, []);

  const allPlayers = [...players, ...bench];

  const handleSlotPress = (slotId: number) => {
    setSelectedSlot(slotId === selectedSlot ? null : slotId);
  };

  const handleAssignPlayer = (player: MatchPlayer) => {
    if (selectedSlot === null) return;

    const updated = allPlayers.map((p) => {
      if (p.id === player.id) return { ...p, isOnField: true, fieldPosition: selectedSlot };
      // If another player was in this slot, move them out
      if (p.fieldPosition === selectedSlot && p.id !== player.id) {
        // Swap: put old player in the new player's old spot
        if (player.fieldPosition > 0) return { ...p, fieldPosition: player.fieldPosition };
        return { ...p, isOnField: false, fieldPosition: 0 };
      }
      return p;
    });

    setFormation(updated);
    setSelectedSlot(null);
  };

  const handleStartMatch = () => {
    if (energy <= 0) return;
    useEnergy();
    startMatch();
    router.replace('/gameplay');
  };

  const getPlayerInSlot = (slotId: number) => players.find((p) => p.fieldPosition === slotId);

  return (
    <View style={styles.container}>
      <Image source={GameAssets.stadionBg2} style={styles.bgImage} contentFit="cover" />
      <View style={styles.bgOverlay} />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FORMATION</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cricket field diagram */}
        <View style={styles.fieldContainer}>
          <View style={styles.field}>
            {/* Field oval */}
            <View style={styles.fieldOval} />
            <View style={styles.pitch} />

            {/* Position markers */}
            {fieldPositions.map((pos) => {
              const player = getPlayerInSlot(pos.id);
              const isSelected = selectedSlot === pos.id;
              return (
                <TouchableOpacity
                  key={pos.id}
                  style={[
                    styles.posMarker,
                    {
                      left: pos.x * FIELD_SIZE - 28,
                      top: pos.y * FIELD_SIZE - 28,
                    },
                    isSelected && styles.posMarkerSelected,
                    player && styles.posMarkerFilled,
                  ]}
                  onPress={() => handleSlotPress(pos.id)}
                >
                  {player ? (
                    <>
                      <MaterialCommunityIcons name={player.icon as any} size={20} color="#fff" />
                      <Text style={styles.posPlayerName} numberOfLines={1}>{player.name.split(' ')[1] || player.name.split(' ')[0]}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.posNumber}>{pos.id}</Text>
                      <Text style={styles.posLabel}>{pos.label}</Text>
                    </>
                  )}
                  {/* Stamina indicator */}
                  {player && (
                    <View style={styles.miniStamina}>
                      <View style={[styles.miniStaminaFill, { width: `${player.stamina}%`, backgroundColor: player.stamina > 50 ? '#4CD964' : player.stamina > 25 ? '#FFD700' : '#FF3B54' }]} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Player selection (when a slot is selected) */}
        {selectedSlot !== null && (
          <CartoonCard color="#2A2D6E" borderColor="#FFD700" style={styles.rosterCard}>
            <Text style={styles.rosterTitle}>
              Assign to: {fieldPositions.find((p) => p.id === selectedSlot)?.label || `Slot ${selectedSlot}`}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.rosterRow}>
                {allPlayers.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.rosterItem, p.fieldPosition === selectedSlot && styles.rosterItemActive]}
                    onPress={() => handleAssignPlayer(p)}
                  >
                    <View style={[styles.rosterIcon, { borderColor: p.color }]}>
                      <MaterialCommunityIcons name={p.icon as any} size={22} color={p.color} />
                    </View>
                    <Text style={styles.rosterName} numberOfLines={1}>{p.name.split(' ')[0]}</Text>
                    <Text style={styles.rosterRole}>{p.role.slice(0, 3).toUpperCase()}</Text>
                    <Text style={styles.rosterSkill}>SKL: {p.skill}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </CartoonCard>
        )}

        {/* Bench */}
        <Text style={styles.sectionTitle}>BENCH ({bench.length})</Text>
        <View style={styles.benchRow}>
          {bench.map((p) => (
            <CartoonCard key={p.id} color="#2A2D4E" borderColor="#3A3D5E" style={styles.benchCard}>
              <MaterialCommunityIcons name={p.icon as any} size={22} color={p.color} />
              <Text style={styles.benchName}>{p.name.split(' ')[0]}</Text>
              <Text style={styles.benchRole}>{p.role.slice(0, 3).toUpperCase()}</Text>
            </CartoonCard>
          ))}
          {bench.length === 0 && <Text style={styles.benchEmpty}>All players on field</Text>}
        </View>

        {/* Active boosters */}
        {activeBoosters.length > 0 && (
          <View style={styles.boostersInfo}>
            <MaterialCommunityIcons name="lightning-bolt" size={16} color="#FFD700" />
            <Text style={styles.boostersText}>{activeBoosters.length} booster(s) will be active</Text>
          </View>
        )}

        {/* Start match */}
        <View style={styles.startSection}>
          <CartoonButton
            title={energy > 0 ? 'START MATCH' : 'NO ENERGY'}
            icon={energy > 0 ? 'play' : 'battery-alert'}
            onPress={handleStartMatch}
            color={energy > 0 ? Colors.btnGreen : Colors.btnRed}
            size="large"
            fullWidth
            disabled={energy <= 0}
          />
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A3E' },
  bgImage: { position: 'absolute', width, height: '100%', opacity: 0.15 },
  bgOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(26,26,62,0.65)' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8 },
  backBtn: { width: 38, height: 38, borderRadius: 13, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  headerTitle: { color: '#fff', fontSize: 22, fontFamily: Fonts.display, letterSpacing: 2, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },

  // Field
  fieldContainer: { alignItems: 'center', marginBottom: 16 },
  field: { width: FIELD_SIZE, height: FIELD_SIZE, position: 'relative' },
  fieldOval: {
    position: 'absolute', top: '5%', left: '5%', width: '90%', height: '90%',
    borderRadius: FIELD_SIZE * 0.45, backgroundColor: 'rgba(39,174,96,0.3)',
    borderWidth: 3, borderColor: 'rgba(39,174,96,0.5)',
  },
  pitch: {
    position: 'absolute', top: '35%', left: '42%', width: '16%', height: '30%',
    backgroundColor: 'rgba(194,178,128,0.4)', borderRadius: 4, borderWidth: 1, borderColor: 'rgba(194,178,128,0.6)',
  },
  posMarker: {
    position: 'absolute', width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(42,45,110,0.9)', borderWidth: 2.5, borderColor: '#4A4D8E',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 6,
  },
  posMarkerSelected: { borderColor: '#FFD700', borderWidth: 3, backgroundColor: 'rgba(255,215,0,0.15)', shadowColor: '#FFD700', shadowOpacity: 0.4 },
  posMarkerFilled: { backgroundColor: 'rgba(74,144,226,0.3)', borderColor: '#4A90E2' },
  posNumber: { color: '#8E8EA0', fontSize: 16, fontFamily: Fonts.display },
  posLabel: { color: '#6E6E8E', fontSize: 7, fontFamily: Fonts.display },
  posPlayerName: { color: '#fff', fontSize: 8, fontWeight: '700', marginTop: 1 },
  miniStamina: { position: 'absolute', bottom: 2, width: 36, height: 3, backgroundColor: '#333', borderRadius: 2, overflow: 'hidden' },
  miniStaminaFill: { height: '100%', borderRadius: 2 },

  // Roster
  rosterCard: { marginBottom: 16 },
  rosterTitle: { color: '#FFD700', fontSize: 14, fontFamily: Fonts.display, marginBottom: 10 },
  rosterRow: { flexDirection: 'row', gap: 8, paddingRight: 16 },
  rosterItem: { alignItems: 'center', padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', width: 72 },
  rosterItemActive: { borderColor: '#FFD700', backgroundColor: 'rgba(255,215,0,0.1)' },
  rosterIcon: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  rosterName: { color: '#fff', fontSize: 10, fontWeight: '700' },
  rosterRole: { color: '#8E8EA0', fontSize: 8, fontWeight: '700' },
  rosterSkill: { color: '#4CD964', fontSize: 9, fontWeight: '700' },

  // Bench
  sectionTitle: { color: '#fff', fontSize: 16, fontFamily: Fonts.display, marginBottom: 8, marginTop: 4 },
  benchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  benchCard: { alignItems: 'center', padding: 10, width: 76 },
  benchName: { color: '#fff', fontSize: 10, fontWeight: '700', marginTop: 4 },
  benchRole: { color: '#8E8EA0', fontSize: 8, fontWeight: '700' },
  benchEmpty: { color: '#6E6E8E', fontSize: 13, fontStyle: 'italic' },

  // Boosters
  boostersInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 16 },
  boostersText: { color: '#FFD700', fontSize: 13, fontWeight: '700' },

  startSection: { marginTop: 8 },
});
