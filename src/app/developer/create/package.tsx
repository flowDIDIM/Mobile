import React, { useState, useCallback } from "react";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
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
  const [packageName, setPackageName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const handleValidatePackage = async () => {
    if (!packageName.trim()) return;

    setIsLoading(true);
    try {
      const response = await client.developer.validate.package.$post({
        json: { packageName: packageName.trim() },
      });

      if (!response.ok) {
        // Show error bottom sheet
        bottomSheetRef.current?.expand();
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      // Navigate to next page with track data
      router.push({
        pathname: "/developer/create/track",
        params: {
          packageName: packageName.trim(),
          tracks: JSON.stringify(data.tracks),
        },
      });
    } catch (error) {
      console.error("Validation error:", error);
      bottomSheetRef.current?.expand();
    } finally {
      setIsLoading(false);
    }
  };

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
      <View className="flex-1 px-7">
        <View className="py-2 gap-3">
          <Text className="text-main text-title-3">
            패키지 명을 입력해 주세요.
          </Text>
          <BoxField
            placeholder="ex)com.didim.~"
            value={packageName}
            onChangeText={setPackageName}
            editable={!isLoading}
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
          disabled={!packageName.trim() || isLoading}
          onPress={handleValidatePackage}
          className="bg-primary"
        >
          {isLoading ? "확인 중..." : "다음"}
        </Button>
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
