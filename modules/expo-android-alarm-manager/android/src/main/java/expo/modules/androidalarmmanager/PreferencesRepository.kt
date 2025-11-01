package expo.modules.androidalarmmanager

import android.content.Context
import androidx.core.content.edit

object PreferencesRepository {
    private const val SHARED_PREFS_NAME = "ExpoAndroidAlarmManager"
    private const val KEY_APP_LIST = "didim_app_list"
    private const val KEY_IS_SCHEDULED = "didim_is_scheduled"

    fun Context.getAppList(): Set<String> {
        return preference.getStringSet(KEY_APP_LIST, emptySet()) ?: emptySet()
    }

    fun Context.setAppList(list: Set<String>) {
         preference.edit {
             putStringSet(KEY_APP_LIST, list)
         }
    }

    fun Context.isScheduled(): Boolean {
        return preference.getBoolean(KEY_IS_SCHEDULED, false)
    }

    fun Context.setIsScheduled(value: Boolean) {
        preference.edit {
             putBoolean(KEY_IS_SCHEDULED, value)
         }
    }

    private val Context.preference
        get() = getSharedPreferences(
            SHARED_PREFS_NAME,
            Context.MODE_PRIVATE
        )
}