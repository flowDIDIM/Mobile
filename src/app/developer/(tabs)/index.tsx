import {
  Body3,
  ButtonText,
  Desc3,
  Title3,
  Title4,
} from "@/components/Typography";
import { colors } from "@/design-system";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Plus } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { client } from "@/lib/api-client";
import { useHonoQuery } from "@/lib/hono-rpc";

export default function DeveloperIndex() {
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useHonoQuery(client.developer.app, "$get");

  const apps = data?.apps || [];
  const hasApps = apps.length > 0;

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 44,
          paddingBottom: insets.bottom + 80,
          flexGrow: hasApps ? undefined : 1,
        }}
      >
        {/* Top Navigation */}
        <View className="h-13 items-center justify-center relative">
          <Title3>{hasApps ? "등록한 앱" : "앱"}</Title3>
        </View>

        {/* Content */}
        {isLoading ? (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : hasApps ? (
          <View className="px-7 pt-4 gap-3">
            {apps.map((app) => (
              <Link key={app.id} href={`/developer/app/${app.id}`} asChild>
                <Pressable className="bg-white/[0.04] border border-white/[0.08] rounded-xl h-20 flex-row items-center justify-between px-3">
                  {/* Left side: Icon and App Info */}
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="size-14 rounded-lg overflow-hidden bg-gray-50">
                      <Image
                        source={{ uri: app.icon }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                      />
                    </View>
                    <View className="flex-col justify-center gap-0.5 h-12 flex-1">
                      <Title4 numberOfLines={1} ellipsizeMode="tail">
                        {app.name}
                      </Title4>
                      <Desc3 className="text-sub">테스터 수 2/20</Desc3>
                    </View>
                  </View>

                  {/* Right side: Status/Action Button */}
                  <View>
                    {app.paymentStatus === "PENDING" ||
                    app.paymentStatus === "COMPLETED" ? (
                      <ButtonText className="text-primary text-[10px]">
                        편집
                      </ButtonText>
                    ) : (
                      <ButtonText className="text-sub text-[10px]">
                        테스트 종료
                      </ButtonText>
                    )}
                  </View>
                </Pressable>
              </Link>
            ))}

            {/* Add App Button */}
            <Link href="/developer/create/package" asChild>
              <Pressable className="bg-primary rounded-lg py-3 flex-row items-center justify-center gap-2">
                <Plus size={20} color="#F1F3F3" strokeWidth={2.5} />
                <Title3>등록하기</Title3>
              </Pressable>
            </Link>
          </View>
        ) : (
          <View className="items-center justify-center flex-1 px-5">
            <View className="items-center gap-6">
              <View className="items-center gap-1">
                <Body3 className="text-sub text-center text-[16px]">
                  등록된 앱이 없습니다
                </Body3>
                <Body3 className="text-sub text-center text-[16px]">
                  지금 바로 앱을 등록해 보세요!
                </Body3>
              </View>

              <Link href="/developer/create/package" asChild>
                <Pressable className="bg-secondary px-2.5 py-2 rounded-lg flex-row items-center gap-1">
                  <Plus size={16.67} color="#F1F3F3" strokeWidth={2} />
                  <Title3>등록하기</Title3>
                </Pressable>
              </Link>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
