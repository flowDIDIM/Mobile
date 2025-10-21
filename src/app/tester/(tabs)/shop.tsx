import React from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Title3 } from "@/components/Typography";

export default function TesterShop() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 44,
          paddingBottom: insets.bottom + 80,
        }}
      >
        {/* Top Navigation */}
        <View className="h-13 items-center justify-center relative">
          <Title3>상점</Title3>
        </View>
      </ScrollView>
    </View>
  );
}
