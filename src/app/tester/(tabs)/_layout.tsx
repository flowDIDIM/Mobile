import { Tabs } from "expo-router";
import { Gift, Home, Search, User } from "lucide-react-native";
import { bottomTabScreenOptions } from "@/design-system";

export default function TesterTabsLayout() {
  return (
    <Tabs screenOptions={bottomTabScreenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "탐색",
          tabBarIcon: ({ color, size }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "상점",
          tabBarIcon: ({ color, size }) => <Gift size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: "마이페이지",
          tabBarIcon: ({ color, size }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
