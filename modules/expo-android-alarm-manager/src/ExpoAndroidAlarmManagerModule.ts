import { NativeModule, requireNativeModule } from "expo";

declare class ExpoAndroidAlarmManagerModule extends NativeModule {
  registerAlarm(hour: number, minute: number): Promise<void>;
  cancelAlarm(): Promise<void>;
  testAlarm(): Promise<void>;
  getAppList(): Promise<string[]>;
  setAppList(apps: string[]): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoAndroidAlarmManagerModule>(
  "ExpoAndroidAlarmManager",
);
