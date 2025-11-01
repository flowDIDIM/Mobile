import ExpoModulesCore

public class ExpoAndroidAlarmManagerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoAndroidAlarmManager")

    Constants([
      "SHARED_PREFS_NAME": "ExpoAndroidAlarmManager",
      "KEY_APP_LIST": "didim_app_list"
    ])

    AsyncFunction("registerAlarm") { (hour: Int, minute: Int) in
      throw Exception(name: "UnsupportedPlatform", description: "Alarm manager is only supported on Android")
    }

    AsyncFunction("cancelAlarm") {
      throw Exception(name: "UnsupportedPlatform", description: "Alarm manager is only supported on Android")
    }

    AsyncFunction("testAlarm") {
      throw Exception(name: "UnsupportedPlatform", description: "Alarm manager is only supported on Android")
    }

    AsyncFunction("getAppList") { () -> [String] in
      throw Exception(name: "UnsupportedPlatform", description: "Alarm manager is only supported on Android")
    }

    AsyncFunction("setAppList") { (apps: [String]) in
      throw Exception(name: "UnsupportedPlatform", description: "Alarm manager is only supported on Android")
    }
  }
}
