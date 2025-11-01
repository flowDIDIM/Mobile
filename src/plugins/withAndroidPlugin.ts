import { ConfigPlugin, withAndroidManifest } from "expo/config-plugins";

const withAndroidPlugin: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config?.modResults?.manifest?.application?.[0];

    if (mainApplication) {
      // Ensure receiver array exists
      if (!mainApplication["receiver"]) {
        mainApplication["receiver"] = [];
      }

      const receivers = mainApplication["receiver"];

      // 이미 존재하지 않을 때만 생성
      if (receivers) {
        for (const receiver of receivers) {
          if (receiver.$["android:name"] === ".NotificationReceiver") {
            return config;
          }
        }
      }

      mainApplication["receiver"].push({
        $: {
          "android:name": ".NotificationReceiver",
          "android:enabled": "true",
          "android:exported": "false",
        },
        "intent-filter": [
          {
            action: [
              { $: { "android:name": "android.intent.action.BOOT_COMPLETED" } },
            ],
          },
        ],
      });
    }

    return config;
  });
};

export default withAndroidPlugin;
