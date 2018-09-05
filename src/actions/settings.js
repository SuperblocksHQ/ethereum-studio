/**
 * Trigger the even to do not show the Splash screen anymore
 */
export function showSplashNoMore() {
    return {
        type: 'SHOW_SPLASH',
        data: false
    }
}
