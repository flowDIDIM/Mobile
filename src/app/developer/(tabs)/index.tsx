import React from "react";
import { View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Plus, CheckCircle2, Clock, XCircle } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Card } from "@/components/Card";
import { Title3, Body3, Desc1 } from "@/components/Typography";
import { clientQuery } from "@/lib/api-client";
import { colors } from "@/design-system";

export default function DeveloperIndex() {
  const insets = useSafeAreaInsets();

  // Fetch app list from backend
  const { data, isLoading } = useQuery(
    clientQuery.developer.app.$get.queryOptions({}),
  );

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
          {hasApps && (
            <Link href="/developer/create/package" asChild>
              <Pressable className="absolute right-5">
                <Plus size={24} color="#F1F3F3" strokeWidth={2} />
              </Pressable>
            </Link>
          )}
        </View>

        {/* Content */}
        {isLoading ? (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : hasApps ? (
          <View className="px-7 pt-4 gap-3">
            {apps.map((app) => (
              <View
                key={app.id}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4"
              >
                {/* App Header with Icon */}
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="size-12 rounded-lg overflow-hidden bg-white/[0.04] border border-white/[0.08]">
                    <Image
                      source={{ uri: app.icon }}
                      style={{ width: 48, height: 48 }}
                      contentFit="cover"
                      transition={200}
                    />
                  </View>
                  <View className="flex-1">
                    <Title3>{app.name}</Title3>
                    <Desc1 className="text-sub">{app.shortDescription}</Desc1>
                  </View>
                </View>

                {/* Payment Status */}
                <View className="flex-row items-center gap-2">
                  {app.paymentStatus === "COMPLETED" ? (
                    <>
                      <CheckCircle2
                        size={16}
                        color={colors.primary}
                        strokeWidth={2}
                      />
                      <Desc1 className="text-primary">결제 완료</Desc1>
                    </>
                  ) : app.paymentStatus === "PENDING" ? (
                    <>
                      <Clock
                        size={16}
                        color={colors.gray["500"]}
                        strokeWidth={2}
                      />
                      <Desc1 className="text-gray-500">결제 대기 중</Desc1>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} color={colors.error} strokeWidth={2} />
                      <Desc1 className="text-error">결제 취소됨</Desc1>
                    </>
                  )}
                </View>
              </View>
            ))}
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
