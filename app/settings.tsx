// ============================================================
// Settings Screen (cleaned up – no sound settings)
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Fonts } from '@/constants/fonts';
import { Header } from '@/components/ui/Header';
import { CartoonCard } from '@/components/ui/CartoonCard';
import { CartoonButton } from '@/components/ui/CartoonButton';

export default function SettingsScreen() {
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Header title="SETTINGS" showBack onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* General */}
        <Text style={styles.sectionTitle}>GENERAL</Text>
        <CartoonCard color="#2A2D6E" borderColor="#3A3D8E" style={styles.settingsCard}>
          <SettingRow icon="vibrate" label="Haptic Feedback" value={hapticEnabled} onToggle={setHapticEnabled} />
        </CartoonCard>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
        <CartoonCard color="#2A2D6E" borderColor="#3A3D8E" style={styles.settingsCard}>
          <SettingRow icon="bell" label="Push Notifications" value={notificationsEnabled} onToggle={setNotificationsEnabled} />
        </CartoonCard>

        {/* Account */}
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <CartoonCard color="#2A2D6E" borderColor="#3A3D8E" style={styles.settingsCard}>
          <SettingButton icon="cloud-upload" label="Save Progress" />
        </CartoonCard>

        {/* About */}
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <CartoonCard color="#2A2D6E" borderColor="#3A3D8E" style={styles.settingsCard}>
          <SettingButton icon="file-document" label="Privacy Policy" />
          <View style={styles.separator} />
          <SettingButton icon="clipboard-text" label="Terms of Service" />
          <View style={styles.separator} />
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Version</Text>
            <Text style={styles.versionValue}>1.0.0</Text>
          </View>
        </CartoonCard>

        <View style={styles.dangerZone}>
          <CartoonButton
            title="Reset Progress"
            icon="alert"
            onPress={() => {}}
            color={Colors.btnRed}
            size="small"
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function SettingRow({ icon, label, value, onToggle }: {
  icon: string; label: string; value: boolean; onToggle: (v: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <MaterialCommunityIcons name={icon as any} size={22} color="#8E8EA0" />
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch value={value} onValueChange={onToggle} trackColor={{ false: '#4A4D6E', true: Colors.accentGreen }} thumbColor="#fff" />
    </View>
  );
}

function SettingButton({ icon, label }: { icon: string; label: string }) {
  return (
    <TouchableOpacity style={styles.settingRow}>
      <MaterialCommunityIcons name={icon as any} size={22} color="#8E8EA0" />
      <Text style={styles.settingLabel}>{label}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#6E6E8E" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A3E' },
  scrollContent: { paddingHorizontal: Layout.spacing.md, paddingBottom: 40 },
  sectionTitle: { color: Colors.textWhite, fontSize: 16, fontFamily: Fonts.display, marginTop: 20, marginBottom: 10, letterSpacing: 1 },
  settingsCard: { padding: 0, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  settingLabel: { flex: 1, color: Colors.textWhite, fontSize: 15, fontFamily: Fonts.display },
  separator: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: 16 },
  versionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  versionLabel: { color: Colors.textGray, fontSize: 14, fontWeight: '600' },
  versionValue: { color: Colors.textWhite, fontSize: 14, fontWeight: '700' },
  dangerZone: { marginTop: 30, alignItems: 'center' },
});
