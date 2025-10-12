import { Tabs } from "expo-router";
import { LayoutGrid, User } from "lucide-react-native";

export default function DeveloperLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: 80,
          paddingBottom: 16,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#F1F3F3",
        tabBarInactiveTintColor: "#919DA1",
        sceneStyle: { backgroundColor: "transparent" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <LayoutGrid
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
          tabBarIcon: ({ color, focused }) => (
            <User
              size={24}
              color={color}
              fill={focused ? color : "none"}
              strokeWidth={2}
            />
          ),
        }}
      />
    </Tabs>
  );
}
