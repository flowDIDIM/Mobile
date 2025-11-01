import { NativeModule, requireNativeModule } from "expo";

import { ExpoAndroidAlarmManagerModuleConstants } from "./ExpoAndroidAlarmManager.types";

declare class ExpoAndroidAlarmManagerModule extends NativeModule {
  SHARED_PREFS_NAME: string;
  KEY_APP_LIST: string;
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
