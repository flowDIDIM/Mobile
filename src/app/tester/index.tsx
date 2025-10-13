import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  Title3,
  Title4,
  Desc2,
  Desc3,
  ButtonText,
} from "@/components/Typography";

interface AppCardProps {
  appName: string;
  description: string;
  points: number;
  currentTesters: number;
  maxTesters: number;
}

function AppCard({
  appName,
  description,
  points,
  currentTesters,
  maxTesters,
}: AppCardProps) {
  return (
    <View className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl px-3 py-0 h-20 flex-row items-center justify-between">
      <View className="flex-row gap-3 items-center flex-1">
        <View className="bg-[#f1f3f3] rounded-lg w-14 h-14" />
        <View className="h-12 w-32 justify-between">
          <View className="gap-0.5">
            <Title4 className="text-[#f1f3f3] tracking-[-0.24px]">
              {appName}
            </Title4>
            <Desc2 className="text-[#f1f3f3] tracking-[-0.2px]">
              {description}
            </Desc2>
          </View>
          <Desc3 className="text-[#919da1] tracking-[-0.16px]">
            획득 포인트 {points}P · 테스터 정원 {currentTesters}/{maxTesters}
          </Desc3>
        </View>
      </View>
      <ButtonText className="text-[#4f96ff] tracking-[-0.2px]">
        참여하기
      </ButtonText>
    </View>
  );
}

interface TestAppItemProps {
  appName: string;
  points: number;
}

function TestAppItem({ appName, points }: TestAppItemProps) {
  return (
    <View className="flex-1 gap-1.5 items-center">
      <View className="bg-[#f1f3f3] h-[53.8px] rounded-lg w-full" />
      <ButtonText className="text-[#f1f3f3] tracking-[0.4px] text-center w-full">
        {appName}
      </ButtonText>
      <View className="bg-[#f1f3f3] rounded-full px-0 py-0.5 w-[38px] items-center justify-center">
        <ButtonText className="text-[#121316] tracking-[0.4px] text-center">
          {points}p
        </ButtonText>
      </View>
    </View>
  );
}

function PaginationDots({
  activeIndex,
  total,
}: {
  activeIndex: number;
  total: number;
}) {
  return (
    <View className="flex-row gap-1 items-center">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`w-1 h-1 rounded-full ${
            index === activeIndex ? "bg-white" : "bg-[#919da1]"
          }`}
        />
      ))}
    </View>
  );
}

export default function Tester() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View
        className="h-[52px] justify-center items-center"
        style={{ marginTop: insets.top }}
      >
        <Title3 className="text-[#f1f3f3] tracking-[-0.28px]">홈</Title3>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 나의 포인트 */}
        <View className="mx-5 mt-3 rounded-xl overflow-hidden">
          <View className="py-2">
            <Title3 className="text-[#f1f3f3] tracking-[-0.28px]">
              나의 포인트
            </Title3>
          </View>
          <View className="flex-row gap-1 items-center px-2 py-1">
            <Ionicons name="logo-bitcoin" size={24} color="#f1f3f3" />
            <Text className="text-[#f1f3f3] text-[36px] font-semibold tracking-[-0.72px]">
              300
            </Text>
            <Text className="text-[#f1f3f3] text-[36px] font-bold tracking-[-0.6px]">
              P
            </Text>
          </View>
        </View>

        {/* 오늘 미완료 테스트 */}
        <View className="mx-5 mt-3 rounded-xl overflow-hidden">
          <View className="py-2">
            <Title3 className="text-[#f1f3f3] tracking-[-0.28px]">
              오늘 미완료 테스트
            </Title3>
          </View>
          <View className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[20px] px-2 py-5 gap-3 items-center">
            <View className="gap-6 w-full">
              {/* First Row */}
              <View className="flex-row gap-3">
                <TestAppItem appName="인스타그..." points={400} />
                <TestAppItem appName="인스타그..." points={400} />
                <TestAppItem appName="인스타그..." points={400} />
                <TestAppItem appName="인스타그..." points={400} />
                <TestAppItem appName="인스타그..." points={400} />
              </View>
              {/* Second Row */}
              <View className="flex-row gap-3">
                <TestAppItem appName="인스타그..." points={400} />
                <TestAppItem appName="인스타그..." points={400} />
                <TestAppItem appName="인스타그..." points={400} />
                <TestAppItem appName="인스타그..." points={400} />
                <TestAppItem appName="인스타그..." points={400} />
              </View>
            </View>
            <PaginationDots activeIndex={0} total={5} />
          </View>
        </View>

        {/* 최근 추가된 앱 */}
        <View className="mx-5 mt-3 items-center">
          <View className="py-2 w-full">
            <Title3 className="text-[#f1f3f3] tracking-[-0.28px]">
              최근 추가된 앱
            </Title3>
          </View>
          <View className="gap-2 w-[319px]">
            <AppCard
              appName="앱 이름"
              description="한 줄 소개"
              points={400}
              currentTesters={2}
              maxTesters={20}
            />
            <AppCard
              appName="앱 이름"
              description="한 줄 소개"
              points={400}
              currentTesters={2}
              maxTesters={20}
            />
            <AppCard
              appName="앱 이름"
              description="한 줄 소개"
              points={400}
              currentTesters={2}
              maxTesters={20}
            />
          </View>
        </View>

        {/* 곧 마감되는 앱 */}
        <View className="mx-5 mt-3 items-center mb-24">
          <View className="py-2 w-full">
            <Title3 className="text-[#f1f3f3] tracking-[-0.28px]">
              곧 마감되는 앱
            </Title3>
          </View>
          <View className="gap-2 w-[319px]">
            <AppCard
              appName="앱 이름"
              description="한 줄 소개"
              points={400}
              currentTesters={2}
              maxTesters={20}
            />
            <AppCard
              appName="앱 이름"
              description="한 줄 소개"
              points={400}
              currentTesters={2}
              maxTesters={20}
            />
            <AppCard
              appName="앱 이름"
              description="한 줄 소개"
              points={400}
              currentTesters={2}
              maxTesters={20}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View
        className="absolute bottom-0 left-0 right-0 h-[52px] flex-row items-center justify-around px-5"
        style={{ paddingBottom: insets.bottom }}
      >
        <TouchableOpacity className="py-2 flex-1 items-center">
          <Ionicons name="home" size={24} color="#f1f3f3" />
        </TouchableOpacity>
        <TouchableOpacity className="py-2 flex-1 items-center">
          <Ionicons name="search-outline" size={24} color="#919da1" />
        </TouchableOpacity>
        <TouchableOpacity className="py-2 flex-1 items-center">
          <Ionicons name="gift-outline" size={24} color="#919da1" />
        </TouchableOpacity>
        <TouchableOpacity className="py-2 flex-1 items-center">
          <Ionicons name="person-outline" size={24} color="#919da1" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
