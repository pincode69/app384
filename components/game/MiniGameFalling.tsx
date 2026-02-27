// ============================================================
// Mini-Game: Falling Balls – Tap to hit falling cricket balls
// ============================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GameAssets } from '@/constants/assets';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { MiniGameResult } from '@/types/game';

const { width: SCREEN_W } = Dimensions.get('window');
const GAME_H = 420;
const LANE_COUNT = 3;
const LANE_W = (SCREEN_W * 0.8) / LANE_COUNT;
const BALL_SIZE = 44;
const STRIKE_Y = GAME_H - 80;
const PERFECT_RANGE = 18;
const GOOD_RANGE = 40;
const TICK_MS = 25;
const GAME_DURATION = 6000; // 6 seconds

interface FallingBall {
  id: number;
  lane: number;
  y: number;
  speed: number;
  isHit: boolean;
  isGolden: boolean;
}

interface Props {
  onComplete: (result: MiniGameResult) => void;
}

export function MiniGameFalling({ onComplete }: Props) {
  const [balls, setBalls] = useState<FallingBall[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<MiniGameResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const ballIdRef = useRef(0);
  const ballsRef = useRef<FallingBall[]>([]);
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const hitsRef = useRef(0);
  const missesRef = useRef(0);

  useEffect(() => {
    // Game loop – move balls down
    loopRef.current = setInterval(() => {
      const updated = ballsRef.current
        .map((b) => ({ ...b, y: b.y + b.speed }))
        .filter((b) => {
          if (b.y > GAME_H && !b.isHit) {
            missesRef.current += 1;
            comboRef.current = 0;
            return false;
          }
          if (b.isHit && b.y > GAME_H + 50) return false;
          return b.y < GAME_H + 60;
        });
      ballsRef.current = updated;
      setBalls([...updated]);
      setMisses(missesRef.current);
      setCombo(comboRef.current);
    }, TICK_MS);

    // Spawn balls periodically
    spawnRef.current = setInterval(() => {
      const id = ++ballIdRef.current;
      const isGolden = Math.random() < 0.15;
      const newBall: FallingBall = {
        id,
        lane: Math.floor(Math.random() * LANE_COUNT),
        y: -BALL_SIZE,
        speed: 2.5 + Math.random() * 1.5,
        isHit: false,
        isGolden,
      };
      ballsRef.current.push(newBall);
    }, 700);

    // Countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= TICK_MS * 2) {
          finishGame();
          return 0;
        }
        return prev - 50;
      });
    }, 50);

    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const finishGame = useCallback(() => {
    if (finished) return;
    setFinished(true);
    if (loopRef.current) clearInterval(loopRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    const totalHits = hitsRef.current;
    const totalMisses = missesRef.current;
    const ratio = totalHits / Math.max(1, totalHits + totalMisses);

    let res: MiniGameResult = 'fail';
    if (ratio >= 0.7 && totalHits >= 4) res = 'perfect';
    else if (ratio >= 0.4 && totalHits >= 2) res = 'good';

    setResult(res);
    setTimeout(() => onComplete(res), 1200);
  }, [finished, onComplete]);

  const handleTapLane = (lane: number) => {
    if (finished) return;

    const hittable = ballsRef.current.filter(
      (b) => !b.isHit && b.lane === lane && Math.abs(b.y - STRIKE_Y) < GOOD_RANGE
    );

    if (hittable.length > 0) {
      const ball = hittable[0];
      ball.isHit = true;
      const isPerfect = Math.abs(ball.y - STRIKE_Y) < PERFECT_RANGE;
      const points = isPerfect ? (ball.isGolden ? 30 : 15) : (ball.isGolden ? 20 : 10);

      comboRef.current += 1;
      hitsRef.current += 1;
      scoreRef.current += points * Math.min(comboRef.current, 5);

      setScore(scoreRef.current);
      setHits(hitsRef.current);
      setCombo(comboRef.current);
    } else {
      comboRef.current = 0;
      setCombo(0);
    }
  };

  const barPct = Math.max(0, (timeLeft / GAME_DURATION) * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HIT THE BALLS!</Text>
      <Text style={styles.subtitle}>Tap each lane to hit the balls in the strike zone</Text>

      {/* Timer bar */}
      <View style={styles.timerBar}>
        <View style={[styles.timerFill, { width: `${barPct}%`, backgroundColor: barPct > 50 ? '#4CD964' : barPct > 25 ? '#FFD700' : '#FF3B54' }]} />
      </View>

      {/* Score / Combo */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>SCORE</Text>
          <Text style={styles.statVal}>{score}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>COMBO</Text>
          <Text style={[styles.statVal, combo >= 3 && { color: '#FFD700' }]}>x{combo}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>HITS</Text>
          <Text style={styles.statVal}>{hits}</Text>
        </View>
      </View>

      {/* Game field */}
      <View style={styles.field}>
        {/* Strike zone line */}
        <View style={[styles.strikeLine, { top: STRIKE_Y - GOOD_RANGE }]}>
          <View style={styles.strikeZone}>
            <View style={styles.perfectZone} />
          </View>
        </View>

        {/* Lane dividers */}
        {Array.from({ length: LANE_COUNT - 1 }).map((_, i) => (
          <View key={i} style={[styles.laneDivider, { left: LANE_W * (i + 1) }]} />
        ))}

        {/* Balls */}
        {balls.map((ball) => (
          <View
            key={ball.id}
            style={[
              styles.ballContainer,
              {
                left: ball.lane * LANE_W + (LANE_W - BALL_SIZE) / 2,
                top: ball.y,
                opacity: ball.isHit ? 0.3 : 1,
              },
            ]}
          >
            <Image
              source={ball.isGolden ? GameAssets.fireBall : GameAssets.fireBallSmall}
              style={styles.ballImg}
              contentFit="contain"
            />
          </View>
        ))}

        {/* Lane tap areas */}
        {Array.from({ length: LANE_COUNT }).map((_, lane) => (
          <Pressable
            key={lane}
            style={[styles.laneTap, { left: lane * LANE_W, width: LANE_W }]}
            onPress={() => handleTapLane(lane)}
          >
            <View style={styles.batIcon}>
              <MaterialCommunityIcons name="cricket" size={28} color="rgba(196,149,106,0.6)" />
            </View>
          </Pressable>
        ))}
      </View>

      {/* Result overlay */}
      {result && (
        <View style={styles.resultOverlay}>
          <Text style={[
            styles.resultText,
            result === 'perfect' && styles.rPerfect,
            result === 'good' && styles.rGood,
            result === 'fail' && styles.rFail,
          ]}>
            {result === 'perfect' ? 'AMAZING!' : result === 'good' ? 'GOOD JOB!' : 'MISSED IT!'}
          </Text>
          <Text style={styles.resultScore}>Score: {score}</Text>
          <Text style={styles.resultHits}>{hits} hits / {misses} missed</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    color: '#FFD700',
    fontSize: 26,
    fontFamily: Fonts.display,
    letterSpacing: 2,
    marginBottom: 2,
    textShadowColor: 'rgba(255,165,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: { color: '#aaa', fontSize: 12, marginBottom: 10, textAlign: 'center', paddingHorizontal: 30 },
  timerBar: {
    width: SCREEN_W * 0.8,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  timerFill: { height: '100%', borderRadius: 4 },
  statsRow: { flexDirection: 'row', gap: 20, marginBottom: 12 },
  statBox: { alignItems: 'center' },
  statLabel: { color: '#666', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  statVal: { color: '#fff', fontSize: 18, fontFamily: Fonts.display },
  field: {
    width: SCREEN_W * 0.8,
    height: GAME_H,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
    overflow: 'hidden',
  },
  strikeLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: GOOD_RANGE * 2,
  },
  strikeZone: {
    flex: 1,
    backgroundColor: 'rgba(76,217,100,0.12)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(76,217,100,0.25)',
  },
  perfectZone: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(255,215,0,0.15)',
  },
  laneDivider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  ballContainer: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
  },
  ballImg: { width: BALL_SIZE, height: BALL_SIZE },
  laneTap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  batIcon: {
    position: 'absolute',
    bottom: 16,
    left: '50%',
    marginLeft: -14,
  },
  resultOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 38,
    fontFamily: Fonts.display,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  rPerfect: { color: '#FFD700' },
  rGood: { color: '#4CD964' },
  rFail: { color: '#FF3B54' },
  resultScore: { color: '#fff', fontSize: 18, fontFamily: Fonts.display, marginTop: 8 },
  resultHits: { color: '#8E8EA0', fontSize: 13, marginTop: 4, fontWeight: '700' },
});
