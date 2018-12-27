import { ipfsActions } from '../actions';

export const initialState = {
    uploading: false,
    shareURL: null,
    error: null
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
                shareURL: action.data
            };
        case ipfsActions.UPLOAD_TO_IPFS_FAIL: {
            return {
                ...state,
                uploading: false,
                error: action.data
            };
        }
        default:
            return state;
    }
}
