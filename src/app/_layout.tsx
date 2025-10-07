import { Stack } from 'expo-router';
import { colors } from '@/src/tokens/colors';
import "./global.css";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg.primary },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="splash" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="onboarding-developer" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="register-app" />
      <Stack.Screen name="test-status" />
      <Stack.Screen name="payment-history" />
      <Stack.Screen name="app-info" />
    </Stack>
  );
}
