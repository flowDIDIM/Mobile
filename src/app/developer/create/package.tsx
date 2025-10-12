import React, { useCallback } from "react";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { BoxField } from "@/components/BoxField";
import { Button } from "@/components/Button";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { client } from "@/lib/api-client";

export default function CreatePackage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const validatePackageMutation = useMutation({
    mutationFn: async (packageName: string) => {
      const response = await client.developer.validate.package.$post({
        json: { packageName },
      });

      if (!response.ok) {
        throw new Error("Package validation failed");
      }

      return response.json();
    },
    onSuccess: (data, packageName) => {
      // Navigate to next page with track data
      router.push({
        pathname: "/developer/create/track",
        params: {
          packageName,
          tracks: JSON.stringify(data.tracks),
        },
      });
    },
    onError: () => {
      bottomSheetRef.current?.expand();
    },
  });

  const form = useForm({
    defaultValues: {
      packageName: "",
    },
    validators: {
      onChange: ({ value }) => {
        // Android package name validation
        const trimmedValue = value.packageName.trim();

        if (!trimmedValue) {
          return {
            form: "패키지명을 입력해주세요",
            fields: {
              packageName: "패키지명을 입력해주세요",
            },
          };
        }

        const packageRegex = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;
        if (!packageRegex.test(trimmedValue)) {
          return {
            form: "올바른 Android 패키지명 형식이 아닙니다",
            fields: {
              packageName:
                "올바른 Android 패키지명 형식이 아닙니다 (예: com.company.app)",
            },
          };
        }

        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      validatePackageMutation.mutate(value.packageName.trim());
    },
  });

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <GestureHandlerRootView className="flex-1">
      {/* Content */}
      <View className="flex-1 px-7 pt-14">
        <View className="py-2 gap-3">
          <Text className="text-main text-title-3">
            패키지 명을 입력해 주세요.
          </Text>
          <form.Field name="packageName">
            {(field) => (
              <>
                <BoxField
                  placeholder="ex)com.didim.~"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  editable={!validatePackageMutation.isPending}
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
      </View>

      {/* Bottom Button */}
      <View
        className="px-5"
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
              disabled={!canSubmit || validatePackageMutation.isPending}
              onPress={form.handleSubmit}
              className="bg-primary"
            >
              {validatePackageMutation.isPending ? "확인 중..." : "다음"}
            </Button>
          )}
        </form.Subscribe>
      </View>

      {/* Error Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={[400]}
        enablePanDownToClose
        enableDynamicSizing={false}
        backgroundStyle={{ backgroundColor: "#2C3339" }}
        handleIndicatorStyle={{ backgroundColor: "#919DA1" }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="flex-1 items-center justify-between px-5 py-5">
          <View className="flex-1 items-center justify-center gap-6">
            <Text className="text-main text-title-2 text-center">
              트랙이 존재하지 않습니다
            </Text>
            <View className="w-24 h-24 items-center justify-center">
              <Text className="text-error text-[64px]">?</Text>
            </View>
          </View>
          <Button
            variant="standard"
            onPress={handleCloseBottomSheet}
            className="w-full bg-primary"
          >
            트랙 만들러 가기
          </Button>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
