import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ChevronLeft, Check } from "lucide-react-native";
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
    return `${currentDay}일차 이탈`;
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
            {isActive ? (
              <>
                <Title3 className="text-primary text-center">진행중</Title3>
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
                {app.progress}%
              </Headline1>
            </View>
          </View>

          {/* Divider */}
          <View className="h-px w-[319px] bg-white/[0.32]" />
        </View>

        {/* Testers List */}
        <View className="px-7 pt-3 gap-3">
          {app.testers.map((tester, index) => (
            <View key={index} className="h-20 overflow-hidden relative">
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
              {/* Check Icon */}
              <View
                className="absolute left-0 overflow-hidden rounded-full size-4 top-8 items-center justify-center"
                style={{
                  backgroundColor: getStatusColor(
                    tester.completed,
                    tester.dropped,
                  ),
                }}
              >
                <Check size={10} color="#F1F3F3" strokeWidth={3} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
