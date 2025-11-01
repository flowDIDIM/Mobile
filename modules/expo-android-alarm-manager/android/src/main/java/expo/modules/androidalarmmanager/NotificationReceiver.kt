package expo.modules.androidalarmmanager

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import java.util.Calendar

class NotificationReceiver : BroadcastReceiver() {
  companion object {
    const val CHANNEL_ID = "didim_test_reminder"
    const val NOTIFICATION_ID = 1001
    const val SHARED_PREFS_NAME = "ExpoAndroidAlarmManager"
    const val KEY_APP_LIST = "didim_app_list"
  }

  override fun onReceive(context: Context, intent: Intent) {
    val sharedPrefs = context.getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE)
    val appListJson = sharedPrefs.getString(KEY_APP_LIST, null)

    if (appListJson.isNullOrEmpty()) {
      return
    }

    val registeredApps = try {
      parseAppList(appListJson)
    } catch (e: Exception) {
      emptyList<String>()
    }

    if (registeredApps.isEmpty()) {
      return
    }

    val untestedApps = getUntestedApps(context, registeredApps)

    if (untestedApps.isEmpty()) {
      return
    }

    sendNotification(context, untestedApps.size)
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

  private fun getUntestedApps(context: Context, registeredApps: List<String>): List<String> {
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

  private fun sendNotification(context: Context, untestedCount: Int) {
    val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        CHANNEL_ID,
        "테스트 알림",
        NotificationManager.IMPORTANCE_HIGH
      ).apply {
        description = "앱 테스트 리마인더"
        enableVibration(true)
      }
      notificationManager.createNotificationChannel(channel)
    }

    val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
    val pendingIntent = PendingIntent.getActivity(
      context,
      0,
      launchIntent,
      PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
    )

    val notification = NotificationCompat.Builder(context, CHANNEL_ID)
      .setSmallIcon(android.R.drawable.ic_dialog_info)
      .setContentTitle("앱 테스트 알림")
      .setContentText("오늘 ${untestedCount}개의 테스트를 수행하지 않았어요!")
      .setPriority(NotificationCompat.PRIORITY_HIGH)
      .setAutoCancel(true)
      .setContentIntent(pendingIntent)
      .build()

    notificationManager.notify(NOTIFICATION_ID, notification)
  }
}
