import * as Notifications from "expo-notifications";
import ExpoAndroidAlarmManagerModule from "expo-android-alarm-manager";

async function requestNotificationPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  const finalStatus =
    existingStatus === "granted"
      ? existingStatus
      : (await Notifications.requestPermissionsAsync()).status;

  if (finalStatus !== "granted") {
    alert("알림 권한을 허용해주세요!");
    return undefined;
  }
}

export async function registerRemindNotification(
  hour: number = 20,
  minute: number = 0,
) {
  await requestNotificationPermission();
  await ExpoAndroidAlarmManagerModule.registerAlarm(hour, minute);
}

export async function testRemindNotification() {
  await ExpoAndroidAlarmManagerModule.testAlarm();
}
