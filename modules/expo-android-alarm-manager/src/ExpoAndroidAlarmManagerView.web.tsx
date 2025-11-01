import * as React from "react";

import { ExpoAndroidAlarmManagerViewProps } from "./ExpoAndroidAlarmManager.types";

export default function ExpoAndroidAlarmManagerView(
  props: ExpoAndroidAlarmManagerViewProps,
) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
