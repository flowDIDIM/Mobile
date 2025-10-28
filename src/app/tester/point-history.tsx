import React from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus, Minus } from "lucide-react-native";
import { Title4, Desc3, ButtonText } from "@/components/Typography";
import { colors } from "@/design-system";
import { useHonoQuery } from "@/lib/hono-rpc";
import { client } from "@/lib/api-client";

export default function PointHistory() {
  const insets = useSafeAreaInsets();

  // Fetch point history
  const { data: pointHistory = [] } = useHonoQuery(
    client.tester["point-history"],
    "$get",
  );

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 40,
        }}
      >
        {/* Point History List */}
        <View className="px-7 gap-3">
          {pointHistory.map((item) => {
            const isEarned = item.amount > 0;
            const formattedDate = new Date(item.createdAt)
              .toLocaleDateString("ko-KR")
              .replace(/\. /g, ".")
              .replace(/\.$/, "");

            return (
              <View
                key={item.id}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl h-20 flex-row items-center justify-between px-3"
              >
                {/* Left side: Icon and info */}
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="size-8 rounded-full bg-white/[0.08] items-center justify-center">
                    {isEarned ? (
                      <Plus size={16} color={colors.primary} strokeWidth={2} />
                    ) : (
                      <Minus size={16} color={colors.error} strokeWidth={2} />
                    )}
                  </View>
                  <View className="flex-col justify-between h-12">
                    <View className="flex-col gap-0.5">
                      <Title4>
                        {item.applicationName
                          ? `'${item.applicationName}' ${item.reason}`
                          : item.reason}
                      </Title4>
                      <Desc3 className="text-sub">{formattedDate}</Desc3>
                    </View>
                  </View>
                </View>

                {/* Right side: Points */}
                <ButtonText
                  className={`text-[10px] ${
                    isEarned ? "text-primary" : "text-error"
                  }`}
                >
                  {isEarned ? "+" : ""}
                  {item.amount}P
                </ButtonText>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
