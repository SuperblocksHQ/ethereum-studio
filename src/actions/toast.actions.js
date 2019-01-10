export const toastActions = {
    TOAST_DISMISSED: 'TOAST_DISMISSED',
    toastDismissed(id) {
        return {
            type: toastActions.TOAST_DISMISSED,
            data: id
        };
    }
}
