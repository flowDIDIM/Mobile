import { Stack } from "expo-router";
import { colors } from "@/design-system";

export default function TesterLayout() {
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
      <Stack.Screen name="settings" options={{ title: "정보 변경" }} />
      <Stack.Screen name="point-history" options={{ title: "포인트 기록" }} />
      <Stack.Screen name="app/[id]" options={{ title: "앱 상세" }} />
    </Stack>
  );
}
