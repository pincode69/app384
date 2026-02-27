// ============================================================
// Root Layout – Street Cricket Rush (with Fugaz One font)
// ============================================================

import { FugazOne_400Regular, useFonts } from "@expo-google-fonts/fugaz-one";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ FugazOne: FugazOne_400Regular });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#1A1A3E" },
            animation: "fade",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="formation"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="gameplay"
            options={{ animation: "slide_from_bottom", gestureEnabled: false }}
          />
          <Stack.Screen
            name="game-over"
            options={{ animation: "fade", gestureEnabled: false }}
          />
          <Stack.Screen
            name="settings"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="locations"
            options={{ animation: "slide_from_right" }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: {
    flex: 1,
    backgroundColor: "#1A1A3E",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { color: "#8E8EA0", fontSize: 14, marginTop: 12 },
});
