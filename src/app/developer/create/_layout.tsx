import { Stack } from "expo-router";
import { stackNavigationScreenOptions } from "@/design-system";

export default function CreateLayout() {
  return (
    <Stack screenOptions={stackNavigationScreenOptions}>
      <Stack.Screen
        name="package"
        options={{
          title: "패키지명 입력",
        }}
      />
      <Stack.Screen
        name="track"
        options={{
          title: "트랙 선택",
        }}
      />
      <Stack.Screen
        name="info"
        options={{
          title: "정보 입력",
        }}
      />
    </Stack>
  );
}
