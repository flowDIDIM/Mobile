import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

export async function registerPushNotification() {
  const CHANNEL_ID = "didimNotificationChannel";
  const CHANNEL_NAME = "미완료 테스트 알림을 위해 동의가 필요합니다.";

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: CHANNEL_NAME,
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  const finalStatus =
    existingStatus === "granted"
      ? existingStatus
      : (await Notifications.requestPermissionsAsync()).status;

  if (finalStatus !== "granted") {
    alert("알림 권한을 허용해주세요!");
    return undefined;
  }

  try {
    const token = (await Notifications.getDevicePushTokenAsync()).data;
    console.log("Push notification token:", token);
    return token;
  } catch (error) {
    alert("알림 토큰을 가져오는데 실패했습니다!");
    return undefined;
  }
}

export function setupNotificationHandler() {
  // 앱이 실행 중일 떄 알림을 받으면 어떻게 할 것인가?
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function registerBackgroundNotificationTask() {
  const BACKGROUND_NOTIFICATION_TASK = "DIDIM-BACKGROUND-NOTIFICATION-TASK";

  TaskManager.defineTask<Notifications.NotificationTaskPayload>(
    BACKGROUND_NOTIFICATION_TASK,
    async ({ data, error, executionInfo }) => {
      const isNotificationResponse = "actionIdentifier" in data;
      alert("hi");
      if (isNotificationResponse) {
        console.log("Notification 상호작용:", JSON.stringify(data, null, 2));
      } else {
        console.log("Notification 수신:", JSON.stringify(data, null, 2));
      }
    },
  );

  await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
  console.log("register done!");
}
