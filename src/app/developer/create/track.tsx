import React, { useState, useCallback } from "react";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Dropdown, type DropdownOption } from "@/components/Dropdown";
import { Button } from "@/components/Button";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { client } from "@/lib/api-client";
import { colors } from "@/design-system";

export default function CreateTrack() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedTrack, setSelectedTrack] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  // Parse tracks from params
  const tracks: DropdownOption[] = params.tracks
    ? JSON.parse(params.tracks as string).map((track: any) => ({
        label: track.name,
        value: track.id,
      }))
    : [];

  const handleValidateTrack = async () => {
    if (!selectedTrack) return;

    setIsLoading(true);
    try {
      const response = await client.developer.validate.track.$post({
        json: {
          packageName: params.packageName as string,
          trackId: selectedTrack,
        },
      });

      if (!response.ok) {
        // Show error bottom sheet for missing groups
        bottomSheetRef.current?.expand();
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      if (!data.hasGroups) {
        // Show error bottom sheet
        bottomSheetRef.current?.expand();
        setIsLoading(false);
        return;
      }

      // Navigate to info page
      router.push("/developer/create/info");
    } catch (error) {
      console.error("Track validation error:", error);
      bottomSheetRef.current?.expand();
    } finally {
      setIsLoading(false);
    }
  };

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
          <Dropdown
            options={tracks}
            value={selectedTrack}
            onValueChange={setSelectedTrack}
            placeholder="ex)com.didim.~"
            disabled={isLoading}
          />
        </View>
      </View>

      {/* Bottom Button */}
      <View
        className="px-5"
        style={{
          paddingBottom: insets.bottom + 20,
        }}
      >
        <Button
          variant="standard"
          disabled={!selectedTrack || isLoading}
          onPress={handleValidateTrack}
          className="bg-primary"
        >
          {isLoading ? "확인 중..." : "다음"}
        </Button>
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
