export const ipfsSelectors = {
    getUploadingToIPFS: state => state.ipfs.uploading,
    getShareURL:  state => state.ipfs.shareURL,
    getLastUploadTimestamp: state => state.ipfs.timestamp,
    getUploadToIPFSError: state => state.ipfs.error,
    getShowUploadSettings: state => state.ipfs.showUploadSettings,
}



