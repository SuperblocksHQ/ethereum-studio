export const toastsActions = {
    TOAST_DISMISSED: 'TOAST_DISMISSED',
    toastDismissed(index) {
        return {
            type: ipfsActions.TOAST_DISMISSED,
            data: index
        };
    }
}
