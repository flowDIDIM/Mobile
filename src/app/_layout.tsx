import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Platform } from "react-native";
import "./global.css";
import { colors } from "@/design-system";

export default function RootLayout() {
  useEffect(() => {
    // Set Android navigation bar to white
    if (Platform.OS === "android") {
      void SystemUI.setBackgroundColorAsync("#ffffff");
    }
  }, []);

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
            headerShown: false,
            headerTransparent: true,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </LinearGradient>
    </>
  );
}
