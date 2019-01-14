import { ipfsActions, projectActions } from '../actions';

export const initialState = {
    uploading: false,
    shareURL: null,
    timestamp: null,
    error: null,
    showUploadButton: false,
    showForkButton: true,
    showUploadSettings: false,
    showUploadDialog: false,
    uploadSettings: {
        includeBuildInfo: false,
        includeProjectConfig: false
    },
};

export default function panesReducer(state = initialState, action) {
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
                uploadSettings: initialState.uploadSettings // Make we reset the settigs on every upload
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
                shareURL: action.data.shareURL
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
                showUploadButton: action.data.showUploadButton,
                showForkButton: action.data.showForkButton,
            };
        }
        case projectActions.SELECT_PROJECT: {
            return {
                ...initialState, // Make we reset the state when changing projects
            };
        }
        default:
            return state;
    }
}
