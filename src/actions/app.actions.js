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
    UPDATE_VIEW_PARAMETERS: 'UPDATE_VIEW_PARAMETERS',
    updateViewParameters(parameters) {
        return {
            type: appActions.UPDATE_VIEW_PARAMETERS,
            data: { parameters }
        }
    },
    INIT_EVM: 'INIT_EVM',
    initEvm() {
        return {
            type: appActions.INIT_EVM
        };
    },
    EVM_READY: 'EVM_READY',
    emvReady() {
        return {
            type: appActions.EVM_READY
        }
    }
};
