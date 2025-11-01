import { registerWebModule, NativeModule } from "expo";

class ExpoAndroidAlarmManagerModule extends NativeModule {
  async registerAlarm(hour: number, minute: number): Promise<void> {
    console.warn("Alarm manager is not supported on web");
  }

  async cancelAlarm(): Promise<void> {
    console.warn("Alarm manager is not supported on web");
  }

  async testAlarm(): Promise<void> {
    console.warn("Alarm manager is not supported on web");
  }

  async getAppList(): Promise<string[]> {
    console.warn("Alarm manager is not supported on web");
    return [];
  }

  async setAppList(apps: string[]): Promise<void> {
    console.warn("Alarm manager is not supported on web");
  }
}

export default registerWebModule(
  ExpoAndroidAlarmManagerModule,
  "ExpoAndroidAlarmManagerModule",
);
