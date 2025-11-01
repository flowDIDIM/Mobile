package expo.modules.androidalarmmanager

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import expo.modules.androidalarmmanager.AppTestingManager.getUntestedApps
import expo.modules.androidalarmmanager.PreferencesRepository.getAppList
import expo.modules.androidalarmmanager.PreferencesRepository.setAppList
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.Calendar

class ExpoAndroidAlarmManagerModule : Module() {
    companion object {
        private const val ALARM_REQUEST_CODE = 1000
    }

    override fun definition() = ModuleDefinition {
        Name("ExpoAndroidAlarmManager")

        AsyncFunction("registerAlarm") { hour: Int, minute: Int ->
            val context = appContext.reactContext ?: throw Exception("React context is null")

            val intent = Intent(context, NotificationReceiver::class.java)
            val pendingIntent = PendingIntent.getBroadcast(
                context,
                ALARM_REQUEST_CODE,
                intent,
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
            )

            val calendar = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, hour)
                set(Calendar.MINUTE, minute)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)

                // 오늘 이미 지난 시간이면 내일로 스케줄링
                if (timeInMillis <= System.currentTimeMillis()) {
                    add(Calendar.DAY_OF_MONTH, 1)
                }
            }

            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            alarmManager.setInexactRepeating(
                AlarmManager.RTC_WAKEUP,
                calendar.timeInMillis,
                AlarmManager.INTERVAL_DAY,
                pendingIntent
            )
        }

        AsyncFunction("cancelAlarm") {
            val context = appContext.reactContext ?: throw Exception("React context is null")

            // registerAlarm과 동일한 intent로 PendingIntent를 찾아야 취소 가능
            val intent = Intent(context, NotificationReceiver::class.java)
            val pendingIntent = PendingIntent.getBroadcast(
                context,
                ALARM_REQUEST_CODE,
                intent,
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_NO_CREATE
            )

            if (pendingIntent != null) {
                val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
                alarmManager.cancel(pendingIntent)
                pendingIntent.cancel()
            }
        }

        AsyncFunction("testAlarm") {
            val context = appContext.reactContext ?: throw Exception("React context is null")
            val untestedApps = context.getUntestedApps()
            NotificationSender.sendRemindNotification(context, untestedApps.size)
        }

        AsyncFunction("getAppList") {
            val context = appContext.reactContext ?: throw Exception("React context is null")
            context.getAppList()
        }

        AsyncFunction("setAppList") { apps: List<String> ->
            val context = appContext.reactContext ?: throw Exception("React context is null")
            context.setAppList(apps.toSet())
        }
    }
}
