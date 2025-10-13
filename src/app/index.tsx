import { authClient } from "@/lib/auth-client";
import { StatusBar, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Title3, Body3 } from "@/components/Typography";
import React from "react";

export default function Index() {
  const insets = useSafeAreaInsets();

  const handleDeveloperLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/developer",
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
        callbackURL: "/tester",
      });
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

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
        >
          <Title3 className="text-center">개발자 (Developer)</Title3>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-secondary rounded-lg px-6 py-4 w-full max-w-xs"
          activeOpacity={0.8}
          onPress={handleTesterLogin}
        >
          <Title3 className="text-center">테스터 (Tester)</Title3>
        </TouchableOpacity>
      </View>
    </View>
  );
}
