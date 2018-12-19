import Store from '../store/settings';

export const initialState = Store;

export default function settingsReducer(state = initialState, action) {
    switch (action.type) {
        case 'SHOW_SPLASH': {
            return {
                ...state,
                showSplash: action.data,
            };
        }
        case 'SAVE_PREFERENCES': {
            return {
                ...state,
                preferences: {
                    network: {
                        gasLimit: action.data.network && action.data.network.gasLimit ? action.data.network.gasLimit : initialState.preferences.network.gasLimit,
                        gasPrice: action.data.network && action.data.network.gasPrice ? action.data.network.gasPrice : initialState.preferences.network.gasPrice,
                    },
                    advanced: action.data.advanced ? { ...action.data.advanced} : state.preferences.advanced
                },
            };
        }
        default:
            return state;
    }
}

