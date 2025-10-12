import { Tabs } from "expo-router";
import { LayoutGridIcon, UserRound } from "lucide-react-native";

export default function DeveloperLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: 68,
          paddingBottom: 0,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#f1f3f3",
        tabBarInactiveTintColor: "#919da1",
        sceneStyle: { backgroundColor: "transparent" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <LayoutGridIcon
              size={24}
              color={color}
              fill={focused ? color : "none"}
              strokeWidth={2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          tabBarIcon: ({ color }) => (
            <UserRound size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          tabBarIcon: ({ color }) => (
            <UserRound size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
