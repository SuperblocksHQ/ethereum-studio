import { ipfsActions } from '../actions';

export const initialState = {
    uploading: false,
    shareURL: null,
    timestamp: null,
    error: null
};

export default function panesReducer(state = initialState, action) {
    console.log(action.data);
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
                shareURL: action.data.shareURL,
                timestamp: action.data.timestamp
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
                shareURL: action.data
            };
        }
        case ipfsActions.RESTORE_IPFS_STATE_FAIL: {
            return {
                ...state,
                shareURL: null
            };
        }
        default:
            return state;
    }
}
