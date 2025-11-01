import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Info } from "lucide-react-native";
import {
  Title3,
  Title4,
  Desc2,
  Desc3,
  ButtonText,
} from "@/components/Typography";
import { Image } from "expo-image";
import { colors } from "@/design-system";
import { useHonoQuery } from "@/lib/hono-rpc";
import { client } from "@/lib/api-client";

type Tab = "recruiting" | "participating";

export default function TesterExplore() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>("recruiting");

  // Fetch recruiting apps
  const { data: recruitingAppsData } = useHonoQuery(
    client.tester.apps,
    "$get",
    {
      query: {
        page: "1",
        pageSize: "20",
      },
    },
  );

  // Fetch participating apps
  const { data: participatingApps = [] } = useHonoQuery(
    client.tester["my-apps"],
    "$get",
  );

  const recruitingApps = recruitingAppsData?.apps ?? [];

  return (
    <View className="flex-1">
      {/* Tabs */}
      <View className="flex-row px-5">
        <Pressable className="p-2" onPress={() => setActiveTab("recruiting")}>
          <View
            className={`border-b-2 ${
              activeTab === "recruiting"
                ? "border-gray-50"
                : "border-transparent"
            } pb-3`}
          >
            <Title3
              className={activeTab === "recruiting" ? "text-main" : "text-sub"}
            >
              모집중
            </Title3>
          </View>
        </Pressable>
        <Pressable
          className="p-2"
          onPress={() => setActiveTab("participating")}
        >
          <View
            className={`border-b-2 ${
              activeTab === "participating"
                ? "border-gray-50"
                : "border-transparent"
            } pb-3`}
          >
            <Title3
              className={
                activeTab === "participating" ? "text-main" : "text-sub"
              }
            >
              참여중
            </Title3>
          </View>
        </Pressable>
      </View>

      {/* App List */}
      <View className="px-7 pt-[5px] gap-2">
        {activeTab === "recruiting"
          ? recruitingApps.map((app) => (
              <Link key={app.id} href={`/tester/app/${app.id}`} asChild>
                <Pressable className="bg-white/[0.04] border border-white/[0.08] rounded-xl h-20 flex-row items-center px-3 gap-3">
                  <View className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50">
                    {app.icon && (
                      <Image
                        source={{ uri: app.icon }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                      />
                    )}
                  </View>
                  <View className="flex-col justify-between h-12 flex-1">
                    <View className="gap-0.5">
                      <Title4 numberOfLines={1} ellipsizeMode="tail">
                        {app.name}
                      </Title4>
                      <Desc2 className="text-main" numberOfLines={1}>
                        {app.shortDescription}
                      </Desc2>
                    </View>
                    <Desc3 className="text-sub" numberOfLines={1}>
                      획득 포인트 {app.earnedPoints}P · 테스터 정원{" "}
                      {app.testerCount}/{app.testerCapacity}
                    </Desc3>
                  </View>
                  <ButtonText className="text-primary text-[10px]">
                    참여하기
                  </ButtonText>
                </Pressable>
              </Link>
            ))
          : participatingApps.map((app) => (
              <Link
                key={app.applicationId}
                href={`/tester/app/${app.applicationId}`}
                asChild
              >
                <Pressable className="bg-white/[0.04] border border-white/[0.08] rounded-xl h-20 flex-row items-center px-3 gap-3">
                  <View className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50">
                    {app.icon && (
                      <Image
                        source={{ uri: app.icon }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                      />
                    )}
                  </View>
                  <View className="flex-col justify-between h-12 flex-1">
                    <View className="gap-0.5">
                      <Title4 numberOfLines={1} ellipsizeMode="tail">
                        {app.name}
                      </Title4>
                      <Desc2 className="text-main" numberOfLines={1}>
                        {app.shortDescription}
                      </Desc2>
                    </View>
                    <ButtonText className="text-sub text-[10px]">
                      {app.completedDays + 1}일차 진행중
                    </ButtonText>
                  </View>
                </Pressable>
              </Link>
            ))}
      </View>

      {/* Floating Toast */}
      {activeTab === "recruiting" && (
        <View
          className="absolute left-7 right-7"
          style={{ bottom: insets.bottom + 92 }}
        >
          <View className="bg-white/[0.04] border border-white/[0.08] rounded-[4px] p-3 flex-row items-center gap-1">
            <Info size={6} color={colors.gray["50"]} strokeWidth={2} />
            <Desc2 className="text-main">테스트하는 방법을 모르겠다면?</Desc2>
          </View>
        </View>
      )}
    </View>
  );
}
