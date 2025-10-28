import { Stack } from "expo-router";
import { colors } from "@/design-system";

export default function DeveloperLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
          color: colors.main,
        },
        headerTintColor: colors.main,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ title: "정보 변경" }} />
      <Stack.Screen name="payment-history" options={{ title: "결제 내역" }} />
      <Stack.Screen name="app/[id]" options={{ title: "테스트 현황" }} />
    </Stack>
  );
}
