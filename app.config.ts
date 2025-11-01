import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "DIDIM",
  slug: "DIDIM",
  version: "0.0.1",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "didim",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  extra: {
    eas: {
      projectId: "0132fec0-6cbf-45cc-ae7b-c5004c46e0e5",
    },
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.didim.ios",
  },
  android: {
    googleServicesFile: "./google-services.json",
    package: "com.didim.android",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    permissions: [
      "INTERNET",
      "POST_NOTIFICATIONS",
      "SCHEDULE_EXACT_ALARM",
      "USE_EXACT_ALARM",
      "PACKAGE_USAGE_STATS",
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    "expo-web-browser",
    "expo-notifications",
    "expo-dev-client",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
