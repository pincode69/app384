// ============================================================
// Mini-Game: Catch – Tap the ball before it disappears
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { GameAssets } from '@/constants/assets';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { MiniGameResult } from '@/types/game';

const { width, height } = Dimensions.get('window');
const AREA_W = width * 0.8;
const AREA_H = 300;

interface Props {
  onComplete: (result: MiniGameResult) => void;
}

export function MiniGameCatch({ onComplete }: Props) {
  const [ballPos, setBallPos] = useState({ x: 0.5, y: 0.5 });
  const [timeLeft, setTimeLeft] = useState(2.0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<MiniGameResult | null>(null);
  const [tapped, setTapped] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Randomize ball position
    setBallPos({
      x: 0.15 + Math.random() * 0.7,
      y: 0.15 + Math.random() * 0.7,
    });

    // Countdown
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.05) {
          clearInterval(timerRef.current!);
          if (!tapped) {
            setFinished(true);
            setResult('fail');
            setTimeout(() => onComplete('fail'), 800);
          }
          return 0;
        }
        return prev - 0.05;
      });
    }, 50);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleTapBall = () => {
    if (finished || tapped) return;
    setTapped(true);
    setFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const res: MiniGameResult = timeLeft > 1.2 ? 'perfect' : 'good';
    setResult(res);
    setTimeout(() => onComplete(res), 800);
  };

  const barWidth = Math.max(0, (timeLeft / 2.0) * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CATCH IT!</Text>
      <Text style={styles.subtitle}>Tap the ball quickly!</Text>

      {/* Timer bar */}
      <View style={styles.timerBar}>
        <View style={[styles.timerFill, { width: `${barWidth}%`, backgroundColor: barWidth > 50 ? '#4CD964' : barWidth > 25 ? '#FFD700' : '#FF3B54' }]} />
      </View>

      {/* Catch area */}
      <View style={styles.area}>
        {!tapped && (
          <TouchableOpacity
            style={[styles.ballTouch, { left: AREA_W * ballPos.x - 30, top: AREA_H * ballPos.y - 30 }]}
            onPress={handleTapBall}
            activeOpacity={0.7}
          >
            <Image source={GameAssets.fireBallSmall} style={styles.ballImg} contentFit="contain" />
          </TouchableOpacity>
        )}
      </View>

      {result && (
        <View style={styles.resultOverlay}>
          <Text style={[styles.resultText, result === 'perfect' ? styles.rPerfect : result === 'good' ? styles.rGood : styles.rFail]}>
            {result === 'perfect' ? 'GREAT CATCH!' : result === 'good' ? 'CAUGHT!' : 'DROPPED!'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#FFD700', fontSize: 28, fontFamily: Fonts.display, letterSpacing: 2, marginBottom: 4, textShadowColor: 'rgba(255,165,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  subtitle: { color: '#aaa', fontSize: 14, marginBottom: 16 },
  timerBar: { width: AREA_W, height: 10, backgroundColor: '#333', borderRadius: 5, marginBottom: 20, overflow: 'hidden' },
  timerFill: { height: '100%', borderRadius: 5 },
  area: { width: AREA_W, height: AREA_H, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', position: 'relative' },
  ballTouch: { position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center' },
  ballImg: { width: 56, height: 56 },
  resultOverlay: { position: 'absolute', alignItems: 'center' },
  resultText: { fontSize: 36, fontFamily: Fonts.display },
  rPerfect: { color: '#FFD700' },
  rGood: { color: '#4CD964' },
  rFail: { color: '#FF3B54' },
});
