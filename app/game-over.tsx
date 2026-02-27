// ============================================================
// Game Over / Match Results Screen
// ============================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { GameAssets } from '@/constants/assets';
import { Fonts } from '@/constants/fonts';
import { CartoonButton } from '@/components/ui/CartoonButton';
import { CartoonCard } from '@/components/ui/CartoonCard';
import { useMatchStore } from '@/store/useMatchStore';
import { useGameStore } from '@/store/useGameStore';

const { width, height } = Dimensions.get('window');

export default function GameOverScreen() {
  const { runs, wickets, overs, balls, target, matchResult, events, resetMatch } = useMatchStore();
  const { coins, resetGame } = useGameStore();
  const earnedCoins = runs * 2;
  const isWin = matchResult === 'win';

  const trophyScale = useSharedValue(0);
  const scoreScale = useSharedValue(0);

  useEffect(() => {
    trophyScale.value = withDelay(200, withTiming(1, { duration: 400 }));
    scoreScale.value = withDelay(500, withTiming(1, { duration: 300 }));
  }, []);

  const trophyStyle = useAnimatedStyle(() => ({ transform: [{ scale: trophyScale.value }] }));
  const scoreStyle = useAnimatedStyle(() => ({ transform: [{ scale: scoreScale.value }] }));

  const fours = events.filter((e) => e.type === 'four').length;
  const sixes = events.filter((e) => e.type === 'six').length;
  const wicketsFallen = events.filter((e) => e.type === 'wicket').length;

  const handleRetry = () => {
    resetMatch();
    resetGame();
    router.replace('/formation');
  };

  const handleHome = () => {
    resetMatch();
    resetGame();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Image source={GameAssets.stadionBg3} style={styles.bgImage} contentFit="cover" />
      <View style={styles.bgOverlay} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Result title */}
        <Text style={[styles.resultTitle, isWin ? styles.resultWin : styles.resultLoss]}>
          {isWin ? 'VICTORY!' : matchResult === 'draw' ? 'MATCH DRAWN' : 'DEFEAT'}
        </Text>

        {/* Trophy */}
        <Animated.View style={[styles.trophyContainer, trophyStyle]}>
          {isWin ? (
            <Image source={GameAssets.goldenCup} style={styles.trophyImg} contentFit="contain" />
          ) : (
            <Image source={GameAssets.cup} style={styles.trophyImg} contentFit="contain" />
          )}
        </Animated.View>

        {/* Scorecard */}
        <Animated.View style={scoreStyle}>
          <CartoonCard color="#2A2D6E" borderColor={isWin ? '#FFD700' : '#FF3B54'} style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>FINAL SCORE</Text>
            <Text style={styles.scoreValue}>{runs}/{wickets}</Text>
            <Text style={styles.scoreOvers}>in {overs}.{balls} overs</Text>
            <Text style={styles.targetText}>Target: {target}</Text>

            <View style={styles.divider} />

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="numeric-4-box" size={22} color="#4CD964" />
                <Text style={styles.statLabel}>Fours</Text>
                <Text style={styles.statValue}>{fours}</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="numeric-6-box" size={22} color="#FFD700" />
                <Text style={styles.statLabel}>Sixes</Text>
                <Text style={styles.statValue}>{sixes}</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="close-box" size={22} color="#FF3B54" />
                <Text style={styles.statLabel}>Wickets</Text>
                <Text style={styles.statValue}>{wicketsFallen}</Text>
              </View>
              <View style={styles.statItem}>
                <Image source={GameAssets.money} style={{ width: 22, height: 22 }} />
                <Text style={styles.statLabel}>Earned</Text>
                <Text style={styles.statValue}>+{earnedCoins}</Text>
              </View>
            </View>
          </CartoonCard>
        </Animated.View>

        {/* Rewards */}
        {isWin && (
          <Animated.View entering={FadeIn.delay(800).duration(300)}>
            <CartoonCard color="#2D6E3A" borderColor="#4CD964" style={styles.rewardCard}>
              <View style={styles.rewardContent}>
                <Image source={GameAssets.cupReward} style={styles.rewardImg} contentFit="contain" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.rewardTitle}>MATCH BONUS!</Text>
                  <Text style={styles.rewardDesc}>Extra rewards for winning!</Text>
                </View>
                <View style={styles.rewardAmount}>
                  <Image source={GameAssets.moneyReward} style={{ width: 24, height: 24 }} />
                  <Text style={styles.rewardAmountText}>+{runs}</Text>
                </View>
              </View>
            </CartoonCard>
          </Animated.View>
        )}

        {/* Buttons */}
        <Animated.View entering={FadeIn.delay(1000).duration(300)} style={styles.buttonsContainer}>
          <CartoonButton title="PLAY AGAIN" icon="refresh" onPress={handleRetry} color={Colors.btnGreen} size="large" fullWidth />
          <CartoonButton title="HOME" icon="home" onPress={handleHome} color={Colors.btnBlue} size="medium" fullWidth />
        </Animated.View>

        <View style={styles.totalCoins}>
          <Image source={GameAssets.money} style={{ width: 16, height: 16 }} />
          <Text style={styles.totalCoinsText}>Total: {coins.toLocaleString()} coins</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A3E' },
  bgImage: { position: 'absolute', width, height, opacity: 0.2 },
  bgOverlay: { position: 'absolute', width, height, backgroundColor: 'rgba(26,26,62,0.7)' },
  content: { paddingHorizontal: Layout.spacing.lg, alignItems: 'center', paddingTop: 80 },
  resultTitle: { fontSize: 40, fontFamily: Fonts.display, letterSpacing: 3, marginBottom: 12, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 8 },
  resultWin: { color: '#FFD700' },
  resultLoss: { color: '#FF3B54' },
  trophyContainer: { marginBottom: 20 },
  trophyImg: { width: 80, height: 80 },
  scoreCard: { width: width - 48, alignItems: 'center', padding: 24, marginBottom: 16 },
  scoreLabel: { color: Colors.textGray, fontSize: 12, fontFamily: Fonts.display, letterSpacing: 3, marginBottom: 4 },
  scoreValue: { color: '#fff', fontSize: 48, fontFamily: Fonts.display },
  scoreOvers: { color: Colors.textGray, fontSize: 14, fontFamily: Fonts.display },
  targetText: { color: '#FFD700', fontSize: 14, fontFamily: Fonts.display, marginTop: 4 },
  divider: { width: '80%', height: 2, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 16 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  statItem: { alignItems: 'center' },
  statLabel: { color: Colors.textGray, fontSize: 10, fontFamily: Fonts.display, marginTop: 2 },
  statValue: { color: '#fff', fontSize: 18, fontFamily: Fonts.display },
  rewardCard: { width: width - 48, marginBottom: 20 },
  rewardContent: { flexDirection: 'row', alignItems: 'center' },
  rewardImg: { width: 36, height: 36 },
  rewardTitle: { color: '#fff', fontSize: 16, fontFamily: Fonts.display },
  rewardDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  rewardAmount: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rewardAmountText: { color: '#FFD700', fontFamily: Fonts.display, fontSize: 16 },
  buttonsContainer: { width: '100%', gap: 12, marginBottom: 16 },
  totalCoins: { flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: 'rgba(255,215,0,0.1)', borderRadius: 999, paddingHorizontal: 20, paddingVertical: 8 },
  totalCoinsText: { color: Colors.coinGold, fontSize: 14, fontFamily: Fonts.display },
});
