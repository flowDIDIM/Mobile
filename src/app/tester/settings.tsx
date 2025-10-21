import React from "react";
import { View, ScrollView, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Title3 } from "@/components/Typography";
import { authClient } from "@/lib/auth-client";

export default function TesterSettings() {
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.replace("/");
    } catch (error) {
      Alert.alert("오류", "로그아웃 중 문제가 발생했습니다.");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "회원탈퇴",
      "정말로 회원탈퇴를 하시겠습니까?\n이 작업은 되돌릴 수 없습니다.",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "탈퇴",
          style: "destructive",
          onPress: async () => {
            try {
              // TODO: Implement account deletion API call
              await authClient.signOut();
              router.replace("/");
            } catch (error) {
              Alert.alert("오류", "회원탈퇴 중 문제가 발생했습니다.");
            }
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 44,
          paddingBottom: insets.bottom + 40,
        }}
      >
        {/* Top Navigation */}
        <View className="h-13 items-center justify-center relative">
          <Title3>정보 변경</Title3>
          <Pressable className="absolute left-5" onPress={() => router.back()}>
            <ChevronLeft size={24} color="#F1F3F3" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Buttons */}
        <View className="px-5 pt-6 gap-3">
          {/* Logout Button */}
          <Pressable
            className="bg-white/[0.08] rounded-lg items-center justify-center px-2.5 py-4"
            onPress={handleLogout}
          >
            <Title3>로그아웃</Title3>
          </Pressable>

          {/* Delete Account Button */}
          <Pressable
            className="bg-white/[0.08] rounded-lg items-center justify-center px-2.5 py-4"
            onPress={handleDeleteAccount}
          >
            <Title3>회원탈퇴</Title3>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
