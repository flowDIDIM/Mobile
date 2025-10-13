import React, { useCallback, useMemo } from "react";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Dropdown, type DropdownOption } from "@/components/Dropdown";
import { Button } from "@/components/Button";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { clientQuery } from "@/lib/api-client";
import { colors } from "@/design-system";

export default function CreateTrack() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  // Parse tracks from params
  const tracks: DropdownOption[] = useMemo(
    () =>
      params.tracks
        ? JSON.parse(params.tracks as string).map((track: any) => ({
            label: track.name,
            value: track.id,
          }))
        : [],
    [params.tracks],
  );

  const { isPending, mutate: validateTrackMutation } = useMutation(
    clientQuery.developer.validate.track.$post.mutationOptions({
      onSuccess: (data, input) => {
        if (!data.isValid) {
          // Show error bottom sheet
          bottomSheetRef.current?.expand();
          return;
        }

        // Navigate to info page with package and track info
        router.push({
          pathname: "/developer/create/info",
          params: {
            packageName: input.json.packageName,
            trackId: input.json.trackId,
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
      trackId: "",
    },
    onSubmit: async ({ value }) => {
      if (!value.trackId) return;

      validateTrackMutation({
        json: {
          packageName: params.packageName as string,
          trackId: value.trackId,
        },
      });
    },
  });

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close();
    // TODO: Navigate to track creation page
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
          <Text className="text-main text-title-3">트랙을 선택해 주세요.</Text>
          <form.Field name="trackId">
            {(field) => (
              <Dropdown
                options={tracks}
                value={field.state.value}
                onValueChange={field.handleChange}
                placeholder="ex)com.didim.~"
                disabled={isPending}
              />
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

      {/* Error Bottom Sheet - No Groups */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["50%"]}
        enablePanDownToClose
        enableDynamicSizing={false}
        backgroundStyle={{ backgroundColor: colors.gray["800"] }}
        handleIndicatorStyle={{ backgroundColor: "#C8CFD0" }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="flex-1 px-5 py-12 pb-8">
          <Text className="text-main text-title-2 text-center">
            그룹스 이메일의 추가되어 있지 않습니다
          </Text>
          <View className="items-center justify-center">
            <Text className="text-error text-[128px]">?</Text>
          </View>
          <View className={"flex-grow"} />
          <Button
            variant="standard"
            onPress={handleCloseBottomSheet}
            className="w-full bg-primary"
          >
            이메일 추가하러 가기
          </Button>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
