import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Settings, ChevronRight } from "lucide-react-native";
import { BoxField } from "@/components/BoxField";

export default function MyPage() {
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
          <Text className="text-main text-title-3">마이페이지</Text>
          <Pressable className="absolute right-5">
            <Settings size={24} color="#F1F3F3" strokeWidth={2} />
          </Pressable>
        </View>

        {/* User Info Section */}
        <View className="px-5 pt-0">
          <View className="items-center py-2">
            <Text className="text-main text-title-3">유저정보</Text>
          </View>

          {/* Email */}
          <BoxField
            value="example@gmail.com"
            editable={false}
            className="text-title-2"
          />
        </View>

        {/* Menu Items */}
        <View className="px-7 pt-3 gap-2">
          {/* Payment History */}
          <Pressable className="bg-primary h-11 rounded px-3 flex-row items-center justify-between">
            <Text className="text-main text-title-3">결제 내역</Text>
            <ChevronRight size={16.67} color="#F1F3F3" strokeWidth={2} />
          </Pressable>

          {/* Inquiry */}
          <Pressable className="bg-white/[0.08] h-11 rounded px-3 flex-row items-center justify-between">
            <Text className="text-main text-title-3">문의</Text>
            <ChevronRight size={16.67} color="#F1F3F3" strokeWidth={2} />
          </Pressable>

          {/* Policy */}
          <Pressable className="bg-white/[0.08] h-11 rounded px-3 flex-row items-center justify-between">
            <Text className="text-main text-title-3">정책</Text>
            <ChevronRight size={16.67} color="#F1F3F3" strokeWidth={2} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
