import { Stack } from "expo-router";

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
        headerTintColor: "#F1F3F3",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
          color: "#F1F3F3",
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
      <Stack.Screen
        name="payment"
        options={{
          title: "결제",
        }}
      />
    </Stack>
  );
}
