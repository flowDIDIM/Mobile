package expo.modules.androidalarmmanager

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import expo.modules.androidalarmmanager.AppTestingManager.getUntestedApps

class NotificationReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val untestedApps = context.getUntestedApps()
        if (untestedApps.isEmpty()) {
            // 모든 앱을 다 테스트했거나 존재하지 않다면 무시
            return
        }

        NotificationSender.sendRemindNotification(context, untestedApps.size)
    }
}
