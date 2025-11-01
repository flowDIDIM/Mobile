import { registerWebModule, NativeModule } from "expo";

class ExpoAndroidAlarmManagerModule extends NativeModule {
  SHARED_PREFS_NAME = "ExpoAndroidAlarmManager";
  KEY_APP_LIST = "didim_app_list";

  async registerAlarm(hour: number, minute: number): Promise<void> {
    console.warn("Alarm manager is not supported on web");
  }

  async cancelAlarm(): Promise<void> {
    console.warn("Alarm manager is not supported on web");
  }
}

export default registerWebModule(
  ExpoAndroidAlarmManagerModule,
  "ExpoAndroidAlarmManagerModule",
);
