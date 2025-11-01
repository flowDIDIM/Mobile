import { requireNativeView } from "expo";
import * as React from "react";

import { ExpoAndroidAlarmManagerViewProps } from "./ExpoAndroidAlarmManager.types";

const NativeView: React.ComponentType<ExpoAndroidAlarmManagerViewProps> =
  requireNativeView("ExpoAndroidAlarmManager");

export default function ExpoAndroidAlarmManagerView(
  props: ExpoAndroidAlarmManagerViewProps,
) {
  return <NativeView {...props} />;
}
