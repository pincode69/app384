import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { CartoonButton } from '@/components/ui/CartoonButton';
import { router } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <MaterialCommunityIcons name="cricket" size={80} color={Colors.accent} />
      <Text style={styles.title}>Page Not Found!</Text>
      <Text style={styles.subtitle}>Looks like this ball went out of bounds.</Text>
      <CartoonButton
        title="Go Home"
        icon="home"
        onPress={() => router.replace('/(tabs)')}
        color={Colors.btnBlue}
        size="medium"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A3E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  title: {
    color: Colors.textWhite,
    fontSize: 24,
    fontFamily: Fonts.display,
  },
  subtitle: {
    color: Colors.textGray,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
});
