import { authClient } from "@/lib/auth-client";
import { StatusBar, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Body3, Title3 } from "@/components/Typography";
import React, { useEffect } from "react";
import { type Href, router, useGlobalSearchParams } from "expo-router";
import {
  getAggregatedUsageStats,
  getUsageStats,
  hasUsageStatsPermission,
  requestUsageStatsPermission,
  UsageStatsIntervalType,
} from "expo-android-usagestats";

export default function Index() {
  useEffect(() => {
    (async () => {
      const hasPermission = await hasUsageStatsPermission();
      if (!hasPermission) {
        await requestUsageStatsPermission();
      } else {
        const now = Date.now();
        const yesterday = now - 24 * 60 * 60 * 1000;

        const usageStats = await getUsageStats(yesterday, now);
        console.log("Usage Stats:", usageStats);

        const aggregatedStats = await getAggregatedUsageStats(
          yesterday,
          now,
          UsageStatsIntervalType.INTERVAL_DAILY,
        );
        console.log("Aggregated Stats:", aggregatedStats);
      }
    })();
  }, []);

  const insets = useSafeAreaInsets();

  const { path } = useGlobalSearchParams<{
    path: string;
  }>();

  const { data: session, isPending } = authClient.useSession();

  const handleDeveloperLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `/?path=developer`,
        scopes: ["https://www.googleapis.com/auth/androidpublisher"],
      });
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleTesterLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/?path=tester",
      });
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  useEffect(() => {
    if (session && path) {
      if (router.canDismiss()) router.dismissAll();
      router.replace(`/${path}` as Href);
    }
  }, [session, path]);

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" />
      <View
        className="h-11 justify-center items-center"
        style={{ marginTop: insets.top }}
      >
        <Title3>DIDIM</Title3>
      </View>

      <View className="flex-1 justify-center items-center px-5 gap-4">
        <Body3 className="text-[18px] leading-[24px] mb-8">
          역할을 선택해주세요
        </Body3>

        <TouchableOpacity
          className="bg-secondary rounded-lg px-6 py-4 w-full max-w-xs"
          activeOpacity={0.8}
          onPress={handleDeveloperLogin}
          disabled={isPending}
        >
          <Title3 className="text-center">개발자 (Developer)</Title3>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-secondary rounded-lg px-6 py-4 w-full max-w-xs"
          activeOpacity={0.8}
          onPress={handleTesterLogin}
          disabled={isPending}
        >
          <Title3 className="text-center">테스터 (Tester)</Title3>
        </TouchableOpacity>
      </View>
    </View>
  );
}
