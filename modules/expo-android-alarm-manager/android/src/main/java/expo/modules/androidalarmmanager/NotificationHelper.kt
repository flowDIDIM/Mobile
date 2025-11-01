package expo.modules.androidalarmmanager

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat

object NotificationHelper {
  const val CHANNEL_ID = "didim_test_reminder"
  const val NOTIFICATION_ID = 1001

  fun checkAndSendNotification(context: Context) {
    val untestedApps = AppTestingManager.getUntestedApps(context)

    if (untestedApps.isEmpty()) {
      return
    }

    sendNotification(context, untestedApps.size)
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
