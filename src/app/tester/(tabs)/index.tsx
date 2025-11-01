import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Coins } from "lucide-react-native";
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
import { useHonoQuery } from "@/lib/hono-rpc";
import { client } from "@/lib/api-client";

export default function TesterHome() {
  // Fetch user info (including points)
  const { data: userInfo } = useHonoQuery(client.tester.me, "$get");

  // Fetch incomplete tests
  const { data: incompleteTests = [] } = useHonoQuery(
    client.tester["incomplete-tests"],
    "$get",
  );

  // Fetch newest apps
  const { data: newestApps = [] } = useHonoQuery(
    client.tester.apps.newest,
    "$get",
  );

  // Fetch almost full apps
  const { data: almostFullApps = [] } = useHonoQuery(
    client.tester.apps["almost-full"],
    "$get",
  );

  return (
    <View className="flex-1">
      <View className="px-5 pt-3">
        <View className="py-2 gap-3">
          <Title3>나의 포인트</Title3>
        </View>
        <View className="flex-row items-center gap-1 px-2 py-1">
          <Coins size={24} color={colors.primary} fill={colors.primary} />
          <Headline1 className="text-main">{userInfo?.points ?? 0}</Headline1>
          <Headline1 className="text-main">P</Headline1>
        </View>
      </View>

      {/* Incomplete Tests */}
      <View className="px-5 pt-3">
        <View className="py-2">
          <Title3>오늘 미완료 테스트</Title3>
        </View>
        {incompleteTests.length > 0 ? (
          <View className="bg-white/[0.04] border border-white/[0.08] rounded-[20px] px-2 py-5 gap-3 items-center">
            <View className="w-full px-2 gap-6">
              {/* First Row - 5 items */}
              <View className="flex-row gap-3 w-full">
                {incompleteTests.slice(0, 5).map((app) => (
                  <Link
                    key={app.applicationId}
                    href={`/tester/app/${app.applicationId}`}
                    asChild
                  >
                    <Pressable className="flex-1 gap-1.5 items-center">
                      <View className="bg-gray-50 h-[53.8px] rounded-lg w-full overflow-hidden">
                        {app.icon && (
                          <Image
                            source={{ uri: app.icon }}
                            style={{ width: "100%", height: "100%" }}
                            contentFit="cover"
                          />
                        )}
                      </View>
                      <ButtonText
                        numberOfLines={1}
                        className="text-center w-full text-main"
                      >
                        {app.name}
                      </ButtonText>
                      <View className="bg-gray-50 rounded-full px-0 py-0.5 w-[38px] items-center justify-center">
                        <ButtonText className="text-gray-950 text-center">
                          {app.earnedPoints}p
                        </ButtonText>
                      </View>
                    </Pressable>
                  </Link>
                ))}
              </View>
              {/* Second Row - 5 items (if there are more than 5) */}
              {incompleteTests.length > 5 && (
                <View className="flex-row gap-3 w-full">
                  {incompleteTests.slice(5, 10).map((app) => (
                    <Link
                      key={app.applicationId}
                      href={`/tester/app/${app.applicationId}`}
                      asChild
                    >
                      <Pressable className="flex-1 gap-1.5 items-center">
                        <View className="bg-gray-50 h-[53.8px] rounded-lg w-full overflow-hidden">
                          {app.icon && (
                            <Image
                              source={{ uri: app.icon }}
                              style={{ width: "100%", height: "100%" }}
                              contentFit="cover"
                            />
                          )}
                        </View>
                        <ButtonText
                          numberOfLines={1}
                          className="text-center w-full text-main"
                        >
                          {app.name}
                        </ButtonText>
                        <View className="bg-gray-50 rounded-full px-0 py-0.5 w-[38px] items-center justify-center">
                          <ButtonText className="text-gray-950 text-center">
                            {app.earnedPoints}p
                          </ButtonText>
                        </View>
                      </Pressable>
                    </Link>
                  ))}
                </View>
              )}
            </View>
          </View>
        ) : (
          <View className="bg-white/[0.04] border border-white/[0.08] rounded-[20px] px-4 py-8 items-center">
            <Desc2 className="text-sub">미완료 테스트가 없습니다</Desc2>
          </View>
        )}
      </View>

      {/* Recent Apps */}
      <View className="px-5 pt-3">
        <View className="py-2">
          <Title3>최근 추가된 앱</Title3>
        </View>
        <View className="gap-2">
          {newestApps.map((app) => (
            <Link key={app.id} href={`/tester/app/${app.id}`} asChild>
              <Pressable className="bg-white/[0.04] border border-white/[0.08] rounded-xl h-20 flex-row items-center justify-between px-3">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="size-14 rounded-lg bg-gray-50 overflow-hidden">
                    {app.icon && (
                      <Image
                        source={{ uri: app.icon }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                      />
                    )}
                  </View>
                  <View className="flex-col h-12 justify-between flex-1">
                    <View className="flex-col gap-0.5">
                      <Title4 className="text-main">{app.name}</Title4>
                      <Desc2 className="text-main">
                        {app.shortDescription}
                      </Desc2>
                    </View>
                    <Desc3 className="text-sub">
                      획득 포인트 {app.earnedPoints}P · 테스터 정원{" "}
                      {app.testerCount}/{app.testerCapacity}
                    </Desc3>
                  </View>
                </View>
                <ButtonText className="text-primary">참여하기</ButtonText>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>

      {/* Deadline Apps */}
      <View className="px-5 pt-3">
        <View className="py-2">
          <Title3>곧 마감되는 앱</Title3>
        </View>
        <View className="gap-2">
          {almostFullApps.map((app) => (
            <Link key={app.id} href={`/tester/app/${app.id}`} asChild>
              <Pressable className="bg-white/[0.04] border border-white/[0.08] rounded-xl h-20 flex-row items-center justify-between px-3">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="size-14 rounded-lg bg-gray-50 overflow-hidden">
                    {app.icon && (
                      <Image
                        source={{ uri: app.icon }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                      />
                    )}
                  </View>
                  <View className="flex-col h-12 justify-between flex-1">
                    <View className="flex-col gap-0.5">
                      <Title4 className="text-main">{app.name}</Title4>
                      <Desc2 className="text-main">
                        {app.shortDescription}
                      </Desc2>
                    </View>
                    <Desc3 className="text-sub">
                      획득 포인트 {app.earnedPoints}P · 테스터 정원{" "}
                      {app.testerCount}/{app.testerCapacity}
                    </Desc3>
                  </View>
                </View>
                <ButtonText className="text-primary">참여하기</ButtonText>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </View>
  );
}
