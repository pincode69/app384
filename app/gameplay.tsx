// ============================================================
// Match Gameplay – Cricket match simulation with mini-games,
// cards, injuries, medkits, location-based backgrounds
// ============================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import Animated, { FadeIn, FadeOut, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { GameAssets, LocationBgMap } from '@/constants/assets';
import { Layout } from '@/constants/layout';
import { Fonts } from '@/constants/fonts';
import { CartoonCard } from '@/components/ui/CartoonCard';
import { CartoonButton } from '@/components/ui/CartoonButton';
import { useMatchStore } from '@/store/useMatchStore';
import { useGameStore } from '@/store/useGameStore';
import { MiniGameBatting } from '@/components/game/MiniGameBatting';
import { MiniGameSlider } from '@/components/game/MiniGameSlider';
import { MiniGameCatch } from '@/components/game/MiniGameCatch';
import { MiniGameFalling } from '@/components/game/MiniGameFalling';
import { MatchEvent, MiniGameResult, MatchPlayer } from '@/types/game';

const { width, height } = Dimensions.get('window');

export default function GameplayScreen() {
  const insets = useSafeAreaInsets();
  const {
    runs, wickets, overs, balls, target, events, players, bench,
    isMatchActive, isMatchOver, isPaused, activeMiniGame, matchResult,
    injuredPlayerId,
    simulateBall, resolveMiniGame, pauseMatch, resumeMatch,
    swapPlayer, useMatchBooster, healPlayer, endMatch,
  } = useMatchStore();
  const { addCoins, endGame, selectedLocationId, medkits, useMedkit, buyMedkit, coins } = useGameStore();

  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapFromPlayer, setSwapFromPlayer] = useState<string | null>(null);
  const simulateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get background for selected location
  const bgImage = LocationBgMap[selectedLocationId] || GameAssets.stadionBg1;

  // Auto-simulate balls
  useEffect(() => {
    if (!isMatchActive || isPaused || activeMiniGame || isMatchOver || injuredPlayerId) {
      if (simulateRef.current) clearInterval(simulateRef.current);
      return;
    }
    simulateRef.current = setInterval(() => { simulateBall(); }, 3000);
    return () => { if (simulateRef.current) clearInterval(simulateRef.current); };
  }, [isMatchActive, isPaused, activeMiniGame, isMatchOver, injuredPlayerId]);

  // Navigate to game over when match ends
  useEffect(() => {
    if (isMatchOver) {
      if (simulateRef.current) clearInterval(simulateRef.current);
      addCoins(runs * 2);
      setTimeout(() => router.replace('/game-over'), 1500);
    }
  }, [isMatchOver]);

  // Start the match if not started
  useEffect(() => {
    if (!isMatchActive && !isMatchOver && players.length > 0) {
      useMatchStore.getState().startMatch();
    }
  }, []);

  const handleMiniGameComplete = useCallback((result: MiniGameResult) => {
    resolveMiniGame(result);
  }, []);

  const handleSwap = (benchPlayerId: string) => {
    if (swapFromPlayer) {
      swapPlayer(swapFromPlayer, benchPlayerId);
      setSwapFromPlayer(null);
      setShowSwapModal(false);
    }
  };

  const handleUseMedkit = () => {
    if (!injuredPlayerId) return;
    if (useMedkit()) {
      healPlayer(injuredPlayerId);
    }
  };

  const handleBuyAndUseMedkit = () => {
    if (!injuredPlayerId) return;
    if (buyMedkit()) {
      useMedkit();
      healPlayer(injuredPlayerId);
    }
  };

  const tiredPlayers = players.filter((p) => p.stamina < 30 && !p.isRedCarded);
  const cardedPlayers = players.filter((p) => p.yellowCards > 0 || p.isRedCarded);
  const injuredPlayer = injuredPlayerId ? players.find((p) => p.id === injuredPlayerId) : null;

  const renderEvent = ({ item }: { item: MatchEvent }) => (
    <View style={[
      styles.eventRow,
      item.isImportant && styles.eventRowImportant,
      (item.type === 'yellow_card') && { backgroundColor: 'rgba(255,215,0,0.08)' },
      (item.type === 'red_card') && { backgroundColor: 'rgba(255,59,84,0.08)' },
      (item.type === 'injury') && { backgroundColor: 'rgba(255,140,66,0.08)' },
      (item.type === 'medkit') && { backgroundColor: 'rgba(76,217,100,0.08)' },
    ]}>
      <View style={styles.eventOverBall}>
        <Text style={styles.eventOverText}>{item.over}.{item.ball}</Text>
      </View>
      <View style={styles.eventContent}>
        {/* Event type badge */}
        {item.type === 'yellow_card' && <Image source={GameAssets.cards} style={styles.eventBadgeImg} contentFit="contain" />}
        {item.type === 'red_card' && <Image source={GameAssets.cards} style={styles.eventBadgeImg} contentFit="contain" />}
        {item.type === 'injury' && <Image source={GameAssets.medicalKit} style={styles.eventBadgeImg} contentFit="contain" />}
        {item.type === 'medkit' && <Image source={GameAssets.medicalKit} style={styles.eventBadgeImg} contentFit="contain" />}
        <Text style={[styles.eventText, item.isImportant && styles.eventTextImportant]}>{item.text}</Text>
        {item.runs !== undefined && item.runs > 0 && (
          <View style={[styles.runsBadge, item.runs >= 4 && styles.runsBadgeBig]}>
            <Text style={styles.runsText}>+{item.runs}</Text>
          </View>
        )}
        {item.type === 'wicket' && (
          <View style={styles.wicketBadge}><Text style={styles.wicketText}>W</Text></View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={bgImage} style={styles.bgImage} contentFit="cover" />
      <View style={styles.bgOverlay} />

      {/* Scoreboard */}
      <View style={[styles.scoreboard, { paddingTop: insets.top + 4 }]}>
        <TouchableOpacity onPress={() => isPaused ? resumeMatch() : pauseMatch()} style={styles.pauseBtn}>
          <MaterialCommunityIcons name={isPaused ? 'play' : 'pause'} size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.scoreCenter}>
          <Text style={styles.scoreRuns}>{runs}/{wickets}</Text>
          <Text style={styles.scoreOvers}>Overs: {overs}.{balls}</Text>
        </View>

        <View style={styles.targetBox}>
          <Text style={styles.targetLabel}>TARGET</Text>
          <Text style={styles.targetValue}>{target}</Text>
        </View>
      </View>

      {/* Need bar */}
      <View style={styles.needBar}>
        <View style={styles.needBarTrack}>
          <View style={[styles.needBarFill, { width: `${Math.min(100, (runs / target) * 100)}%` }]} />
        </View>
        <Text style={styles.needText}>Need {Math.max(0, target - runs)} from {Math.max(0, (20 - overs) * 6 - balls)} balls</Text>
      </View>

      {/* Current players bar */}
      <View style={styles.playersBar}>
        {players.slice(0, 4).map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.playerMini, p.isRedCarded && styles.playerMiniRed, p.isInjured && styles.playerMiniInjured]}
            onPress={() => { setSwapFromPlayer(p.id); setShowSwapModal(true); }}
          >
            <View style={styles.playerMiniTop}>
              <MaterialCommunityIcons name={p.icon as any} size={14} color={p.isRedCarded ? '#FF3B54' : p.color} />
              {p.yellowCards > 0 && !p.isRedCarded && <View style={styles.yellowDot} />}
              {p.isRedCarded && <View style={styles.redDot} />}
              {p.isInjured && <Image source={GameAssets.medicalKit} style={{ width: 12, height: 12 }} />}
            </View>
            <Text style={styles.playerMiniName} numberOfLines={1}>{p.name.split(' ')[1] || p.name.split(' ')[0]}</Text>
            <View style={styles.staminaBar}>
              <View style={[styles.staminaFill, { width: `${p.stamina}%`, backgroundColor: p.stamina > 50 ? '#4CD964' : p.stamina > 25 ? '#FFD700' : '#FF3B54' }]} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tired player warning */}
      {tiredPlayers.length > 0 && !injuredPlayerId && (
        <TouchableOpacity style={styles.tiredWarning} onPress={() => setShowSwapModal(true)}>
          <MaterialCommunityIcons name="alert" size={16} color="#FFD700" />
          <Text style={styles.tiredText}>{tiredPlayers.length} player(s) tired! Tap to swap.</Text>
        </TouchableOpacity>
      )}

      {/* Event log */}
      <View style={styles.logContainer}>
        <View style={styles.logHeader}>
          <MaterialCommunityIcons name="script-text" size={16} color="#FFD700" />
          <Text style={styles.logTitle}>MATCH LOG</Text>
          {/* Medkit counter */}
          <View style={styles.medkitBadge}>
            <Image source={GameAssets.medicalKit} style={{ width: 14, height: 14 }} />
            <Text style={styles.medkitCount}>x{medkits}</Text>
          </View>
        </View>
        <FlatList
          data={events}
          renderItem={renderEvent}
          keyExtractor={(item) => String(item.id)}
          style={styles.logList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Action buttons */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setShowSwapModal(true)}>
          <MaterialCommunityIcons name="swap-horizontal" size={22} color="#fff" />
          <Text style={styles.actionLabel}>Swap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnBoost]} onPress={() => useMatchBooster('stamina_boost')}>
          <MaterialCommunityIcons name="lightning-bolt" size={22} color="#FFD700" />
          <Text style={styles.actionLabel}>Boost</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnMedkit]} onPress={handleUseMedkit} disabled={!injuredPlayerId}>
          <Image source={GameAssets.medicalKit} style={{ width: 22, height: 22 }} />
          <Text style={styles.actionLabel}>Medkit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => endMatch()}>
          <MaterialCommunityIcons name="flag-checkered" size={22} color="#fff" />
          <Text style={styles.actionLabel}>End</Text>
        </TouchableOpacity>
      </View>

      {/* Mini-game overlays */}
      {activeMiniGame === 'batting' && (
        <View style={styles.miniGameOverlay}><MiniGameBatting onComplete={handleMiniGameComplete} /></View>
      )}
      {activeMiniGame === 'slider' && (
        <View style={styles.miniGameOverlay}><MiniGameSlider onComplete={handleMiniGameComplete} /></View>
      )}
      {activeMiniGame === 'catch' && (
        <View style={styles.miniGameOverlay}><MiniGameCatch onComplete={handleMiniGameComplete} /></View>
      )}
      {activeMiniGame === 'falling' && (
        <View style={styles.miniGameOverlay}><MiniGameFalling onComplete={handleMiniGameComplete} /></View>
      )}

      {/* Injury overlay */}
      {injuredPlayer && !activeMiniGame && (
        <View style={styles.injuryOverlay}>
          <CartoonCard color="#3A1A1A" borderColor="#FF8C42" style={styles.injuryCard}>
            <Image source={GameAssets.medicalKit} style={styles.injuryIcon} contentFit="contain" />
            <Text style={styles.injuryTitle}>PLAYER INJURED!</Text>
            <Text style={styles.injuryPlayerName}>{injuredPlayer.name}</Text>
            <Text style={styles.injuryDesc}>Use a Medical Kit to heal or swap the player.</Text>

            <View style={styles.injuryActions}>
              {medkits > 0 ? (
                <CartoonButton
                  title={`USE MEDKIT (${medkits})`}
                  icon="medical-bag"
                  onPress={handleUseMedkit}
                  color={Colors.btnGreen}
                  size="medium"
                  fullWidth
                />
              ) : (
                <CartoonButton
                  title={coins >= 100 ? 'BUY & USE (100)' : 'NO COINS'}
                  icon="cart"
                  onPress={handleBuyAndUseMedkit}
                  color={coins >= 100 ? Colors.btnOrange : Colors.btnRed}
                  size="medium"
                  fullWidth
                  disabled={coins < 100}
                />
              )}
              <CartoonButton
                title="SWAP PLAYER"
                icon="swap-horizontal"
                onPress={() => { setSwapFromPlayer(injuredPlayer.id); setShowSwapModal(true); }}
                color={Colors.btnBlue}
                size="small"
                fullWidth
              />
            </View>
          </CartoonCard>
        </View>
      )}

      {/* Pause overlay */}
      {isPaused && !activeMiniGame && !injuredPlayer && (
        <View style={styles.pauseOverlay}>
          <Text style={styles.pauseTitle}>PAUSED</Text>
          <View style={styles.pauseButtons}>
            <TouchableOpacity style={styles.pauseMenuBtn} onPress={resumeMatch}>
              <MaterialCommunityIcons name="play" size={24} color="#fff" />
              <Text style={styles.pauseMenuText}>Resume</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pauseMenuBtn} onPress={() => { endMatch(); router.replace('/game-over'); }}>
              <MaterialCommunityIcons name="exit-to-app" size={24} color="#fff" />
              <Text style={styles.pauseMenuText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Swap modal */}
      {showSwapModal && (
        <View style={styles.swapOverlay}>
          <CartoonCard color="#2A2D6E" borderColor="#FFD700" style={styles.swapCard}>
            <View style={styles.swapHeader}>
              <Text style={styles.swapTitle}>SWAP PLAYER</Text>
              <TouchableOpacity onPress={() => { setShowSwapModal(false); setSwapFromPlayer(null); }}>
                <MaterialCommunityIcons name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            {!swapFromPlayer && (
              <>
                <Text style={styles.swapSubtitle}>Select player to replace:</Text>
                <ScrollView style={{ maxHeight: height * 0.35 }}>
                  {players.map((p) => (
                    <TouchableOpacity key={p.id} style={[styles.swapRow, p.isRedCarded && { opacity: 0.4 }]} onPress={() => !p.isRedCarded && setSwapFromPlayer(p.id)}>
                      <Image source={GameAssets.team1} style={styles.swapPlayerImg} contentFit="contain" />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.swapName}>{p.name}</Text>
                        <View style={styles.swapBadges}>
                          {p.yellowCards > 0 && <View style={styles.yellowCardBadge}><Text style={styles.cardBadgeText}>YC</Text></View>}
                          {p.isRedCarded && <View style={styles.redCardBadge}><Text style={styles.cardBadgeText}>RC</Text></View>}
                          {p.isInjured && <Image source={GameAssets.medicalKit} style={{ width: 14, height: 14 }} />}
                        </View>
                      </View>
                      <View style={[styles.staminaBar, { width: 50 }]}>
                        <View style={[styles.staminaFill, { width: `${p.stamina}%`, backgroundColor: p.stamina > 50 ? '#4CD964' : '#FF3B54' }]} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            {swapFromPlayer && (
              <>
                <Text style={styles.swapSubtitle}>Select replacement from bench:</Text>
                {bench.length === 0 ? (
                  <Text style={styles.swapEmpty}>No players on bench</Text>
                ) : (
                  <ScrollView style={{ maxHeight: height * 0.35 }}>
                    {bench.map((p) => (
                      <TouchableOpacity key={p.id} style={styles.swapRow} onPress={() => handleSwap(p.id)}>
                        <Image source={GameAssets.team2} style={styles.swapPlayerImg} contentFit="contain" />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.swapName}>{p.name}</Text>
                          <Text style={styles.swapRole}>{p.role}</Text>
                        </View>
                        <Text style={styles.swapSkill}>SKL:{p.skill}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </>
            )}
          </CartoonCard>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A3E' },
  bgImage: { position: 'absolute', width, height, opacity: 0.2 },
  bgOverlay: { position: 'absolute', width, height, backgroundColor: 'rgba(26,26,62,0.65)' },

  // Scoreboard
  scoreboard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 8, backgroundColor: 'rgba(0,0,0,0.3)' },
  pauseBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  scoreCenter: { flex: 1, alignItems: 'center' },
  scoreRuns: { color: '#fff', fontSize: 36, fontFamily: Fonts.display },
  scoreOvers: { color: '#8E8EA0', fontSize: 13, fontFamily: Fonts.display },
  targetBox: { alignItems: 'center', backgroundColor: 'rgba(255,215,0,0.15)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 4 },
  targetLabel: { color: '#8E8EA0', fontSize: 9, fontFamily: Fonts.display, letterSpacing: 1 },
  targetValue: { color: '#FFD700', fontSize: 20, fontFamily: Fonts.display },

  // Need bar
  needBar: { paddingHorizontal: 16, paddingVertical: 6 },
  needBarTrack: { height: 6, backgroundColor: '#333', borderRadius: 3, overflow: 'hidden' },
  needBarFill: { height: '100%', backgroundColor: '#4CD964', borderRadius: 3 },
  needText: { color: '#8E8EA0', fontSize: 11, fontWeight: '700', textAlign: 'center', marginTop: 4 },

  // Players bar
  playersBar: { flexDirection: 'row', paddingHorizontal: 8, gap: 6, marginBottom: 4 },
  playerMini: { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 6, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  playerMiniRed: { backgroundColor: 'rgba(255,59,84,0.1)', borderColor: 'rgba(255,59,84,0.3)' },
  playerMiniInjured: { backgroundColor: 'rgba(255,140,66,0.1)', borderColor: 'rgba(255,140,66,0.3)' },
  playerMiniTop: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  playerMiniName: { color: '#fff', fontSize: 9, fontWeight: '700', marginTop: 2 },
  yellowDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFD700' },
  redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3B54' },
  staminaBar: { width: '100%', height: 4, backgroundColor: '#333', borderRadius: 2, marginTop: 3, overflow: 'hidden' },
  staminaFill: { height: '100%', borderRadius: 2 },

  // Tired warning
  tiredWarning: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', paddingVertical: 6, backgroundColor: 'rgba(255,215,0,0.1)' },
  tiredText: { color: '#FFD700', fontSize: 12, fontWeight: '700' },

  // Event log
  logContainer: { flex: 1, marginHorizontal: 12, marginBottom: 4, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  logHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  logTitle: { color: '#FFD700', fontSize: 12, fontFamily: Fonts.display, letterSpacing: 1, flex: 1 },
  medkitBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(76,217,100,0.15)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  medkitCount: { color: '#4CD964', fontSize: 11, fontFamily: Fonts.display },
  logList: { flex: 1 },
  eventRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  eventRowImportant: { backgroundColor: 'rgba(255,215,0,0.05)' },
  eventOverBall: { width: 36, alignItems: 'center' },
  eventOverText: { color: '#6E6E8E', fontSize: 11, fontWeight: '700' },
  eventContent: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 8 },
  eventBadgeImg: { width: 18, height: 18 },
  eventText: { flex: 1, color: '#CCCCDD', fontSize: 12, lineHeight: 17 },
  eventTextImportant: { color: '#fff', fontWeight: '700' },
  runsBadge: { backgroundColor: '#2D6E3A', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  runsBadgeBig: { backgroundColor: '#4CD964' },
  runsText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  wicketBadge: { backgroundColor: '#FF3B54', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  wicketText: { color: '#fff', fontSize: 11, fontWeight: '800' },

  // Action bar
  actionBar: { flexDirection: 'row', paddingHorizontal: 12, gap: 8, paddingTop: 8, backgroundColor: 'rgba(0,0,0,0.3)' },
  actionBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, paddingVertical: 10, alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  actionBtnBoost: { backgroundColor: 'rgba(255,215,0,0.12)', borderColor: 'rgba(255,215,0,0.3)' },
  actionBtnMedkit: { backgroundColor: 'rgba(76,217,100,0.12)', borderColor: 'rgba(76,217,100,0.3)' },
  actionLabel: { color: '#fff', fontSize: 9, fontFamily: Fonts.display, marginTop: 2 },

  // Mini-game overlay
  miniGameOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 },

  // Injury overlay
  injuryOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', paddingHorizontal: 24, zIndex: 70 },
  injuryCard: { alignItems: 'center', padding: 24 },
  injuryIcon: { width: 56, height: 56, marginBottom: 12 },
  injuryTitle: { color: '#FF8C42', fontSize: 22, fontFamily: Fonts.display, marginBottom: 4 },
  injuryPlayerName: { color: '#fff', fontSize: 18, fontFamily: Fonts.display, marginBottom: 8 },
  injuryDesc: { color: '#8E8EA0', fontSize: 13, textAlign: 'center', marginBottom: 20 },
  injuryActions: { width: '100%', gap: 10 },

  // Pause overlay
  pauseOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  pauseTitle: { color: '#FFD700', fontSize: 44, fontFamily: Fonts.display, marginBottom: 24, textShadowColor: 'rgba(255,165,0,0.3)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 10 },
  pauseButtons: { gap: 14 },
  pauseMenuBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 28, gap: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)', minWidth: 200 },
  pauseMenuText: { color: '#fff', fontSize: 20, fontFamily: Fonts.display },

  // Swap modal
  swapOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', paddingHorizontal: 20, zIndex: 60 },
  swapCard: { maxHeight: height * 0.75 },
  swapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  swapTitle: { color: '#FFD700', fontSize: 18, fontFamily: Fonts.display },
  swapSubtitle: { color: '#8E8EA0', fontSize: 12, marginBottom: 8 },
  swapRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  swapPlayerImg: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.06)' },
  swapName: { color: '#fff', fontSize: 14, fontWeight: '700' },
  swapBadges: { flexDirection: 'row', gap: 4, marginTop: 2 },
  yellowCardBadge: { backgroundColor: '#FFD700', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  redCardBadge: { backgroundColor: '#FF3B54', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  cardBadgeText: { color: '#000', fontSize: 9, fontWeight: '900' },
  swapRole: { color: '#8E8EA0', fontSize: 11, fontWeight: '600' },
  swapSkill: { color: '#4CD964', fontSize: 11, fontWeight: '700' },
  swapEmpty: { color: '#6E6E8E', fontSize: 13, fontStyle: 'italic', textAlign: 'center', paddingVertical: 20 },
});
