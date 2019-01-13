export const ipfsSelectors = {
    getUploadingToIPFS: state => state.ipfs.uploading,
    getShareURL:  state => state.ipfs.shareURL,
    getLastUploadTimestamp: state => state.ipfs.timestamp,
    getUploadToIPFSError: state => state.ipfs.error,
    getShowUploadSettings: state => state.ipfs.showUploadSettings,
    getUploadSettings: state => state.ipfs.uploadSettings,
    getShowUploadDialog: state => state.ipfs.showUploadDialog,
    getShowUploadButton: state => state.ipfs.showUploadButton,
    getShowForkButton: state => state.ipfs.showForkButton,
}
