// Reexport the native module. On web, it will be resolved to ExpoAndroidAlarmManagerModule.web.ts
// and on native platforms to ExpoAndroidAlarmManagerModule.ts
export { default } from "./src/ExpoAndroidAlarmManagerModule";
export * from "./src/ExpoAndroidAlarmManager.types";
