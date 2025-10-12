import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import "./global.css";
import { colors } from "@/design-system";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={[colors.bg.start, colors.bg.end]}
        locations={[0.37, 1]}
        style={{ flex: 1 }}
      >
        <Stack
          screenOptions={{
            // headerShown: false,
            headerTransparent: true,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </LinearGradient>
    </>
  );
}
