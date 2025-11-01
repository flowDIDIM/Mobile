import { Stack } from "expo-router";
import { stackNavigationScreenOptions } from "@/design-system";

export default function DeveloperLayout() {
  return (
    <Stack screenOptions={stackNavigationScreenOptions}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ title: "정보 변경" }} />
      <Stack.Screen name="payment-history" options={{ title: "결제 내역" }} />
      <Stack.Screen name="app/[id]" options={{ title: "테스트 현황" }} />
    </Stack>
  );
}
