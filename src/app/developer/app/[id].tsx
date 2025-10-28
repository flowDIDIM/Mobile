import React from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Check } from "lucide-react-native";
import { Title3, Title4, Headline1, ButtonText } from "@/components/Typography";
import { colors } from "@/design-system";
import { useHonoQuery } from "@/lib/hono-rpc";
import { client } from "@/lib/api-client";

function getStatusText(
  completed: boolean,
  dropped: boolean,
  currentDay: number,
): string {
  if (dropped) {
    return `${currentDay}일차 삭제`;
  }
  if (completed) {
    return `${currentDay}일차 완료`;
  }
  if (currentDay === 0) {
    return "미설치";
  }
  return `${currentDay}일차 미완료`;
}

function getStatusColor(completed: boolean, dropped: boolean): string {
  if (dropped) {
    return colors.error;
  }
  if (completed) {
    return colors.primary;
  }
  return colors.sub;
}

export default function AppDetail() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();

  const {
    data: app,
    isLoading,
    error,
  } = useHonoQuery(client.developer.app[":id"], "$get", {
    param: {
      id: params.id,
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Title3 className="text-sub">로딩 중...</Title3>
      </View>
    );
  }

  if (error || !app) {
    return (
      <View className="flex-1 items-center justify-center">
        <Title3 className="text-sub">앱을 찾을 수 없습니다</Title3>
      </View>
    );
  }

  const isActive = app.status === "ONGOING";

  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        {/* Notice Section - px-5 = 20px horizontal padding, mt-6 = 24px top margin */}
        <View className="px-5 mt-6">
          {/* Status Badge Row - py-2 = 8px */}
          <View className="flex-row items-center justify-center gap-3 py-2">
            <Title3
              className="text-center"
              style={{ color: isActive ? colors.primary : colors.sub }}
            >
              {isActive ? "테스트 진행중" : "테스트 종료"}
            </Title3>
            {isActive && (
              <View className="bg-[#BFD9FF] rounded-full flex-row items-center justify-center px-1.5 py-0.5">
                <ButtonText className="text-primary">완료</ButtonText>
              </View>
            )}
          </View>

          {/* Stats Row - reduced spacing */}
          <View className="flex-row items-center mx-auto gap-16 pt-3 pb-1 px-8">
            <View className="items-center">
              <Title3 className="text-center">테스터</Title3>
              <Headline1 className="text-center">{app.testerCount}명</Headline1>
            </View>
            <View className="items-center">
              <Title3 className="text-center">진행률</Title3>
              <Headline1 className="text-center">{app.progress}%</Headline1>
            </View>
          </View>

          {/* Divider - h-px = 1px, mx-2 = 8px horizontal margin */}
          <View className="h-px bg-white/[0.32] mx-2" />
        </View>

        {/* Testers List - reduced top margin, px-7 = 28px, gap-3 = 12px */}
        <View className="mt-3 px-7 gap-3">
          {app.testers.map((tester, index) => (
            <View key={index} className="h-20 relative">
              {/* Card background - ml-8 = 32px left offset for icon, flex-1 fills remaining space */}
              <View className="absolute left-8 right-0 top-0 h-20 bg-white/[0.04] border border-white/[0.08] rounded-xl flex-row items-center justify-between px-3 gap-2.5">
                {/* Email section - flex-1 takes available space */}
                <View className="flex-1 min-w-0">
                  <Title4 numberOfLines={1} ellipsizeMode="tail">
                    {tester.email}
                  </Title4>
                </View>

                {/* Status text */}
                <ButtonText
                  className="shrink-0"
                  style={{
                    color: getStatusColor(tester.completed, tester.dropped),
                  }}
                >
                  {getStatusText(
                    tester.completed,
                    tester.dropped,
                    tester.currentDay,
                  )}
                </ButtonText>
              </View>

              {/* Check Icon Circle - w-4 h-4 = 16x16, top-8 = 32px (centered vertically in 80px container) */}
              <View
                className="absolute left-0 top-8 w-4 h-4 rounded-full items-center justify-center"
                style={{
                  backgroundColor: colors.gray[800],
                }}
              >
                <Check size={11} color={colors.main} strokeWidth={2} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
