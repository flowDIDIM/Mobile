import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/design-system";

export default function CreateLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: false,
        contentStyle: { backgroundColor: "transparent" },
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerTintColor: colors.main,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
          color: colors.main,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="package"
        options={{
          title: "패키지명 입력",
        }}
      />
      <Stack.Screen
        name="track"
        options={{
          title: "트랙 선택",
        }}
      />
      <Stack.Screen
        name="info"
        options={{
          title: "정보 입력",
        }}
      />
    </Stack>
  );
}
