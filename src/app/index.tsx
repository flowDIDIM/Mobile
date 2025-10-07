import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" />
      <View
        className="h-11 justify-center items-center"
        style={{ marginTop: insets.top }}
      >
        <Text className="text-gray-50 text-title-3">DIDIM</Text>
      </View>

      <View className="flex-1 justify-center items-center px-5 gap-4">
        <Text className="text-gray-50 text-[20px] leading-[24px] mb-8">
          역할을 선택해주세요
        </Text>

        <TouchableOpacity
          className="bg-secondary rounded-lg px-6 py-4 w-full max-w-xs"
          activeOpacity={0.8}
          onPress={() => router.push("/developer")}
        >
          <Text className="text-gray-50 text-title-3 text-center">
            개발자 (Developer)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-secondary rounded-lg px-6 py-4 w-full max-w-xs"
          activeOpacity={0.8}
          onPress={() => router.push("/tester")}
        >
          <Text className="text-gray-50 text-title-3 text-center">
            테스터 (Tester)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
