import { sidePanelsActions } from '../actions';

export const initialState = {
    showTransactionsHistory: false,
    preview: {
        showNoExportableContentModal: false,
        showCannotExportModal: false,
        showDownloadModal: false,
        disableAccounts: false,
        open: false
    }
};

export default function sidePanelsReducer(state = initialState, action) {
    switch (action.type) {
        case sidePanelsActions.CLOSE_ALL_PANELS: {
            return {
                ...state,
                showTransactionsHistory: false,
                preview: { ...state.preview, open: false }
            };
        }
        case sidePanelsActions.TOGGLE_TRANSACTIONS_HISTORY_PANEL: {
            return {
                ...state,
                showTransactionsHistory: !state.showTransactionsHistory,
                preview: { ...state.preview, open: false }
            };
        }
        case sidePanelsActions.OPEN_TRANSACTIONS_HISTORY_PANEL: {
            return {
                ...state,
                showTransactionsHistory: true,
                preview: { ...state.preview, open: false }
            };
        }
        case sidePanelsActions.CLOSE_TRANSACTIONS_HISTORY_PANEL: {
            return {
                ...state,
                showTransactionsHistory: false
            };
        }
        case sidePanelsActions.preview.TOGGLE_PANEL:
            return {
                ...state,
                showTransactionsHistory: false,
                preview: { ...state.preview, open: !state.preview.open }
            };
        case sidePanelsActions.preview.HIDE_MODALS:
            return {
                ...state,
                showTransactionsHistory: false,
                preview: {
                    ...state.preview, 
                    showCannotExportModal: false,
                    showNoExportableContentModal: false,
                    showDownloadModal: false
                }
            };
        case sidePanelsActions.preview.TRY_DOWNLOAD: {
            let showNoExportableContentModal = false;
            let showCannotExportModal = false;
            let showDownloadModal = false;

            if (!action.data.hasExportableContent) {
                showNoExportableContentModal = true;
            } else if (action.data.currentEnvironment === 'browser') {
                showCannotExportModal = true;
            } else {
                showDownloadModal = true;
            }
            
            return {
                ...state,
                preview: { ...state.preview, showNoExportableContentModal, showCannotExportModal, showDownloadModal }
            };
        }
        case sidePanelsActions.preview.TOGGLE_WEB3_ACCOUNTS:
            return {
                ...state,
                preview: { ...state.preview, disableAccounts: !state.preview.disableAccounts }
            }
        default:
            return state;
    }
}
