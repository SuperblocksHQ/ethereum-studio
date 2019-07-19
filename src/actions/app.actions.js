export const appActions = {
    APP_START: 'APP_START',
    notifyAppStart(isEmbeddedMode) {
        return {
            type: appActions.APP_START,
            data: { isEmbeddedMode }
        }
    },
    APP_STARTED: 'APP_STARTED',
    notifyAppStarted() {
        return {
            type: appActions.APP_STARTED,
        }
    },

    CLOSE_BANNER: 'CLOSE_BANNER',
    closeBanner() {
        return {
            type: appActions.CLOSE_BANNER,
        }
    },
};
