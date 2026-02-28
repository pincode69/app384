// ============================================================
// Shop Screen – Offers, Daily Deals, Boosters
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { GameAssets } from '@/constants/assets';
import { Fonts } from '@/constants/fonts';
import { Header } from '@/components/ui/Header';
import { CartoonCard } from '@/components/ui/CartoonCard';
import { useGameStore } from '@/store/useGameStore';
import { shopItems, offers } from '@/data/shop-items';

const { width } = Dimensions.get('window');

export default function ShopScreen() {
  const { addCoins, addGems, spendGems, spendCoins, refillEnergy } = useGameStore();

  const handleOfferPurchase = (offer: typeof offers[number]) => {
    const spend = offer.currency === 'gems' ? spendGems : spendCoins;
    if (spend(offer.price)) {
      if (offer.id === 'super_pass') addGems(200);
      if (offer.id === 'chest_pack') { addGems(100); addCoins(5000); }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={GameAssets.shopBg} style={styles.bgImage} contentFit="cover" />
      <View style={styles.bgOverlay} />
      <Header title="SHOP" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Offers */}
        <Animated.View entering={FadeIn.duration(200)}>
          <Text style={styles.sectionTitle}>OFFERS</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={() => handleOfferPurchase(offers[0])}>
            <CartoonCard color="#1E3A6E" borderColor="#FFD700" style={styles.offerCard}>
              <View style={styles.offerBadge}>
                <Text style={styles.offerBadgeText}>x15{'\n'}Value</Text>
              </View>
              <View style={styles.offerContent}>
                <MaterialCommunityIcons name="crown" size={40} color="#FFD700" />
                <View style={styles.offerInfo}>
                  <Text style={styles.offerTitle}>SUPER PASS</Text>
                  <Text style={styles.offerDesc}>Unlock Season Exclusive Reward!</Text>
                </View>
                <View>
                  <Text style={styles.offerTime}>
                    <MaterialCommunityIcons name="clock-outline" size={10} color="#8E8EA0" /> 14d 23h
                  </Text>
                  <View style={styles.offerPriceBtn}>
                    <MaterialCommunityIcons name="diamond-stone" size={14} color="#C77DFF" />
                    <Text style={styles.offerPrice}>{offers[0].price}</Text>
                  </View>
                </View>
              </View>
            </CartoonCard>
          </TouchableOpacity>
        </Animated.View>

        {/* Chest Pack */}
        <Animated.View entering={FadeIn.delay(100).duration(200)}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => handleOfferPurchase(offers[1])}>
            <CartoonCard color="#1E2E6E" borderColor="#4A90E2" style={styles.chestCard}>
              <View style={styles.chestHeader}>
                <View style={styles.bestBadge}><Text style={styles.bestBadgeText}>BEST</Text></View>
                <Text style={styles.chestTitle}>Special Chest Pack</Text>
                <Text style={styles.chestTime}>
                  <MaterialCommunityIcons name="clock-outline" size={10} color="#8E8EA0" /> 3d 23h
                </Text>
              </View>
              <View style={styles.chestItems}>
                {offers[1].items.map((item, i) => (
                  <View key={i} style={styles.chestItem}>
                    <MaterialCommunityIcons name={item.icon as any} size={28} color="#FFD700" />
                    <Text style={styles.chestItemCount}>x{item.quantity}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.chestFooter}>
                <View style={styles.limitedBadge}><Text style={styles.limitedText}>LIMITED</Text></View>
                <View style={styles.chestPriceBtn}>
                  <MaterialCommunityIcons name="diamond-stone" size={14} color="#C77DFF" />
                  <Text style={styles.chestPrice}>{offers[1].price}</Text>
                </View>
              </View>
            </CartoonCard>
          </TouchableOpacity>
        </Animated.View>

        {/* Daily Deals */}
        <Animated.View entering={FadeIn.delay(200).duration(200)}>
          <View style={styles.dailyDealsHeader}>
            <Text style={styles.sectionTitle}>DAILY DEALS</Text>
            <Text style={styles.timerText}>
              <MaterialCommunityIcons name="clock-outline" size={12} color="#8E8EA0" /> 12h 6m 59s
            </Text>
          </View>
          <View style={styles.dealsGrid}>
            {shopItems.slice(0, 6).map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.dealCard,
                  item.isFree && styles.dealCardFree,
                  index === 0 && { borderTopLeftRadius: 16 },
                  index === 2 && { borderTopRightRadius: 16 },
                  index === 3 && { borderBottomLeftRadius: 16 },
                  index === 5 && { borderBottomRightRadius: 16 },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  if (item.isFree) { addCoins(50); }
                  else if (item.currency === 'gems') { if (spendGems(item.price)) addCoins(item.category === 'currency' ? item.quantity : 0); }
                  else if (item.currency === 'coins') { spendCoins(item.price); }
                }}
              >
                <Text style={styles.dealQuantity}>x{item.quantity}</Text>
                <MaterialCommunityIcons name={item.icon as any} size={36} color={item.isFree ? '#27AE60' : '#4A90E2'} />
                <Text style={styles.dealName}>{item.name}</Text>
                {item.isFree ? (
                  <View style={styles.freeBadge}><Text style={styles.freeText}>FREE</Text></View>
                ) : (
                  <View style={styles.priceRow}>
                    <MaterialCommunityIcons name={item.currency === 'gems' ? 'diamond-stone' : 'circle-multiple'} size={14} color={item.currency === 'gems' ? '#C77DFF' : '#FFD700'} />
                    <Text style={styles.priceText}>{item.price}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Resources */}
        <Animated.View entering={FadeIn.delay(300).duration(200)}>
          <Text style={styles.sectionTitle}>RESOURCES</Text>
          <View style={styles.resourceGrid}>
            <TouchableOpacity style={styles.resourceCard} onPress={() => { if (spendGems(10)) addCoins(500); }}>
              <Image source={GameAssets.money} style={{ width: 32, height: 32 }} />
              <Text style={styles.resourceName}>500 Coins</Text>
              <View style={styles.resourcePrice}>
                <MaterialCommunityIcons name="diamond-stone" size={14} color="#C77DFF" />
                <Text style={styles.resourcePriceText}>10</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceCard} onPress={() => { if (spendGems(30)) addCoins(2000); }}>
              <Image source={GameAssets.money} style={{ width: 32, height: 32 }} />
              <Text style={styles.resourceName}>2000 Coins</Text>
              <View style={styles.resourcePrice}>
                <MaterialCommunityIcons name="diamond-stone" size={14} color="#C77DFF" />
                <Text style={styles.resourcePriceText}>30</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceCard} onPress={() => { if (spendCoins(50)) refillEnergy(5); }}>
              <Image source={GameAssets.energy} style={{ width: 32, height: 32 }} />
              <Text style={styles.resourceName}>5 Energy</Text>
              <View style={styles.resourcePrice}>
                <Image source={GameAssets.money} style={{ width: 14, height: 14 }} />
                <Text style={styles.resourcePriceText}>50</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A3E' },
  bgImage: { position: 'absolute', width, height: '100%', opacity: 0.15 },
  bgOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(26,26,62,0.6)' },
  scrollContent: { paddingHorizontal: Layout.spacing.md, paddingBottom: 130 },
  sectionTitle: { color: Colors.textWhite, fontSize: 20, fontFamily: Fonts.display, marginBottom: 12, marginTop: 8, textAlign: 'center' },
  offerCard: { marginBottom: 12, overflow: 'hidden' },
  offerBadge: { position: 'absolute', top: -2, left: -2, backgroundColor: Colors.accentRed, borderRadius: 10, padding: 6, zIndex: 1 },
  offerBadgeText: { color: '#fff', fontSize: 9, fontWeight: '900', textAlign: 'center' },
  offerContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  offerInfo: { flex: 1 },
  offerTitle: { color: '#fff', fontSize: 18, fontFamily: Fonts.display },
  offerDesc: { color: Colors.textGray, fontSize: 12 },
  offerTime: { color: Colors.textGray, fontSize: 10, marginBottom: 4 },
  offerPriceBtn: { backgroundColor: Colors.accentGreen, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 4 },
  offerPrice: { color: '#fff', fontSize: 16, fontFamily: Fonts.display },
  chestCard: { marginBottom: 16, padding: 14 },
  chestHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  bestBadge: { backgroundColor: Colors.accentRed, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginRight: 8 },
  bestBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  chestTitle: { color: '#fff', fontSize: 16, fontFamily: Fonts.display, flex: 1 },
  chestTime: { color: Colors.textGray, fontSize: 10 },
  chestItems: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 12 },
  chestItem: { alignItems: 'center' },
  chestItemCount: { color: '#fff', fontSize: 11, fontWeight: '800', marginTop: 2 },
  chestFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  limitedBadge: { backgroundColor: Colors.accentOrange, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  limitedText: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  chestPriceBtn: { backgroundColor: Colors.accentGreen, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 4 },
  chestPrice: { color: '#fff', fontSize: 16, fontFamily: Fonts.display },
  dailyDealsHeader: { alignItems: 'center', marginBottom: 4 },
  timerText: { color: Colors.textGray, fontSize: 13, fontWeight: '700', marginBottom: 8 },
  dealsGrid: { flexDirection: 'row', flexWrap: 'wrap', borderRadius: 16, overflow: 'hidden' },
  dealCard: { width: (width - Layout.spacing.md * 2) / 3, backgroundColor: '#E0F0FF', padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#B0D0F0' },
  dealCardFree: { backgroundColor: '#D0FFD0', borderColor: Colors.accentGreen },
  dealQuantity: { position: 'absolute', top: 6, right: 8, fontSize: 13, fontFamily: Fonts.display, color: Colors.textDark },
  dealName: { color: Colors.textDark, fontSize: 11, fontFamily: Fonts.display, textAlign: 'center', marginTop: 4, marginBottom: 6 },
  freeBadge: { backgroundColor: Colors.accentGreen, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 3 },
  freeText: { color: '#fff', fontSize: 13, fontFamily: Fonts.display },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  priceText: { color: Colors.textDark, fontSize: 14, fontFamily: Fonts.display },
  resourceGrid: { flexDirection: 'row', gap: 10 },
  resourceCard: { flex: 1, backgroundColor: '#E0E8FF', borderRadius: 18, padding: 14, alignItems: 'center', borderWidth: 2.5, borderColor: '#B0C0F0', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  resourceName: { color: Colors.textDark, fontSize: 12, fontFamily: Fonts.display, textAlign: 'center', marginTop: 4, marginBottom: 6 },
  resourcePrice: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resourcePriceText: { color: Colors.textDark, fontSize: 14, fontWeight: '900' },
  adBadge: { flexDirection: 'row', gap: 4, backgroundColor: Colors.accentOrange, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignItems: 'center' },
  adText: { color: '#fff', fontSize: 11, fontWeight: '800' },
});
