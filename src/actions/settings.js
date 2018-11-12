/**
 * Trigger the even to do not show the Splash screen anymore
 */
export function showSplashNoMore() {
    return {
        type: 'SHOW_SPLASH',
        data: false,
    };
}

/**
 * Save all the user preferences changed throug the PreferencesModal
 */
export function savePreferences(newPreferences) {
    return {
        type: 'SAVE_PREFERENCES',
        data: newPreferences
    }
}
