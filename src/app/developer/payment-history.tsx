import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Title3, Title4, Desc3, ButtonText } from "@/components/Typography";

// Mock payment data
const MOCK_PAYMENTS = [
  {
    id: "1",
    appName: "테스트 앱 1",
    date: "2025.05.05",
    amount: "10,000원",
  },
  {
    id: "2",
    appName: "테스트 앱 2",
    date: "2025.04.20",
    amount: "10,000원",
  },
  {
    id: "3",
    appName: "테스트 앱 3",
    date: "2025.04.15",
    amount: "10,000원",
  },
  {
    id: "4",
    appName: "테스트 앱 4",
    date: "2025.03.30",
    amount: "10,000원",
  },
];

export default function PaymentHistory() {
  const insets = useSafeAreaInsets();

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
          <Title3>결제 내역</Title3>
          <Pressable className="absolute left-5" onPress={() => router.back()}>
            <ChevronLeft size={24} color="#F1F3F3" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Payment List */}
        <View className="px-7 pt-4 gap-3">
          {MOCK_PAYMENTS.map((payment) => (
            <View
              key={payment.id}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl h-20 flex-row items-center justify-between px-3"
            >
              {/* Left side: App name and date */}
              <View className="flex-col justify-between h-12">
                <View className="flex-col gap-0.5">
                  <Title4>'{payment.appName}' 등록</Title4>
                  <Desc3 className="text-sub">{payment.date}</Desc3>
                </View>
              </View>

              {/* Right side: Amount */}
              <ButtonText className="text-sub text-[10px]">
                {payment.amount}
              </ButtonText>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
