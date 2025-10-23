import React from "react";
import { View, ScrollView, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { Settings, ChevronRight } from "lucide-react-native";
import { BoxField } from "@/components/BoxField";
import { Title3, Title2 } from "@/components/Typography";
import { colors } from "@/design-system";
import { authClient } from "@/lib/auth-client";

export default function MyPage() {
  const insets = useSafeAreaInsets();

  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email ?? "";

  const handleSwitchToTester = async () => {
    Alert.alert(
      "계정 전환",
      "테스터 계정으로 전환하시겠습니까?\n현재 계정에서 로그아웃됩니다.",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "전환",
          onPress: async () => {
            try {
              // Logout current account
              await authClient.signOut();
              // Navigate to tester after re-login
              // The user will need to log in with a different Google account
              router.replace("/");
            } catch (error) {
              Alert.alert("오류", "계정 전환 중 문제가 발생했습니다.");
            }
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 px-7">
      {/* User Info Section */}
      <View className="flex-row justify-between items-center mt-4 mb-6">
        <View className="items-center py-2">
          <Title3>유저정보</Title3>
        </View>
        <Pressable
          className="bg-white/[0.08] px-2.5 py-1.5 rounded"
          onPress={handleSwitchToTester}
        >
          <Title3>전환</Title3>
        </Pressable>
      </View>

      {/* Email with Settings Icon */}
      <View>
        <View className="bg-white/[0.04] h-11 rounded flex-row items-center px-3">
          <Title2 className="text-main flex-1">{userEmail}</Title2>
          <Link href="/developer/settings" asChild>
            <Pressable className="bg-white/[0.08] size-5 rounded items-center justify-center">
              <Settings size={12} color={colors.gray["50"]} strokeWidth={2} />
            </Pressable>
          </Link>
        </View>
      </View>

      {/* Menu Items */}
      <View className="pt-4 flex-col gap-3">
        {/* Payment History */}
        <Link href="/developer/payment-history" asChild>
          <Pressable className="bg-primary h-11 rounded-[4px] px-3 flex-row items-center justify-between">
            <Title3>결제 내역</Title3>
            <ChevronRight size={20} color="#F1F3F3" strokeWidth={2} />
          </Pressable>
        </Link>

        {/* Inquiry */}
        <Pressable className="bg-white/[0.08] h-11 rounded-[4px] px-3 flex-row items-center justify-between">
          <Title3>문의</Title3>
          <ChevronRight size={20} color="#F1F3F3" strokeWidth={2} />
        </Pressable>

        {/* Policy */}
        <Pressable className="bg-white/[0.08] h-11 rounded-[4px] px-3 flex-row items-center justify-between">
          <Title3>정책</Title3>
          <ChevronRight size={20} color="#F1F3F3" strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
}
