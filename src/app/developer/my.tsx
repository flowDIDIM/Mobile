import { StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MyPage() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" />
      <View
        className="h-11 justify-center items-center"
        style={{ marginTop: insets.top }}
      >
        <Text className="text-gray-50 text-title-3">마이페이지</Text>
      </View>

      <View className="flex-1 justify-center items-center px-5">
        <Text className="text-gray-50 text-[16px] leading-[19.2px]">
          마이페이지 내용이 여기에 표시됩니다
        </Text>
      </View>
    </View>
  );
}
