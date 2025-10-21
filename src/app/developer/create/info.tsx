import React, { useMemo } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { BoxField } from "@/components/BoxField";
import { Button } from "@/components/Button";
import { Title3, Desc1 } from "@/components/Typography";
import { client } from "@/lib/api-client";
import { useHonoMutation } from "@/lib/hono-rpc";

const PAYMENT_PRESETS = [10000, 30000, 50000];

const infoSchema = z.object({
  shortDescription: z.string().min(1, "한 줄 소개를 입력해주세요"),
  detailedDescription: z.string().min(1, "상세 설명을 입력해주세요"),
  paymentAmount: z
    .string()
    .min(1, "결제 금액을 입력해주세요")
    .refine((val) => parseInt(val) >= 10000, {
      message: "결제 금액은 최소 10,000원 이상이어야 합니다",
    }),
});

export default function CreateInfo() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    packageName: string;
    trackId: string;
    appInfo: string;
  }>();

  // Parse app info from params
  const appInfo = useMemo(() => {
    if (!params.appInfo) return null;
    return JSON.parse(params.appInfo) as {
      title: string;
      shortDescription: string;
      icon: string;
      storeImages: string[];
      detailedDescription: string;
    };
  }, [params.appInfo]);

  // Payment mutation
  const { mutate: createPayment } = useHonoMutation(
    client.developer.payment.create,
    "$post",
    {
      onSuccess: async (data) => {
        // Open payment URL in browser
        if ("paymentUrl" in data && data.paymentUrl) {
          await WebBrowser.openBrowserAsync(data.paymentUrl);
        }

        router.replace("/developer");
      },
      onError: (error) => {
        console.error("Payment creation failed:", error);
      },
    },
  );

  const form = useForm({
    defaultValues: {
      shortDescription: appInfo?.shortDescription || "",
      detailedDescription: appInfo?.detailedDescription || "",
      paymentAmount: "",
    },
    validators: {
      onChange: infoSchema,
    },
    onSubmit: async ({ value }) => {
      const amount = parseInt(value.paymentAmount, 10);

      createPayment({
        json: {
          application: {
            developerId: "",
            name: appInfo?.title || "",
            packageName: params.packageName,
            trackName: params.trackId,
            shortDescription: value.shortDescription,
            fullDescription: value.detailedDescription,
            icon: appInfo?.icon || "",
            images: appInfo?.storeImages || [],
          },
          amount,
        },
      });
    },
  });

  const setPaymentPreset = (amount: number) => {
    form.setFieldValue("paymentAmount", amount.toString());
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 14,
          paddingHorizontal: 28,
          paddingBottom: insets.bottom + 100,
        }}
      >
        {/* 1. 한 줄 소개 */}
        <View className="py-2 gap-3">
          <Title3>1. 한 줄 소개</Title3>
          <form.Field name="shortDescription">
            {(field) => (
              <>
                <BoxField
                  placeholder="서비스를 한 줄로 간략히 소개해 주세요"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  variant={
                    field.state.meta.errors.length > 0 ? "error" : "default"
                  }
                />
                {field.state.meta.errors[0] && (
                  <Desc1 className="text-error mt-1">
                    {field.state.meta.errors[0].message}
                  </Desc1>
                )}
              </>
            )}
          </form.Field>
        </View>

        {/* 2. 이미지 */}
        <View className="py-2 gap-3 mt-6">
          <Title3>2. 이미지</Title3>
          <View className="gap-3">
            {/* 아이콘 */}
            {appInfo?.icon && (
              <View>
                <Desc1 className="mb-2">아이콘</Desc1>
                <View className="rounded-xl size-20 overflow-hidden bg-white/[0.04] border border-white/[0.08]">
                  <Image
                    source={{ uri: appInfo.icon }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                    transition={200}
                    placeholder="blur"
                  />
                </View>
              </View>
            )}

            {/* 상점 이미지 */}
            {appInfo?.storeImages && appInfo.storeImages.length > 0 && (
              <View>
                <Desc1 className="mb-2">상점 이미지</Desc1>
                <View className="flex-row gap-3 flex-wrap">
                  {appInfo.storeImages.map((imageUri, index) => (
                    <View
                      key={index}
                      className="rounded-xl size-20 overflow-hidden bg-white/[0.04] border border-white/[0.08]"
                    >
                      <Image
                        source={imageUri}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                        contentPosition={"top"}
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* 3. 상세 설명 */}
        <View className="py-2 gap-3 mt-6">
          <Title3>3. 상세 설명</Title3>
          <form.Field name="detailedDescription">
            {(field) => (
              <>
                <View
                  className={`rounded h-60 px-3 py-3 relative ${
                    field.state.meta.errors.length > 0
                      ? "bg-error/10 border-2 border-error"
                      : "bg-white/[0.04] border border-white/[0.08]"
                  }`}
                >
                  <TextInput
                    className="text-desc-1 text-main flex-1"
                    placeholder="테스터들에게 서비스를 자세히 설명해 주세요"
                    placeholderTextColor="#919DA1"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    multiline
                    maxLength={1000}
                    textAlignVertical="top"
                  />
                  <Text className="text-gray-500 text-[8px] absolute bottom-3 right-3">
                    {field.state.value.length} / 1,000
                  </Text>
                </View>
                {field.state.meta.errors[0] && (
                  <Desc1 className="text-error mt-1">
                    {field.state.meta.errors[0].message}
                  </Desc1>
                )}
              </>
            )}
          </form.Field>
        </View>

        {/* 4. 결제금액 입력 */}
        <View className="py-2 gap-3 mt-6">
          <Title3>4. 결제금액 입력</Title3>

          {/* Preset buttons */}
          <View className="flex-row gap-2">
            {PAYMENT_PRESETS.map((preset) => (
              <Pressable
                key={preset}
                onPress={() => setPaymentPreset(preset)}
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded h-9 items-center justify-center"
              >
                <Desc1>{(preset / 10000).toFixed(0)}만원</Desc1>
              </Pressable>
            ))}
          </View>

          <form.Field name="paymentAmount">
            {(field) => (
              <>
                <View
                  className={`rounded h-11 px-3 flex-row items-center ${
                    field.state.meta.errors.length > 0
                      ? "bg-error/10 border-2 border-error"
                      : "bg-white/[0.04] border border-white/[0.08]"
                  }`}
                >
                  <TextInput
                    className="text-desc-1 text-main flex-1"
                    placeholder="0"
                    placeholderTextColor="#919DA1"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    keyboardType="numeric"
                  />
                  <Desc1>원</Desc1>
                </View>
                {field.state.meta.errors[0] && (
                  <Desc1 className="text-error mt-1">
                    {field.state.meta.errors[0].message}
                  </Desc1>
                )}
              </>
            )}
          </form.Field>
          <View className="gap-0.5">
            <Text className="text-gray-500 text-[8px]">
              최소 등록 금액 1만원입니다.
            </Text>
            <Text className="text-gray-500 text-[8px]">
              금액이 추가될 때마다 테스터에게 더 많은 보상이 돌아가며 더 빠르게
              테스터를 모집할 수 있습니다.
            </Text>
          </View>
        </View>

        {/* 5. 결제정보 */}
        <View className="py-2 gap-3 mt-6">
          <Title3>5. 결제정보</Title3>
          <form.Subscribe
            selector={(state) => ({
              paymentAmount: state.values.paymentAmount,
            })}
          >
            {({ paymentAmount }) => {
              const amount = parseInt(paymentAmount || "0", 10);

              return (
                <View className="bg-white/[0.04] border border-white/[0.08] rounded h-11 px-3 flex-row items-center justify-between">
                  <Desc1>최종 결제 금액</Desc1>
                  <Desc1 className="font-semibold">
                    {amount.toLocaleString()}원
                  </Desc1>
                </View>
              );
            }}
          </form.Subscribe>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-5 bg-transparent"
        style={{
          paddingBottom: insets.bottom + 20,
        }}
      >
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ canSubmit, isSubmitting }) => (
            <Button
              variant="standard"
              disabled={!canSubmit || isSubmitting}
              onPress={form.handleSubmit}
              className="bg-primary"
            >
              결제하기
            </Button>
          )}
        </form.Subscribe>
      </View>
    </View>
  );
}
