// ============================================================
// CoinDisplay – Shows coins/gems/energy with casual 3D pill style
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GameAssets } from '@/constants/assets';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Fonts } from '@/constants/fonts';

interface CoinDisplayProps {
  amount: number;
  type: 'coins' | 'gems' | 'energy';
  size?: 'small' | 'medium';
  onPressAdd?: () => void;
}

export function CoinDisplay({
  amount,
  type,
  size = 'medium',
  onPressAdd,
}: CoinDisplayProps) {
  const isSmall = size === 'small';
  const iconSize = isSmall ? 16 : 20;

  return (
    <View style={[styles.container, type === 'energy' && styles.containerEnergy, type === 'gems' && styles.containerGems]}>
      {type === 'coins' && (
        <Image source={GameAssets.money} style={{ width: iconSize, height: iconSize }} />
      )}
      {type === 'gems' && (
        <MaterialCommunityIcons name="diamond-stone" size={iconSize} color="#C77DFF" />
      )}
      {type === 'energy' && (
        <Image source={GameAssets.energy} style={{ width: iconSize, height: iconSize }} />
      )}
      <Text style={[styles.amount, isSmall && styles.amountSmall]}>
        {amount.toLocaleString()}
      </Text>
      {onPressAdd && (
        <TouchableOpacity style={styles.addBtn} onPress={onPressAdd}>
          <MaterialCommunityIcons name="plus" size={14} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3D3D1A',
    borderRadius: Layout.borderRadius.round,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255,215,0,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  containerEnergy: {
    backgroundColor: '#1A3D2D',
    borderColor: 'rgba(76,217,100,0.2)',
  },
  containerGems: {
    backgroundColor: '#2D1A3D',
    borderColor: 'rgba(155,89,182,0.2)',
  },
  amount: {
    color: Colors.textWhite,
    fontFamily: Fonts.display,
    fontSize: 14,
  },
  amountSmall: {
    fontSize: 12,
  },
  addBtn: {
    backgroundColor: Colors.accentGreen,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    shadowColor: Colors.accentGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
  },
});
