// Copyright 2019 Superblocks AB
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

import { previewActions } from '../actions';
import Networks from '../networks';
import { AnyAction } from 'redux';

const initialState = {
    showNoExportableContentModal: false,
    showCannotExportModal: false,
    showDownloadModal: false,
    disableAccounts: false
};

export default function previewReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case previewActions.HIDE_MODALS:
            return {
                ...state,
                showTransactionsHistory: false,
                preview: {
                    ...state,
                    showCannotExportModal: false,
                    showNoExportableContentModal: false,
                    showDownloadModal: false
                }
            };
        case previewActions.TRY_DOWNLOAD: {
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
                preview: { ...state, showNoExportableContentModal, showCannotExportModal, showDownloadModal }
            };
        }
        case previewActions.TOGGLE_WEB3_ACCOUNTS:
            return {
                ...state,
                preview: { ...state, disableAccounts: !state.disableAccounts }
            };
        default:
            return state;
    }
}
