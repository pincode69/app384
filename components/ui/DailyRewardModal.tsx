// ============================================================
// DailyRewardModal – Popup for daily login rewards
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Fonts } from '@/constants/fonts';
import { CartoonButton } from './CartoonButton';
import { dailyRewards } from '@/data/shop-items';
import { useGameStore } from '@/store/useGameStore';

const { width } = Dimensions.get('window');

interface DailyRewardModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DailyRewardModal({ visible, onClose }: DailyRewardModalProps) {
  const { claimDailyReward, lastDailyRewardDay } = useGameStore();
  const currentDay = lastDailyRewardDay;

  const handleClaim = () => {
    claimDailyReward();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.titleBar}>
            <Text style={styles.titleText}>DAILY REWARD</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.grid}>
              {dailyRewards.slice(0, 6).map((reward) => {
                const isClaimed = reward.day <= currentDay;
                const isNext = reward.day === currentDay + 1;
                return (
                  <View
                    key={reward.day}
                    style={[styles.dayCell, isClaimed && styles.dayClaimed, isNext && styles.dayNext]}
                  >
                    <Text style={styles.dayLabel}>DAY {reward.day}</Text>
                    <MaterialCommunityIcons
                      name={reward.icon as any}
                      size={30}
                      color={isClaimed ? '#999' : '#6B5BA8'}
                    />
                    <Text style={styles.dayQuantity}>x{reward.quantity}</Text>
                  </View>
                );
              })}
            </View>

            {dailyRewards[6] && (
              <View style={styles.specialDay}>
                <View style={styles.specialLeft}>
                  <Text style={styles.specialDayLabel}>DAY 7</Text>
                  <Text style={styles.specialText}>
                    DAY <Text style={styles.specialBold}>7</Text> GET{'\n'}A SPECIAL SKIN GIFT
                  </Text>
                </View>
                <View style={styles.specialRight}>
                  <MaterialCommunityIcons name="gift" size={40} color="#E74C8B" />
                  <View style={styles.specialBadge}>
                    <Text style={styles.specialBadgeText}>Earring</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          <View style={styles.buttons}>
            <CartoonButton title="GET" onPress={handleClaim} color={Colors.btnGreen} size="medium" />
            <CartoonButton
              title="DOUBLE"
              onPress={handleClaim}
              color={Colors.btnYellow}
              textColor={Colors.textDark}
              icon="play-box"
              size="medium"
            />
          </View>

          <Text style={styles.reminderText}>
            Remember signing everyday{'\n'}to get rewards!
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'center', alignItems: 'center' },
  modal: {
    width: width * 0.88,
    backgroundColor: '#8B7BC8',
    borderRadius: Layout.borderRadius.xxl,
    borderWidth: 4,
    borderColor: '#6B5BA8',
    padding: Layout.spacing.md,
    alignItems: 'center',
  },
  titleBar: {
    backgroundColor: '#5B4BA8',
    borderRadius: Layout.borderRadius.xl,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    color: Colors.textWhite,
    fontSize: 22,
    fontFamily: Fonts.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  closeBtn: {
    position: 'absolute',
    right: -40,
    backgroundColor: '#9B59B6',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#7D4692',
  },
  card: {
    backgroundColor: '#F8F6FF',
    borderRadius: Layout.borderRadius.lg,
    padding: 12,
    width: '100%',
    borderWidth: 2,
    borderColor: '#D0C8F0',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  dayCell: {
    width: '30%',
    backgroundColor: '#E8E0FF',
    borderRadius: Layout.borderRadius.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D0C8F0',
  },
  dayClaimed: { opacity: 0.5, backgroundColor: '#D0D0D0' },
  dayNext: { borderColor: Colors.accentGreen, borderWidth: 3, backgroundColor: '#E8FFE8' },
  dayLabel: { fontSize: 11, fontFamily: Fonts.display, color: '#6B5BA8', marginBottom: 4 },
  dayQuantity: { fontSize: 14, fontFamily: Fonts.display, color: Colors.textDark, marginTop: 4 },
  specialDay: {
    marginTop: 12,
    backgroundColor: '#F0E8FF',
    borderRadius: Layout.borderRadius.lg,
    padding: 14,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#C8B8F0',
    alignItems: 'center',
  },
  specialLeft: { flex: 1 },
  specialDayLabel: { fontSize: 14, fontFamily: Fonts.display, color: '#6B5BA8', marginBottom: 4 },
  specialText: { fontSize: 14, fontWeight: '800', color: Colors.textDark, lineHeight: 20 },
  specialBold: { fontSize: 24, color: Colors.accentOrange },
  specialRight: { alignItems: 'center' },
  specialBadge: {
    backgroundColor: Colors.accentGreen,
    borderRadius: Layout.borderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 4,
  },
  specialBadgeText: { color: Colors.textWhite, fontSize: 11, fontWeight: '800' },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 14 },
  reminderText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
});
