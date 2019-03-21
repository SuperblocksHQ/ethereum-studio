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
    getShowShareButton: state => state.ipfs.showShareButton,
}
