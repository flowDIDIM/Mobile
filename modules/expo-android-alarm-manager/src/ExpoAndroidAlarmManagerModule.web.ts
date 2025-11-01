import { registerWebModule, NativeModule } from "expo";

import { ChangeEventPayload } from "./ExpoAndroidAlarmManager.types";

type ExpoAndroidAlarmManagerModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

class ExpoAndroidAlarmManagerModule extends NativeModule<ExpoAndroidAlarmManagerModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit("onChange", { value });
  }
  hello() {
    return "Hello world! 👋";
  }
}

export default registerWebModule(
  ExpoAndroidAlarmManagerModule,
  "ExpoAndroidAlarmManagerModule",
);
