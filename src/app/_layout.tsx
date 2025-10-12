import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./global.css";
import { colors } from "@/design-system";

// Keep the splash screen visible while we fetch resources
void SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "WantedSans-Regular": require("../../assets/fonts/WantedSans-Regular.otf"),
    "WantedSans-Medium": require("../../assets/fonts/WantedSans-Medium.otf"),
    "WantedSans-SemiBold": require("../../assets/fonts/WantedSans-SemiBold.otf"),
    "WantedSans-Bold": require("../../assets/fonts/WantedSans-Bold.otf"),
    "WantedSans-ExtraBold": require("../../assets/fonts/WantedSans-ExtraBold.otf"),
    "WantedSans-Black": require("../../assets/fonts/WantedSans-Black.otf"),
    "WantedSans-ExtraBlack": require("../../assets/fonts/WantedSans-ExtraBlack.otf"),
  });

  useEffect(() => {
    // Set Android navigation bar to white
    if (Platform.OS === "android") {
      void SystemUI.setBackgroundColorAsync("#ffffff");
    }
  }, []);

  useEffect(() => {
    if (loaded || error) {
      void SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
