package expo.modules.androidalarmmanager

import android.app.usage.UsageStatsManager
import android.content.Context
import java.util.Calendar

object AppTestingManager {
  const val SHARED_PREFS_NAME = "ExpoAndroidAlarmManager"
  const val KEY_APP_LIST = "didim_app_list"

  fun getRegisteredApps(context: Context): List<String> {
    val sharedPrefs = context.getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE)
    val appListJson = sharedPrefs.getString(KEY_APP_LIST, null)

    if (appListJson.isNullOrEmpty()) {
      return emptyList()
    }

    return try {
      parseAppList(appListJson)
    } catch (e: Exception) {
      emptyList()
    }
  }

  fun setRegisteredApps(context: Context, apps: List<String>) {
    val sharedPrefs = context.getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE)
    val json = serializeAppList(apps)
    sharedPrefs.edit().putString(KEY_APP_LIST, json).apply()
  }

  fun getUntestedApps(context: Context): List<String> {
    val registeredApps = getRegisteredApps(context)
    if (registeredApps.isEmpty()) {
      return emptyList()
    }

    return calculateUntestedApps(context, registeredApps)
  }

  private fun serializeAppList(apps: List<String>): String {
    return apps.joinToString(
      separator = ",",
      prefix = "[",
      postfix = "]"
    ) { "\"$it\"" }
  }

  private fun parseAppList(json: String): List<String> {
    val trimmed = json.trim()
    if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
      return emptyList()
    }

    val content = trimmed.substring(1, trimmed.length - 1)
    if (content.isEmpty()) {
      return emptyList()
    }

    return content.split(",")
      .map { it.trim().removeSurrounding("\"") }
      .filter { it.isNotEmpty() }
  }

  private fun calculateUntestedApps(context: Context, registeredApps: List<String>): List<String> {
    val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
      ?: return registeredApps

    val calendar = Calendar.getInstance().apply {
      set(Calendar.HOUR_OF_DAY, 0)
      set(Calendar.MINUTE, 0)
      set(Calendar.SECOND, 0)
      set(Calendar.MILLISECOND, 0)
    }
    val startOfDay = calendar.timeInMillis
    val now = System.currentTimeMillis()

    val usageStatsList = usageStatsManager.queryUsageStats(
      UsageStatsManager.INTERVAL_DAILY,
      startOfDay,
      now
    )

    val usedPackages = usageStatsList
      ?.filter { it.lastTimeUsed >= startOfDay }
      ?.map { it.packageName }
      ?.toSet()
      ?: emptySet()

    return registeredApps.filter { it !in usedPackages }
  }
}
