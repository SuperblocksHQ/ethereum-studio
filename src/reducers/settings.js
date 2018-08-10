import Store from '../store/settings';

export const initialState = Store;

export default function settingsReducer(state = initialState, action) {
    switch (action.type) {
        case 'SHOW_SPLASH_NO_MORE': {
            return {
            ...state,
            showSplash: action.data,
            };
        }
        default:
            return state;
    }
}
