import React, { useCallback } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { BoxField } from "@/components/BoxField";
import { Button } from "@/components/Button";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { clientQuery } from "@/lib/api-client";

const packageSchema = z.object({
  packageName: z
    .string()
    .min(1, "패키지명을 입력해주세요")
    .regex(
      /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/,
      "올바른 Android 패키지명 형식이 아닙니다 (예: com.company.app)",
    ),
});

export default function CreatePackage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const { isPending, mutate } = useMutation(
    clientQuery.developer.validate.package.$post.mutationOptions({
      onSuccess: (data, input) => {
        // Navigate to next page with track data
        router.push({
          pathname: "/developer/create/track",
          params: {
            packageName: input.json.packageName,
            tracks: JSON.stringify(data.tracks),
          },
        });
      },
      onError: () => {
        bottomSheetRef.current?.expand();
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      packageName: "",
    },
    validators: {
      onChange: packageSchema,
    },
    onSubmit: async ({ value }) => {
      mutate({
        json: { packageName: value.packageName.trim() },
      });
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
                  editable={!isPending}
                  variant={
                    field.state.meta.errors.length > 0 ? "error" : "default"
                  }
                />
                {field.state.meta.errors[0] && (
                  <Text className="text-error text-desc-1 mt-1">
                    {field.state.meta.errors[0].message}
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
              disabled={!canSubmit || isPending}
              onPress={form.handleSubmit}
              className="bg-primary"
            >
              {isPending ? "확인 중..." : "다음"}
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
