/**
 * Trigger the even to do not show the Splash screen anymore
 */
export function showSplashNoMore() {
    return {
        type: 'SHOW_SPLASH_NO_MORE',
        data: false
    }
}
