// ============================================================
// Mini-Game: Slider – Stop the moving indicator in the green zone
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { MiniGameResult } from '@/types/game';

const { width } = Dimensions.get('window');
const BAR_WIDTH = width * 0.7;
const GREEN_START = 0.35;
const GREEN_END = 0.65;
const PERFECT_START = 0.45;
const PERFECT_END = 0.55;

interface Props {
  onComplete: (result: MiniGameResult) => void;
}

export function MiniGameSlider({ onComplete }: Props) {
  const [position, setPosition] = useState(0); // 0 to 1
  const [direction, setDirection] = useState(1);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<MiniGameResult | null>(null);
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let pos = 0;
    let dir = 1;
    loopRef.current = setInterval(() => {
      pos += dir * 0.02;
      if (pos >= 1) { pos = 1; dir = -1; }
      if (pos <= 0) { pos = 0; dir = 1; }
      setPosition(pos);
    }, 16);
    return () => { if (loopRef.current) clearInterval(loopRef.current); };
  }, []);

  const handleTap = () => {
    if (finished) return;
    setFinished(true);
    if (loopRef.current) clearInterval(loopRef.current);

    let res: MiniGameResult = 'fail';
    if (position >= PERFECT_START && position <= PERFECT_END) res = 'perfect';
    else if (position >= GREEN_START && position <= GREEN_END) res = 'good';

    setResult(res);
    setTimeout(() => onComplete(res), 900);
  };

  return (
    <Pressable style={styles.container} onPress={handleTap}>
      <Text style={styles.title}>STOP THE SLIDER!</Text>
      <Text style={styles.subtitle}>Hit the green zone for best delivery</Text>

      <View style={styles.barContainer}>
        {/* Background bar */}
        <View style={styles.bar}>
          {/* Green zone */}
          <View style={[styles.greenZone, { left: BAR_WIDTH * GREEN_START, width: BAR_WIDTH * (GREEN_END - GREEN_START) }]} />
          {/* Perfect zone */}
          <View style={[styles.perfectZone, { left: BAR_WIDTH * PERFECT_START, width: BAR_WIDTH * (PERFECT_END - PERFECT_START) }]} />
          {/* Indicator */}
          <View style={[styles.indicator, { left: BAR_WIDTH * position - 3 }]} />
        </View>

        {/* Labels */}
        <View style={styles.labelsRow}>
          <Text style={styles.labelText}>MISS</Text>
          <Text style={[styles.labelText, { color: '#4CD964' }]}>GOOD</Text>
          <Text style={[styles.labelText, { color: '#FFD700' }]}>PERFECT</Text>
          <Text style={[styles.labelText, { color: '#4CD964' }]}>GOOD</Text>
          <Text style={styles.labelText}>MISS</Text>
        </View>
      </View>

      <View style={styles.iconRow}>
        <MaterialCommunityIcons name="arm-flex" size={40} color="#FF8C42" />
      </View>

      {result && (
        <View style={styles.resultOverlay}>
          <Text style={[styles.resultText, result === 'perfect' && styles.rPerfect, result === 'good' && styles.rGood, result === 'fail' && styles.rFail]}>
            {result === 'perfect' ? 'PERFECT!' : result === 'good' ? 'GOOD!' : 'MISS!'}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#FFD700', fontSize: 28, fontFamily: Fonts.display, marginBottom: 4, letterSpacing: 2, textShadowColor: 'rgba(255,165,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  subtitle: { color: '#aaa', fontSize: 14, marginBottom: 30 },
  barContainer: { alignItems: 'center' },
  bar: { width: BAR_WIDTH, height: 30, backgroundColor: '#333', borderRadius: 15, overflow: 'hidden', position: 'relative', borderWidth: 2, borderColor: '#555' },
  greenZone: { position: 'absolute', top: 0, bottom: 0, backgroundColor: 'rgba(76,217,100,0.4)', borderRadius: 4 },
  perfectZone: { position: 'absolute', top: 0, bottom: 0, backgroundColor: 'rgba(255,215,0,0.5)', borderRadius: 4 },
  indicator: { position: 'absolute', top: -4, width: 6, height: 38, backgroundColor: '#fff', borderRadius: 3, shadowColor: '#fff', shadowOpacity: 0.8, shadowRadius: 6, elevation: 4 },
  labelsRow: { flexDirection: 'row', justifyContent: 'space-between', width: BAR_WIDTH, marginTop: 8 },
  labelText: { color: '#666', fontSize: 9, fontWeight: '700' },
  iconRow: { marginTop: 30 },
  resultOverlay: { position: 'absolute', alignItems: 'center' },
  resultText: { fontSize: 42, fontFamily: Fonts.display },
  rPerfect: { color: '#FFD700' },
  rGood: { color: '#4CD964' },
  rFail: { color: '#FF3B54' },
});
