import { Tabs } from "expo-router";
import { Home, Search, Gift, User } from "lucide-react-native";
import { colors } from "@/design-system";

export default function TesterTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          position: "absolute",
          elevation: 0,
          height: 80,
        },
        tabBarActiveTintColor: colors.gray["50"],
        tabBarInactiveTintColor: colors.sub,
        tabBarShowLabel: false,
        sceneStyle: { backgroundColor: "transparent" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, size }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          tabBarIcon: ({ color, size }) => <Gift size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          tabBarIcon: ({ color, size }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
