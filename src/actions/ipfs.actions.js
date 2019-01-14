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

export const ipfsActions = {
    UPLOAD_TO_IPFS: 'UPLOAD_TO_IPFS',
    uploadToIPFS(uploadSettings) {
        return {
            type: ipfsActions.UPLOAD_TO_IPFS,
            data: { uploadSettings }
        };
    },
    UPLOAD_TO_IPFS_SUCCESS: 'UPLOAD_TO_IPFS_SUCCESS',
    uploadToIPFSSuccess({ timestamp, shareURL }) {
        return {
            type: ipfsActions.UPLOAD_TO_IPFS_SUCCESS,
            data: { timestamp, shareURL }
        }
    },
    UPLOAD_TO_IPFS_FAIL: 'UPLOAD_TO_IPFS_FAIL',
    uploadToIPFSFail(error) {
        return {
            type: ipfsActions.UPLOAD_TO_IPFS_FAIL,
            data: error
        }
    },
    RESTORE_IPFS_STATE_SUCCESS: 'RESTORE_IPFS_STATE_SUCCESS',
    restoreIPFSStateSuccess({ timestamp, shareURL }) {
        return {
            type: ipfsActions.RESTORE_IPFS_STATE_SUCCESS,
            data: { timestamp, shareURL }
        }
    },
    RESTORE_IPFS_STATE_FAIL: 'RESTORE_IPFS_STATE_FAIL',
    restoreIPFSStateFail() {
        return {
            type: ipfsActions.RESTORE_IPFS_STATE_FAIL,
        }
    },
    SHOW_UPLOAD_SETTINGS: 'SHOW_UPLOAD_SETTINGS',
    showUploadSettings() {
        return {
            type: ipfsActions.SHOW_UPLOAD_SETTINGS,
        }
    },
    HIDE_UPLOAD_SETTINGS: 'HIDE_UPLOAD_SETTINGS',
    hideUploadSettings() {
        return {
            type: ipfsActions.HIDE_UPLOAD_SETTINGS,
        }
    },
    UPLOAD_SETTINGS_CHANGED: 'UPLOAD_SETTINGS_CHANGED',
    uploadSettingsChanged(uploadSettings) {
        return {
            type: ipfsActions.UPLOAD_SETTINGS_CHANGED,
            data: uploadSettings
        }
    },
    HIDE_UPLOAD_DIALOG: 'HIDE_UPLOAD_DIALOG',
    hideUploadDialog() {
        return {
            type: ipfsActions.HIDE_UPLOAD_DIALOG,
        }
    },
    FORK_PROJECT: 'FORK_PROJECT',
    forkProject() {
        return {
            type: ipfsActions.FORK_PROJECT,
        }
    },
    FORK_PROJECT_SUCCESS: 'FORK_PROJECT_SUCCESS',
    forkProjectSuccess() {
        return {
            type: ipfsActions.FORK_PROJECT_SUCCESS,
        }
    },
    FORK_PROJECT_FAIL: 'FORK_PROJECT_FAIL',
    forkProjectFail(error) {
        return {
            type: ipfsActions.FORK_PROJECT_FAIL,
            data: error
        }
    },
    IMPORT_PROJECT_FROM_IPFS: 'IMPORT_PROJECT_FROM_IPFS',
    importProjectFromIpfs(hash) {
        return {
            type: ipfsActions.IMPORT_PROJECT_FROM_IPFS,
            data: hash
        }
    },
    IMPORT_PROJECT_FROM_IPFS_SUCCESS: 'IMPORT_PROJECT_FROM_IPFS_SUCCESS',
    importProjectFromIpfsSuccess() {
        return {
            type: ipfsActions.IMPORT_PROJECT_FROM_IPFS_SUCCESS,
        }
    },
    IMPORT_PROJECT_FROM_IPFS_FAIL: 'IMPORT_PROJECT_FROM_IPFS_FAIL',
    importProjectFromIpfsFail(error) {
        return {
            type: ipfsActions.IMPORT_PROJECT_FROM_IPFS_FAIL,
            data: error
        }
    },
    UPDATE_IPFS_ACTION_BUTTONS: 'UPDATE_IPFS_ACTION_BUTTONS',
    updateIpfsActionButtons({ showUploadButton, showForkButton }) {
        return {
            type: ipfsActions.UPDATE_IPFS_ACTION_BUTTONS,
            data: { showUploadButton, showForkButton }
        }
    }
}
