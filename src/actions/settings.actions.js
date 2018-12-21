export const settingsActions = {

    /**
    * Trigger the even to do not show the Splash screen anymore
    */
    SHOW_SPLASH: 'SHOW_SPLASH',
    showSplashNoMore() {
        return {
            type: settingsActions.SHOW_SPLASH,
            data: false,
        }
    },

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
