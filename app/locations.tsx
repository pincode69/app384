// ============================================================
// Locations Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Fonts } from '@/constants/fonts';
import { Header } from '@/components/ui/Header';
import { CartoonCard } from '@/components/ui/CartoonCard';
import { useGameStore } from '@/store/useGameStore';

const { width } = Dimensions.get('window');
const obstacleIcons: Record<string, string> = {
  car: 'car-sports', crate: 'package-variant', bottle: 'bottle-wine', bicycle: 'bicycle',
};

export default function LocationsScreen() {
  const { locationsList, selectedLocationId, selectLocation, level } = useGameStore();

  return (
    <View style={styles.container}>
      <Header title="LOCATIONS" showBack onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Unlock new locations by leveling up! Current level: {level}</Text>

        {locationsList.map((loc, index) => {
          const isSelected = selectedLocationId === loc.id;
          const canUnlock = level >= loc.requiredLevel;
          return (
            <Animated.View key={loc.id} entering={FadeIn.delay(index * 80).duration(200)}>
              <TouchableOpacity
                onPress={() => canUnlock && selectLocation(loc.id)}
                activeOpacity={canUnlock ? 0.8 : 1}
              >
                <CartoonCard
                  color={isSelected ? loc.bgColor + 'CC' : '#2A2D6E'}
                  borderColor={isSelected ? Colors.accent : canUnlock ? loc.accentColor : '#3A3D5E'}
                  style={styles.locationCard}
                >
                  <View style={styles.locationHeader}>
                    <View style={[styles.iconCircle, { backgroundColor: loc.bgColor + '60' }]}>
                      <MaterialCommunityIcons name={loc.icon as any} size={28} color={loc.accentColor} />
                    </View>
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationName}>{loc.name}</Text>
                      <Text style={styles.locationDesc}>{loc.description}</Text>
                    </View>
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <MaterialCommunityIcons name="check" size={18} color="#fff" />
                      </View>
                    )}
                  </View>
                  <View style={styles.obstaclesRow}>
                    <Text style={styles.obstaclesLabel}>Obstacles: </Text>
                    {loc.obstacles.map((obs, i) => (
                      <MaterialCommunityIcons key={i} name={obstacleIcons[obs] as any} size={18} color="#8E8EA0" style={{ marginLeft: 4 }} />
                    ))}
                  </View>
                  {!canUnlock && (
                    <View style={styles.lockOverlay}>
                      <MaterialCommunityIcons name="lock" size={28} color="#fff" />
                      <Text style={styles.lockText}>Requires Level {loc.requiredLevel}</Text>
                    </View>
                  )}
                </CartoonCard>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A3E' },
  scrollContent: { paddingHorizontal: Layout.spacing.md, paddingBottom: 40 },
  subtitle: { color: Colors.textGray, fontSize: 14, textAlign: 'center', marginBottom: 20, marginTop: 8 },
  locationCard: { marginBottom: 14, padding: 16, overflow: 'hidden' },
  locationHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconCircle: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
  },
  locationInfo: { flex: 1 },
  locationName: { color: Colors.textWhite, fontSize: 20, fontFamily: Fonts.display },
  locationDesc: { color: Colors.textGray, fontSize: 12, marginTop: 2 },
  selectedBadge: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.accentGreen, alignItems: 'center', justifyContent: 'center',
  },
  obstaclesRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  obstaclesLabel: { color: Colors.textGray, fontSize: 12, fontWeight: '700' },
  lockOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8,
  },
  lockText: { color: Colors.textWhite, fontSize: 16, fontFamily: Fonts.display },
});
