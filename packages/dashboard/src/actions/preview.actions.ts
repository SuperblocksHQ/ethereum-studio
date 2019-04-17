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

import { IEnvironment } from '../models/state';

export const previewActions = {
    TRY_DOWNLOAD: 'PREVIEW.TRY_DOWNLOAD',
    tryDownload(hasExportableContent: boolean, currentEnvironment: IEnvironment) {
        return {
            type: previewActions.TRY_DOWNLOAD,
            data: { hasExportableContent, currentEnvironment }
        };
    },

    DOWNLOAD: 'PREVIEW.DOWNLOAD',
    download() {
        return {
            type: previewActions.DOWNLOAD
        };
    },

    HIDE_MODALS: 'PREVIEW.HIDE_MODALS',
    hideModals() {
        return {
            type: previewActions.HIDE_MODALS
        };
    },

    TOGGLE_WEB3_ACCOUNTS: 'PREVIEW.TOGGLE_WEB3_ACCOUNTS',
    toggleWeb3Accounts() {
        return {
            type: previewActions.TOGGLE_WEB3_ACCOUNTS
        };
    },
};
