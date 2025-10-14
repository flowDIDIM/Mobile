import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ChevronLeft, Check } from "lucide-react-native";
import { Title3, Title4, Headline1, ButtonText } from "@/components/Typography";
import { colors } from "@/design-system";

// Mock data for demonstration
const MOCK_APPS = {
  "1": {
    id: "1",
    name: "테스트 앱 1",
    isActive: true,
    currentDay: 0,
    testerCount: 3,
    progressRate: 70,
    testers: [
      {
        id: "1",
        email: "example@gmail.com",
        status: "completed",
        day: 1,
      },
      {
        id: "2",
        email: "example2@gmail.com",
        status: "incomplete",
        day: 3,
      },
      {
        id: "3",
        email: "example3@gmail.com",
        status: "not_installed",
        day: 0,
      },
      {
        id: "4",
        email: "example4@gmail.com",
        status: "deleted",
        day: 4,
      },
    ],
  },
  "2": {
    id: "2",
    name: "테스트 앱 2",
    isActive: false,
    currentDay: 0,
    testerCount: 2,
    progressRate: 100,
    testers: [
      {
        id: "1",
        email: "tester1@gmail.com",
        status: "completed",
        day: 7,
      },
      {
        id: "2",
        email: "tester2@gmail.com",
        status: "completed",
        day: 7,
      },
    ],
  },
} as const;

type TesterStatus = "completed" | "incomplete" | "not_installed" | "deleted";

function getStatusText(status: TesterStatus, day: number): string {
  switch (status) {
    case "completed":
      return `${day}일차 완료`;
    case "incomplete":
      return `${day}일차 미완료`;
    case "not_installed":
      return "미설치";
    case "deleted":
      return `${day}일차 삭제`;
  }
}

function getStatusColor(status: TesterStatus): string {
  switch (status) {
    case "completed":
      return colors.primary;
    case "deleted":
      return colors.error;
    default:
      return colors.sub;
  }
}

export default function AppDetail() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();

  const app = MOCK_APPS["1"];

  if (!app) {
    return (
      <View className="flex-1 items-center justify-center">
        <Title3 className="text-sub">앱을 찾을 수 없습니다</Title3>
      </View>
    );
  }

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
          <Title3>테스트 현황</Title3>
          <Pressable className="absolute left-5" onPress={() => router.back()}>
            <ChevronLeft size={24} color="#F1F3F3" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Notice Section */}
        <View className="items-center overflow-hidden px-5 mt-10">
          {/* Status Badge */}
          <View className="flex-row items-center justify-center gap-3 py-2">
            {app.isActive ? (
              <>
                <Title3 className="text-primary text-center">
                  {app.currentDay}일차 진행중
                </Title3>
                <View className="bg-[#BFD9FF] px-1.5 py-0.5 rounded-full">
                  <ButtonText className="text-primary text-[10px]">
                    완료
                  </ButtonText>
                </View>
              </>
            ) : (
              <Title3 className="text-sub text-center">테스트 종료</Title3>
            )}
          </View>

          {/* Stats */}
          <View className="flex-row items-center justify-between py-3 px-16 w-[319px]">
            <View className="items-center">
              <Title4 className="text-main text-center">테스터</Title4>
              <Headline1 className="text-main text-center">
                {app.testerCount}명
              </Headline1>
            </View>
            <View className="items-center">
              <Title4 className="text-main text-center">진행률</Title4>
              <Headline1 className="text-main text-center">
                {app.progressRate}%
              </Headline1>
            </View>
          </View>

          {/* Divider */}
          <View className="h-px w-[319px] bg-white/[0.32]" />
        </View>

        {/* Testers List */}
        <View className="px-7 pt-3 gap-3">
          {app.testers.map((tester) => (
            <View key={tester.id} className="h-20 overflow-hidden relative">
              <View className="absolute bg-white/[0.04] border border-white/[0.08] rounded-xl h-20 flex-row items-center justify-between left-8 px-3 top-0 right-0">
                <View className="flex-row items-center gap-3 flex-1">
                  <Title4
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="flex-1"
                  >
                    {tester.email}
                  </Title4>
                </View>
                <ButtonText
                  className="text-[10px] text-right ml-2"
                  style={{ color: getStatusColor(tester.status) }}
                >
                  {getStatusText(tester.status, tester.day)}
                </ButtonText>
              </View>
              {/* Check Icon */}
              <View className="absolute bg-gray-800 left-0 overflow-hidden rounded-full size-4 top-8 items-center justify-center">
                <Check size={10} color="#F1F3F3" strokeWidth={3} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
