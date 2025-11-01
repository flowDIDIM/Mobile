# Expo Android Alarm Manager Usage Guide

이 모듈은 Android에서 매일 특정 시간에 알림을 보내는 기능을 제공합니다. 알림은 앱 참여 목록을 확인하여 오늘 실행하지 않은 앱이 있을 때만 표시됩니다.

## 설치 및 설정

### 1. 모듈 import

```typescript
import ExpoAndroidAlarmManager from "@/modules/expo-android-alarm-manager";
```

### 2. SharedPreferences 키 사용

JavaScript와 Android 네이티브 코드가 같은 저장소를 공유하도록 상수를 사용합니다:

```typescript
const SHARED_PREFS_NAME = ExpoAndroidAlarmManager.SHARED_PREFS_NAME; // "ExpoAndroidAlarmManager"
const KEY_APP_LIST = ExpoAndroidAlarmManager.KEY_APP_LIST; // "didim_app_list"
```

### 3. 앱 참여 목록 저장 (JavaScript)

AsyncStorage 또는 다른 저장소를 사용하여 앱 목록을 JSON 배열 형태로 저장합니다:

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

// 예시: 앱 패키지 이름 배열
const appList = ["com.example.app1", "com.kakao.talk", "com.naver.whale"];

// JSON 문자열로 변환하여 저장
await AsyncStorage.setItem(
  `${SHARED_PREFS_NAME}:${KEY_APP_LIST}`,
  JSON.stringify(appList)
);
```

**중요**: AsyncStorage의 키는 `prefix:key` 형식이므로 `"ExpoAndroidAlarmManager:didim_app_list"`로 저장됩니다.

## 알람 등록

### 권한 요청

먼저 필요한 권한을 요청해야 합니다:

```typescript
import * as Notifications from "expo-notifications";
import { Platform, Linking } from "react-native";

// 1. POST_NOTIFICATIONS 권한 (Android 13+)
if (Platform.OS === "android" && Platform.Version >= 33) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.log("알림 권한이 거부되었습니다");
    return;
  }
}

// 2. PACKAGE_USAGE_STATS 권한
// 이 권한은 설정 화면에서 수동으로 허용해야 합니다
if (Platform.OS === "android") {
  Linking.openSettings();
  // 사용자에게 "사용 정보 접근" 권한을 활성화하도록 안내
}
```

### 알람 등록하기

```typescript
try {
  // 매일 오전 10시에 알람 등록
  await ExpoAndroidAlarmManager.registerAlarm(10, 0);
  console.log("알람이 등록되었습니다");
} catch (error) {
  console.error("알람 등록 실패:", error);
}
```

### 알람 취소하기

```typescript
try {
  await ExpoAndroidAlarmManager.cancelAlarm();
  console.log("알람이 취소되었습니다");
} catch (error) {
  console.error("알람 취소 실패:", error);
}
```

## 전체 예시 (온보딩 버튼)

```typescript
import { useState } from "react";
import { View, Button, Alert, Platform, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import ExpoAndroidAlarmManager from "@/modules/expo-android-alarm-manager";

export default function OnboardingScreen() {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterAlarm = async () => {
    if (Platform.OS !== "android") {
      Alert.alert("Android에서만 사용 가능합니다");
      return;
    }

    setIsRegistering(true);

    try {
      // 1. 알림 권한 요청 (Android 13+)
      if (Platform.Version >= 33) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("알림 권한이 필요합니다");
          setIsRegistering(false);
          return;
        }
      }

      // 2. 사용 정보 접근 권한 안내
      Alert.alert(
        "권한 필요",
        "앱 사용 기록을 확인하기 위해 '사용 정보 접근' 권한을 활성화해주세요.",
        [
          { text: "취소", style: "cancel" },
          {
            text: "설정으로 이동",
            onPress: async () => {
              Linking.openSettings();

              // 사용자가 돌아왔을 때 알람 등록 계속 진행
              setTimeout(async () => {
                try {
                  // 3. 앱 목록 저장 (예시)
                  const appList = [
                    "com.example.app1",
                    "com.kakao.talk",
                    "com.naver.whale",
                  ];

                  await AsyncStorage.setItem(
                    `${ExpoAndroidAlarmManager.SHARED_PREFS_NAME}:${ExpoAndroidAlarmManager.KEY_APP_LIST}`,
                    JSON.stringify(appList)
                  );

                  // 4. 알람 등록 (매일 오전 10시)
                  await ExpoAndroidAlarmManager.registerAlarm(10, 0);

                  Alert.alert("성공", "알람이 등록되었습니다!");
                } catch (error) {
                  Alert.alert("오류", "알람 등록에 실패했습니다");
                  console.error(error);
                } finally {
                  setIsRegistering(false);
                }
              }, 3000);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("오류", "알람 등록에 실패했습니다");
      console.error(error);
      setIsRegistering(false);
    }
  };

  return (
    <View>
      <Button
        title={isRegistering ? "등록 중..." : "알람 등록하기"}
        onPress={handleRegisterAlarm}
        disabled={isRegistering}
      />
    </View>
  );
}
```

## 동작 방식

1. **알람 등록**: `registerAlarm(hour, minute)` 호출 시 매일 지정된 시간에 `NotificationReceiver`가 트리거됩니다.

2. **앱 사용 기록 확인**: `NotificationReceiver`는 다음을 수행합니다:
   - SharedPreferences에서 앱 목록 조회
   - UsageStatsManager를 사용하여 오늘 0시~현재까지의 앱 사용 기록 조회
   - 실행하지 않은 앱 계산

3. **알림 표시**: 실행하지 않은 앱이 있을 때만 다음과 같은 알림을 표시합니다:
   ```
   제목: "앱 테스트 알림"
   내용: "오늘 N개의 테스트를 수행하지 않았어요!"
   ```

4. **알림 우선순위**: HIGH 우선순위로 설정되어 소리와 함께 표시됩니다.

## 주의사항

1. **PACKAGE_USAGE_STATS 권한**: 이 권한은 일반적인 런타임 권한이 아니므로 사용자가 설정 화면에서 수동으로 활성화해야 합니다.

2. **배터리 최적화**: 일부 제조사(Samsung, Xiaomi 등)는 배터리 최적화로 인해 AlarmManager가 정확히 작동하지 않을 수 있습니다. 사용자에게 배터리 최적화 예외를 추가하도록 안내할 수 있습니다.

3. **Android 12+**: `SCHEDULE_EXACT_ALARM` 권한이 필요하며, 모듈에서 자동으로 확인합니다.

4. **SharedPreferences 동기화**: JavaScript의 AsyncStorage와 Android의 SharedPreferences가 같은 데이터를 공유하도록 키를 정확히 일치시켜야 합니다.

## 트러블슈팅

### 알람이 작동하지 않음
- 설정 > 앱 > DIDIM > 알림이 활성화되어 있는지 확인
- 배터리 최적화 예외 목록에 추가
- SCHEDULE_EXACT_ALARM 권한이 부여되었는지 확인

### 앱 목록이 조회되지 않음
- AsyncStorage 키가 정확한지 확인: `"ExpoAndroidAlarmManager:didim_app_list"`
- 저장된 값이 JSON 배열 형태인지 확인: `["com.example.app"]`

### 사용 정보를 읽을 수 없음
- 설정 > 보안 및 개인정보 보호 > 사용 정보 접근에서 DIDIM 앱을 활성화
