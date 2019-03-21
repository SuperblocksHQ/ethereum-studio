import { ipfsActions, projectsActions } from '../actions';

export const initialState = {
    uploading: false,
    shareURL: null,
    timestamp: null,
    error: null,
    showUploadButton: false,
    showForkButton: true,
    showShareButton: false,
    showUploadSettings: false,
    showUploadDialog: false,
    uploadSettings: {
        includeBuildInfo: false,
        includeProjectConfig: false
    },
};

export default function panesReducer(state = initialState, action, rootState) {
    switch (action.type) {
        case ipfsActions.UPLOAD_TO_IPFS:
            return {
                ...state,
                uploading: true
            };
        case ipfsActions.UPLOAD_TO_IPFS_SUCCESS:
            return {
                ...state,
                uploading: false,
                timestamp: action.data.timestamp,
                shareURL: action.data.shareURL,
                showUploadDialog: true,
                showShareButton: true,
                uploadSettings: initialState.uploadSettings, // Make we reset the settigs on every upload
            };
        case ipfsActions.UPLOAD_TO_IPFS_FAIL: {
            return {
                ...state,
                uploading: false,
                error: action.data
            };
        }
        case ipfsActions.RESTORE_IPFS_STATE_SUCCESS: {
            return {
                ...state,
                timestamp: action.data.timestamp,
                shareURL: action.data.shareURL,
                showShareButton: true,
            };
        }
        case ipfsActions.RESTORE_IPFS_STATE_FAIL: {
            return {
                ...state,
                shareURL: null,
                timestamp: null
            };
        }
        case ipfsActions.SHOW_UPLOAD_SETTINGS: {
            return {
                ...state,
                showUploadSettings: true,
            };
        }
        case ipfsActions.HIDE_UPLOAD_SETTINGS: {
            return {
                ...state,
                showUploadSettings: false,
            };
        }
        case ipfsActions.UPLOAD_SETTINGS_CHANGED: {
            return {
                ...state,
                uploadSettings: action.data,
            };
        }
        case ipfsActions.HIDE_UPLOAD_DIALOG: {
            return {
                ...state,
                showUploadDialog: false,
            };
        }
        case ipfsActions.UPDATE_IPFS_ACTION_BUTTONS: {
            return {
                ...state,
                showUploadButton: action.data.showUploadButton && !rootState.app.isEmbeddedMode,
                showForkButton: action.data.showForkButton && !rootState.app.isEmbeddedMode,
                showShareButton: action.data.showShareButton && !rootState.app.isEmbeddedMode,
            };
        }
        case projectsActions.SELECT_PROJECT: {
            return {
                ...initialState, // Make we reset the state when changing projects
            };
        }
        default:
            return state;
    }
}
