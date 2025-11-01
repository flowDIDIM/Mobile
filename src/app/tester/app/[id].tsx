import React, { useState } from "react";
import { View, ScrollView, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Check, X } from "lucide-react-native";
import {
  Title3,
  Title4,
  Desc2,
  Desc3,
  ButtonText,
  Headline1,
} from "@/components/Typography";
import { Image } from "expo-image";
import { colors } from "@/design-system";
import { useHonoQuery, useHonoMutation } from "@/lib/hono-rpc";
import { client } from "@/lib/api-client";

type TaskStatus = "completed" | "incomplete" | "failed" | "pending";

function getStatusIcon(status: TaskStatus) {
  switch (status) {
    case "completed":
      return <Check size={10} color={colors.gray["50"]} strokeWidth={3} />;
    case "incomplete":
      return <X size={10} color={colors.error} strokeWidth={3} />;
    case "failed":
      return <X size={10} color={colors.error} strokeWidth={3} />;
    case "pending":
      return null;
  }
}

function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case "completed":
      return colors.primary;
    case "incomplete":
      return colors.gray["800"];
    case "failed":
      return colors.error;
    case "pending":
      return colors.gray["800"];
  }
}

export default function TesterAppDetail() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  // Fetch app detail
  const {
    data: app,
    isLoading,
    error,
  } = useHonoQuery(client.tester.apps[":id"], "$get", {
    param: {
      id: params.id,
    },
  });

  // Join app mutation
  const { mutate: joinApp } = useHonoMutation(client.tester.join, "$post", {
    onSuccess: () => {
      Alert.alert("참여 완료", "앱 테스트에 참여했습니다!");
      router.back();
    },
    onError: (error) => {
      Alert.alert("오류", "앱 참여 중 문제가 발생했습니다.");
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

  const handleJoinApp = () => {
    Alert.alert(
      "앱 참여",
      `${app.name}에 참여하시겠습니까?\n매일 테스트를 완료하면 ${app.earnedPoints}P를 획득할 수 있습니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "참여하기",
          onPress: () => {
            joinApp({ json: { applicationId: app.id } });
          },
        },
      ],
    );
  };

  if (app.isJoined && app.testerInfo) {
    // Show progress view for joined apps
    return (
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: insets.bottom + 40,
          }}
        >
          {/* Status Section */}
          <View className="items-center overflow-hidden px-5 mt-4">
            {/* Status Badge */}
            <View className="flex-row items-center justify-center gap-3 py-2">
              <Title3 className="text-primary text-center">
                {app.testerInfo.currentDay}일차 진행중
              </Title3>
              <View className="bg-[#BFD9FF] px-1.5 py-0.5 rounded-full">
                <ButtonText className="text-primary text-[10px]">
                  {app.testerInfo.isTodayCompleted ? "완료" : "미완료"}
                </ButtonText>
              </View>
            </View>

            {/* Progress */}
            <View className="py-3">
              <Headline1 className="text-main text-center">
                {app.testerInfo.progressRate}%
              </Headline1>
            </View>

            {/* Divider */}
            <View className="h-px w-[319px] bg-white/[0.32]" />
          </View>

          {/* Daily Tasks Timeline */}
          <View className="px-7 pt-3 gap-3">
            {app.testerInfo.dailyTasks.map((task) => (
              <View key={task.day} className="h-20 overflow-hidden relative">
                <Pressable
                  className="absolute bg-white/[0.04] border border-white/[0.08] rounded-xl h-20 flex-row items-center justify-between left-8 px-3 top-0 right-0"
                  disabled={task.status === "pending"}
                >
                  <Title4>{task.day}일차</Title4>
                  <ButtonText
                    className="text-[10px]"
                    style={{
                      color:
                        task.status === "completed"
                          ? colors.primary
                          : task.status === "incomplete"
                            ? colors.error
                            : colors.sub,
                    }}
                  >
                    {task.status === "completed"
                      ? "완료"
                      : task.status === "incomplete"
                        ? "미완료"
                        : "대기"}
                  </ButtonText>
                </Pressable>
                {/* Check/X Icon */}
                <View
                  className="absolute left-0 overflow-hidden rounded-full size-4 top-8 items-center justify-center"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  {getStatusIcon(task.status)}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Show join view for not joined apps
  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 100,
        }}
      >
        {/* App Icon */}
        <View className="items-center pt-2">
          <View className="size-[100px] rounded-[20px] overflow-hidden bg-gray-50">
            {app.icon && (
              <Image
                source={{ uri: app.icon }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            )}
          </View>
        </View>

        {/* App Name */}
        <View className="items-center pt-3">
          <Title3>{app.name}</Title3>
        </View>

        {/* Screenshots */}
        <View className="pt-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-5"
            contentContainerStyle={{ gap: 12 }}
          >
            {app.screenshots.map((screenshot, index) => (
              <View
                key={index}
                className="w-[180px] h-[320px] rounded-xl overflow-hidden bg-gray-50"
              >
                {screenshot && (
                  <Image
                    source={{ uri: screenshot }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                )}
              </View>
            ))}
          </ScrollView>
          {/* Pagination dots */}
          <View className="flex-row gap-1 items-center justify-center pt-3">
            {app.screenshots.map((_, index) => (
              <View
                key={index}
                className={`w-1 h-1 rounded-full ${
                  index === activeScreenshot ? "bg-white" : "bg-sub"
                }`}
              />
            ))}
          </View>
        </View>

        {/* Description */}
        <View className="px-5 pt-6">
          <Title4 className="pb-2">앱 설명</Title4>
          <Desc2 className="text-sub">{app.fullDescription}</Desc2>
        </View>

        {/* Info Cards */}
        <View className="px-5 pt-6 gap-3">
          <View className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-3">
            <View className="flex-row items-center justify-between">
              <Desc3 className="text-sub">참여자 수</Desc3>
              <Title4>
                {app.testerCount}/{app.testerCapacity}
              </Title4>
            </View>
          </View>
          <View className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-3">
            <View className="flex-row items-center justify-between">
              <Desc3 className="text-sub">획득 포인트</Desc3>
              <Title4 className="text-primary">{app.earnedPoints}P</Title4>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Join Button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-5"
        style={{ paddingBottom: insets.bottom + 20 }}
      >
        <Pressable
          className="bg-primary rounded-lg py-4 items-center justify-center"
          onPress={handleJoinApp}
        >
          <Title3>참여하기</Title3>
        </Pressable>
      </View>
    </View>
  );
}
