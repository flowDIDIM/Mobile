import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DeveloperIndex() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" />
      <View
        className="h-11 justify-center items-center"
        style={{ marginTop: insets.top }}
      >
        <Text className="text-gray-50 text-title-3">앱</Text>
      </View>

      <View className="flex-1 justify-center items-center px-5">
        <View className="items-center gap-1 mb-14">
          <Text className="text-sub text-[16px] leading-[19.2px]">
            등록된 앱이 없습니다
          </Text>
          <Text className="text-sub text-[16px] leading-[19.2px]">
            지금 바로 앱을 등록해 보세요!
          </Text>
        </View>

        <TouchableOpacity
          className="bg-secondary rounded-lg px-[10px] py-2 flex-row items-center gap-1"
          activeOpacity={0.8}
        >
          <Text className="text-gray-50 text-[20px] leading-[20px]">+</Text>
          <Text className="text-gray-50 text-title-3">등록하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
