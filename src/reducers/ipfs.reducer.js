import { ipfsActions } from '../actions';

export const initialState = {
    uploading: false,
    shareURL: null,
    timestamp: null,
    error: null,
    showUploadSettings: false
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
                shareURL: action.data.shareURL
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
        default:
            return state;
    }
}
