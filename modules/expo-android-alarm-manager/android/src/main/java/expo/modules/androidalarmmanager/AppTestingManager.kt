package expo.modules.androidalarmmanager

import android.app.usage.UsageStatsManager
import android.content.Context
import androidx.core.content.edit
import expo.modules.androidalarmmanager.PreferencesRepository.getAppList
import java.util.Calendar

object AppTestingManager {

    fun Context.getUntestedApps(): Set<String> {
        val registeredApps = getAppList()
        if (registeredApps.isEmpty()) {
            return emptySet()
        }

        return calculateUntestedApps(registeredApps)
    }

    private fun Context.calculateUntestedApps(
        registeredApps: Set<String>
    ): Set<String> {
        val usageStatsManager =
            getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
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

        return registeredApps.filter { it !in usedPackages }.toSet()
    }
}
