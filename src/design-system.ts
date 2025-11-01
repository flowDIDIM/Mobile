import config from "../tailwind.config";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const colors = config.theme.extend.colors;

export const bottomTabScreenOptions: BottomTabNavigationOptions = {
  // Header
  headerShown: true,
  headerTitleAlign: "center",
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: "transparent",
  },
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.main,
  },

  // Bottom Tab Bar
  tabBarStyle: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    elevation: 0,
  },
  tabBarActiveTintColor: colors.gray["50"],
  tabBarInactiveTintColor: colors.sub,
  tabBarShowLabel: false,

  // Make background transparent(to show gradient)
  sceneStyle: { backgroundColor: "transparent" },
};

export const stackNavigationScreenOptions: NativeStackNavigationOptions = {
  // Header
  headerShown: true,
  headerTitleAlign: "center",
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: "transparent",
  },
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.main,
  },

  // Make background transparent(to show gradient)
  contentStyle: { backgroundColor: "transparent" },
};
