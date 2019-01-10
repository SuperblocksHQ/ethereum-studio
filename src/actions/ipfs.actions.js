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
    }
}
