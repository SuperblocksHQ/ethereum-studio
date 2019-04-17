export const settingsActions = {

    /**
    * Save all the user preferences changed throug the PreferencesModal
    */
    SAVE_PREFERENCES: 'SAVE_PREFERENCES',
    savePreferences(newPreferences) {
        return {
            type: settingsActions.SAVE_PREFERENCES,
            data: newPreferences
        }
    },

    /**
    * Update the current state of the analytics tracking (in this case changed outside the preferences context)
    */
   UPDATE_ANALYTICS_TRACKING: 'UPDATE_ANALYTICS_TRACKING',
   updateAnalyticsTracking(trackAnalytics) {
       return {
           type: settingsActions.UPDATE_ANALYTICS_TRACKING,
           data: trackAnalytics
       }
   }
};
