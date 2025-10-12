import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { BoxField } from "@/components/BoxField";
import { Button } from "@/components/Button";
import { Upload, Plus } from "lucide-react-native";
import { client } from "@/lib/api-client";

const PAYMENT_PRESETS = [10000, 30000, 50000];

export default function CreateInfo() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    packageName: string;
    trackId: string;
  }>();

  // Fetch app info from server
  const { data: appInfo, isLoading } = useQuery({
    queryKey: ["appInfo", params.packageName, params.trackId],
    queryFn: async () => {
      const response = await client.developer.validate.app.$post({
        json: {
          packageName: params.packageName,
          trackId: params.trackId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch app info");
      }

      return response.json();
    },
    enabled: !!params.packageName && !!params.trackId,
  });

  const form = useForm({
    defaultValues: {
      shortDescription: "",
      storeImages: [] as string[],
      icon: "",
      detailedDescription: "",
      paymentAmount: "",
    },
    validators: {
      onChange: ({ value }) => {
        const fieldErrors: Record<string, string> = {};

        // 1. 한 줄 소개 검증
        if (!value.shortDescription.trim()) {
          fieldErrors.shortDescription = "한 줄 소개를 입력해주세요";
        }

        // 2. 아이콘 검증
        if (!value.icon) {
          fieldErrors.icon = "아이콘을 선택해주세요";
        }

        // 3. 상점 이미지 검증
        if (!value.storeImages[0]) {
          fieldErrors.storeImages = "상점 이미지를 최소 1개 이상 선택해주세요";
        }

        // 4. 상세 설명 검증
        if (!value.detailedDescription.trim()) {
          fieldErrors.detailedDescription = "상세 설명을 입력해주세요";
        }

        // 5. 결제 금액 검증
        const amount = parseInt(value.paymentAmount || "0");
        if (!value.paymentAmount || amount < 10000) {
          fieldErrors.paymentAmount =
            "결제 금액은 최소 10,000원 이상이어야 합니다";
        }

        // Return errors if any exist
        if (Object.keys(fieldErrors).length > 0) {
          return {
            form: "모든 필수 항목을 입력해주세요",
            fields: fieldErrors,
          };
        }

        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      // TODO: Submit form data to API
      console.log("Form submitted:", value);

      // Navigate to payment page
      router.push("/developer/create/payment");
    },
  });

  // Update form values when appInfo is loaded
  useEffect(() => {
    if (appInfo) {
      form.setFieldValue("shortDescription", appInfo.shortDescription);
      form.setFieldValue("storeImages", appInfo.storeImages || []);
      form.setFieldValue("icon", appInfo.icon || "");
      form.setFieldValue("detailedDescription", appInfo.detailedDescription);
    }
  }, [appInfo]);

  const pickStoreImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      form.setFieldValue("storeImages", (prev) => {
        const newImages = [...prev];
        newImages[index] = result.assets[0].uri;
        return newImages;
      });
    }
  };

  const pickIcon = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      form.setFieldValue("icon", result.assets[0].uri);
    }
  };

  const setPaymentPreset = (amount: number) => {
    form.setFieldValue("paymentAmount", amount.toString());
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-main text-title-3">로딩 중...</Text>
      </View>
    );
  }

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
          <Text className="text-main text-title-3">1. 한 줄 소개</Text>
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
                {field.state.meta.errors.length > 0 && (
                  <Text className="text-error text-desc-1 mt-1">
                    {field.state.meta.errors[0]}
                  </Text>
                )}
              </>
            )}
          </form.Field>
        </View>

        {/* 2. 이미지 */}
        <View className="py-2 gap-3 mt-6">
          <Text className="text-main text-title-3">2. 이미지</Text>
          <View className="gap-3">
            {/* 아이콘 */}
            <View>
              <Text className="text-sub text-desc-1 mb-2">아이콘</Text>
              <form.Field name="icon">
                {(field) => (
                  <>
                    <Pressable
                      onPress={pickIcon}
                      className={`rounded-xl size-20 items-center justify-center ${
                        field.state.meta.errors.length > 0
                          ? "bg-error/10 border-2 border-error"
                          : "bg-white/[0.04] border border-white/[0.08]"
                      }`}
                    >
                      {field.state.value ? (
                        <View className="size-20 rounded-xl overflow-hidden">
                          {/* TODO: Display image */}
                          <Text className="text-xs text-main">아이콘</Text>
                        </View>
                      ) : (
                        <Upload size={24} color="#919DA1" />
                      )}
                    </Pressable>
                    {field.state.meta.errors.length > 0 && (
                      <Text className="text-error text-desc-1 mt-1">
                        {field.state.meta.errors[0]}
                      </Text>
                    )}
                  </>
                )}
              </form.Field>
            </View>

            {/* 상점 이미지 */}
            <View>
              <Text className="text-sub text-desc-1 mb-2">상점 이미지</Text>
              <form.Field name="storeImages">
                {(field) => (
                  <>
                    <View className="flex-row gap-3">
                      <Pressable
                        onPress={() => pickStoreImage(0)}
                        className={`rounded-xl size-20 items-center justify-center ${
                          field.state.meta.errors.length > 0 &&
                          !field.state.value[0]
                            ? "bg-error/10 border-2 border-error"
                            : "bg-white/[0.04] border border-white/[0.08]"
                        }`}
                      >
                        {field.state.value[0] ? (
                          <View className="size-20 rounded-xl overflow-hidden">
                            {/* TODO: Display image */}
                            <Text className="text-xs text-main">이미지 1</Text>
                          </View>
                        ) : (
                          <Upload size={24} color="#919DA1" />
                        )}
                      </Pressable>

                      <Pressable
                        onPress={() => pickStoreImage(1)}
                        className="bg-white/[0.04] border border-white/[0.08] rounded-xl size-20 items-center justify-center"
                      >
                        {field.state.value[1] ? (
                          <View className="size-20 rounded-xl overflow-hidden">
                            {/* TODO: Display image */}
                            <Text className="text-xs text-main">이미지 2</Text>
                          </View>
                        ) : (
                          <Plus size={24} color="#919DA1" />
                        )}
                      </Pressable>
                    </View>
                    {field.state.meta.errors.length > 0 && (
                      <Text className="text-error text-desc-1 mt-1">
                        {field.state.meta.errors[0]}
                      </Text>
                    )}
                  </>
                )}
              </form.Field>
            </View>
          </View>
        </View>

        {/* 3. 상세 설명 */}
        <View className="py-2 gap-3 mt-6">
          <Text className="text-main text-title-3">3. 상세 설명</Text>
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
                    className="text-desc-1 text-sub flex-1"
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
                {field.state.meta.errors.length > 0 && (
                  <Text className="text-error text-desc-1 mt-1">
                    {field.state.meta.errors[0]}
                  </Text>
                )}
              </>
            )}
          </form.Field>
        </View>

        {/* 4. 결제금액 입력 */}
        <View className="py-2 gap-3 mt-6">
          <Text className="text-main text-title-3">4. 결제금액 입력</Text>

          {/* Preset buttons */}
          <View className="flex-row gap-2">
            {PAYMENT_PRESETS.map((preset) => (
              <Pressable
                key={preset}
                onPress={() => setPaymentPreset(preset)}
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded h-9 items-center justify-center"
              >
                <Text className="text-desc-1 text-main">
                  {(preset / 10000).toFixed(0)}만원
                </Text>
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
                  <Text className="text-desc-1 text-main">원</Text>
                </View>
                {field.state.meta.errors.length > 0 && (
                  <Text className="text-error text-desc-1 mt-1">
                    {field.state.meta.errors[0]}
                  </Text>
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
          <Text className="text-main text-title-3">5. 결제정보</Text>
          <form.Subscribe
            selector={(state) => ({
              paymentAmount: state.values.paymentAmount,
            })}
          >
            {({ paymentAmount }) => {
              const amount = parseInt(paymentAmount || "0", 10);
              const finalAmount = amount + 2000;

              return (
                <View className="bg-white/[0.04] border border-white/[0.08] rounded h-11 px-3 flex-row items-center justify-between">
                  <Text className="text-desc-1 text-sub">최종 결제 금액</Text>
                  <Text className="text-desc-1 text-main font-semibold">
                    {finalAmount.toLocaleString()}원
                  </Text>
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
