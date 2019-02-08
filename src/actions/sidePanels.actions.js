export const sidePanelsActions = {
    CLOSE_ALL_PANELS: 'CLOSE_ALL_PANELS',
    closeAllPanels() {
        return {
            type: sidePanelsActions.CLOSE_ALL_PANELS
        };
    },

    TOGGLE_TRANSACTIONS_HISTORY_PANEL: 'TOGGLE_TRANSACTIONS_HISTORY_PANEL',
    toggleTransactionsHistoryPanel() {
        return { type: sidePanelsActions.TOGGLE_TRANSACTIONS_HISTORY_PANEL };
    },

    OPEN_TRANSACTIONS_HISTORY_PANEL: 'OPEN_TRANSACTIONS_HISTORY_PANEL',
    openTransactionsHistoryPanel() {
        return { type: sidePanelsActions.OPEN_TRANSACTIONS_HISTORY_PANEL };
    },

    CLOSE_TRANSACTIONS_HISTORY_PANEL: 'CLOSE_TRANSACTIONS_HISTORY_PANEL',
    closeTransactionsHistoryPanel() {
        return { type: sidePanelsActions.CLOSE_TRANSACTIONS_HISTORY_PANEL };
    },

    TOGGLE_FILESYSTEM_PANEL: 'TOGGLE_FILESYSTEM_PANEL',
    toggleFileSystemPanel() {
        return { type: sidePanelsActions.TOGGLE_FILESYSTEM_PANEL };
    },

    CLOSE_FILESYSTEM_PANEL: 'CLOSE_FILESYSTEM_PANEL',
    closeFileSystemPanel() {
        return { type: sidePanelsActions.CLOSE_FILESYSTEM_PANEL };
    },

    preview: {
        TOGGLE_PANEL: 'PREVIEW.TOGGLE_PANEL',
        togglePanel() {
            return {
                type: sidePanelsActions.preview.TOGGLE_PANEL
            };
        },

        TRY_DOWNLOAD: 'PREVIEW.TRY_DOWNLOAD',
        tryDownload(hasExportableContent, currentEnvironment) {
            return {
                type: sidePanelsActions.preview.TRY_DOWNLOAD,
                data: { hasExportableContent, currentEnvironment }
            };
        },

        DOWNLOAD: 'PREVIEW.DOWNLOAD',
        download() {
            return {
                type: sidePanelsActions.preview.DOWNLOAD
            };
        },
    
        HIDE_MODALS: 'PREVIEW.HIDE_MODALS',
        hideModals() {
            return {
                type: sidePanelsActions.preview.HIDE_MODALS
            };
        },

        TOGGLE_WEB3_ACCOUNTS: 'PREVIEW.TOGGLE_WEB3_ACCOUNTS',
        toggleWeb3Accounts() {
            return {
                type: sidePanelsActions.preview.TOGGLE_WEB3_ACCOUNTS
            };
        },
    }
};
