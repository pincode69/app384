// ============================================================
// Mini-Game: Batting Timing – Tap when the ball reaches the zone
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { GameAssets } from '@/constants/assets';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { MiniGameResult } from '@/types/game';

const { width } = Dimensions.get('window');
const ZONE_TOP = 260;
const PERFECT_TOP = 280;
const ZONE_BOTTOM = 340;

interface Props {
  onComplete: (result: MiniGameResult) => void;
}

export function MiniGameBatting({ onComplete }: Props) {
  const [ballY, setBallY] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<MiniGameResult | null>(null);
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loopRef.current = setInterval(() => {
      setBallY((prev) => {
        if (prev >= 400) {
          clearInterval(loopRef.current!);
          if (!finished) {
            setFinished(true);
            setResult('fail');
            setTimeout(() => onComplete('fail'), 800);
          }
          return prev;
        }
        return prev + 4;
      });
    }, 20);
    return () => { if (loopRef.current) clearInterval(loopRef.current); };
  }, []);

  const handleTap = () => {
    if (finished) return;
    setFinished(true);
    if (loopRef.current) clearInterval(loopRef.current);

    let res: MiniGameResult = 'fail';
    if (ballY >= PERFECT_TOP - 15 && ballY <= PERFECT_TOP + 15) res = 'perfect';
    else if (ballY >= ZONE_TOP && ballY <= ZONE_BOTTOM) res = 'good';

    setResult(res);
    setTimeout(() => onComplete(res), 900);
  };

  return (
    <Pressable style={styles.container} onPress={handleTap}>
      <Text style={styles.title}>TAP TO HIT!</Text>
      <Text style={styles.subtitle}>Time your swing perfectly</Text>

      <View style={styles.field}>
        {/* Strike zone */}
        <View style={[styles.zone, { top: ZONE_TOP }]}>
          <View style={styles.perfectLine} />
          <Text style={styles.zoneLabel}>STRIKE ZONE</Text>
        </View>

        {/* Ball */}
        <View style={[styles.ballContainer, { top: ballY }]}>
          <Image source={GameAssets.fireBallSmall} style={styles.ballImg} contentFit="contain" />
        </View>

        {/* Bat at bottom */}
        <View style={styles.bat}>
          <MaterialCommunityIcons name="cricket" size={40} color="#C4956A" />
        </View>
      </View>

      {/* Result overlay */}
      {result && (
        <View style={styles.resultOverlay}>
          <Text style={[
            styles.resultText,
            result === 'perfect' && styles.resultPerfect,
            result === 'good' && styles.resultGood,
            result === 'fail' && styles.resultFail,
          ]}>
            {result === 'perfect' ? 'PERFECT!' : result === 'good' ? 'GOOD!' : 'MISS!'}
          </Text>
          <Text style={styles.resultSubtext}>
            {result === 'perfect' ? 'SIX runs!' : result === 'good' ? 'FOUR runs!' : 'Wicket falls...'}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#FFD700', fontSize: 28, fontFamily: Fonts.display, marginBottom: 4, letterSpacing: 2, textShadowColor: 'rgba(255,165,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  subtitle: { color: '#aaa', fontSize: 14, marginBottom: 20 },
  field: { width: width * 0.5, height: 400, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' },
  zone: { position: 'absolute', left: 0, right: 0, height: 80, backgroundColor: 'rgba(76,217,100,0.2)', borderTopWidth: 2, borderBottomWidth: 2, borderColor: 'rgba(76,217,100,0.4)', alignItems: 'center', justifyContent: 'center' },
  perfectLine: { width: '100%', height: 3, backgroundColor: 'rgba(255,215,0,0.6)' },
  zoneLabel: { color: 'rgba(76,217,100,0.6)', fontSize: 10, fontWeight: '700', marginTop: 4, letterSpacing: 1 },
  ballContainer: { position: 'absolute', left: '50%', marginLeft: -20, width: 40, height: 40 },
  ballImg: { width: 40, height: 40 },
  bat: { position: 'absolute', bottom: 10, left: '50%', marginLeft: -20 },
  resultOverlay: { position: 'absolute', alignItems: 'center' },
  resultText: { fontSize: 42, fontFamily: Fonts.display, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 8 },
  resultPerfect: { color: '#FFD700' },
  resultGood: { color: '#4CD964' },
  resultFail: { color: '#FF3B54' },
  resultSubtext: { color: '#aaa', fontSize: 16, fontWeight: '700', marginTop: 4 },
});
