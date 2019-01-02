export const ipfsActions = {
    UPLOAD_TO_IPFS: 'UPLOAD_TO_IPFS',
    uploadToIPFS(includeBuildInfo) {
        return {
            type: ipfsActions.UPLOAD_TO_IPFS,
            data: { includeBuildInfo }
        };
    },
    UPLOAD_TO_IPFS_SUCCESS: 'UPLOAD_TO_IPFS_SUCCESS',
    uploadToIPFSSuccess(timestamp, shareURL) {
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
    }
}
