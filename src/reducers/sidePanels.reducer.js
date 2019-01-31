// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import { sidePanelsActions } from '../actions';
import Networks from '../networks';

export const initialState = {
    showTransactionsHistory: false,
    showFileSystem: true,
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
        case sidePanelsActions.TOGGLE_FILESYSTEM_PANEL: {
            return {
                ...state,
                showFileSystem: !state.showFileSystem
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
            } else if (action.data.currentEnvironment === Networks.browser.name) {
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
