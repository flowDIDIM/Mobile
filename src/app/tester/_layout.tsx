import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function TesterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    />
  );
}
