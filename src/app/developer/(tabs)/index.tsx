import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Plus } from "lucide-react-native";
import { Card } from "@/components/Card";

// Mock data - 나중에 실제 데이터로 교체
const MOCK_APPS: {
  id: string;
  name: string;
  testers: number;
  maxTesters: number;
}[] = [];

export default function DeveloperIndex() {
  const insets = useSafeAreaInsets();
  const [apps] = useState(MOCK_APPS);
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
          <Text className="text-main text-title-3">
            {hasApps ? "등록한 앱" : "앱"}
          </Text>
          {hasApps && (
            <Link href="/developer/create/package" asChild>
              <Pressable className="absolute right-5">
                <Plus size={24} color="#F1F3F3" strokeWidth={2} />
              </Pressable>
            </Link>
          )}
        </View>

        {/* Content */}
        {hasApps ? (
          <View className="px-7 pt-4 gap-3">
            {apps.map((app, index) => (
              <Card
                key={app.id}
                variant={index === 0 ? "standard" : "disabled"}
                appName={app.name}
                currentTesters={app.testers}
                maxTesters={app.maxTesters}
                actionText={index === 0 ? "편집" : "테스트 종료"}
                onActionPress={() => console.log("Edit app", app.id)}
              />
            ))}
          </View>
        ) : (
          <View className="items-center justify-center flex-1 px-5">
            <View className="items-center gap-6">
              <View className="items-center gap-1">
                <Text className="text-sub text-body-3 text-center text-[16px]">
                  등록된 앱이 없습니다
                </Text>
                <Text className="text-sub text-body-3 text-center text-[16px]">
                  지금 바로 앱을 등록해 보세요!
                </Text>
              </View>

              <Link href="/developer/create/package" asChild>
                <Pressable className="bg-secondary px-2.5 py-2 rounded-lg flex-row items-center gap-1">
                  <Plus size={16.67} color="#F1F3F3" strokeWidth={2} />
                  <Text className="text-main text-title-3">등록하기</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
