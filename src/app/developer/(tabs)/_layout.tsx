import { Tabs } from "expo-router";
import { LayoutGrid, User } from "lucide-react-native";
import { bottomTabScreenOptions } from "@/design-system";

export default function DeveloperLayout() {
  return (
    <Tabs screenOptions={bottomTabScreenOptions}>
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
