import { NativeModule, requireNativeModule } from "expo";

import { ExpoAndroidAlarmManagerModuleEvents } from "./ExpoAndroidAlarmManager.types";

declare class ExpoAndroidAlarmManagerModule extends NativeModule<ExpoAndroidAlarmManagerModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoAndroidAlarmManagerModule>(
  "ExpoAndroidAlarmManager",
);
