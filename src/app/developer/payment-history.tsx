import React from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Title3, Title4, Desc3, ButtonText } from "@/components/Typography";
import { useHonoQuery } from "@/lib/hono-rpc";
import { client } from "@/lib/api-client";

export default function PaymentHistory() {
  const insets = useSafeAreaInsets();

  const { data: payments = [], isLoading } = useHonoQuery(
    client.developer.payment.history,
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
        {/* Payment List */}
        <View className="px-7 gap-3">
          {isLoading ? (
            <View className="items-center py-8">
              <Title3 className="text-sub">로딩 중...</Title3>
            </View>
          ) : payments.length === 0 ? (
            <View className="items-center py-8">
              <Title3 className="text-sub">결제 내역이 없습니다</Title3>
            </View>
          ) : (
            payments.map((payment) => {
              const formattedDate = new Date(payment.createdAt)
                .toLocaleDateString("ko-KR")
                .replace(/\. /g, ".")
                .replace(/\.$/, "");

              return (
                <View
                  key={payment.id}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-xl h-20 flex-row items-center justify-between px-3"
                >
                  {/* Left side: App name and date */}
                  <View className="flex-col justify-between h-12">
                    <View className="flex-col gap-0.5">
                      <Title4>'{payment.name}' 등록</Title4>
                      <Desc3 className="text-sub">{formattedDate}</Desc3>
                    </View>
                  </View>

                  {/* Right side: Amount */}
                  <ButtonText className="text-sub text-[10px]">
                    {payment.price.toLocaleString()}원
                  </ButtonText>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
