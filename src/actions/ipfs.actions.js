export const ipfsActions = {
    UPLOAD_TO_IPFS: 'UPLOAD_TO_IPFS',
    uploadToIPFS(includeBuildInfo) {
        return {
            type: ipfsActions.UPLOAD_TO_IPFS,
            data: { includeBuildInfo }
        };
    },
    UPLOAD_TO_IPFS_SUCCESS: 'UPLOAD_TO_IPFS_SUCCESS',
    uploadToIPFSSuccess(shareURL) {
        return {
            type: ipfsActions.UPLOAD_TO_IPFS_SUCCESS,
            data: { shareURL }
        }
    },
    UPLOAD_TO_IPFS_FAIL: 'UPLOAD_TO_IPFS_FAIL',
    uploadToIPFSFail(error) {
        return {
            type: ipfsActions.UPLOAD_TO_IPFS_FAIL,
            data: { error }
        }
    }
}
