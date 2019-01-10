import { ipfsActions, toastsActions } from '../actions';

export const initialState = {
    toasts: [],
};

export default function toatsReducer(state = initialState, action) {
    switch (action.type) {
        case ipfsActions.FORK_PROJECT_SUCCESS:
            return {
                ...state,
                toasts: state.toasts.concat(action.type)
            }
        case toastsActions.TOAST_DISMISSED:
            return {
                ...state,
                toasts: state.toasts.filter(toast => toast.id !== action.data)
            }
        default:
            return state;
    }
}
