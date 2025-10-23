import { Tabs } from "expo-router";
import { LayoutGrid, User } from "lucide-react-native";
import { colors } from "@/design-system";

export default function DeveloperLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
          color: colors.main,
        },
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
          title: "등록한 앱",
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
          title: "마이페이지",
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
