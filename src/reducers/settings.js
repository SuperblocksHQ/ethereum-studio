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
                        gasLimit: action.data.network.gasLimit ? action.data.network.gasLimit : initialState.preferences.network.gasLimit, // Make sure to fallback into the default when left empty
                        gasPrice: action.data.network.gasPrice ? action.data.network.gasPrice : initialState.preferences.network.gasPrice // Make sure to fallback into the default when left empty
                    }
                },
            };
        }
        default:
            return state;
    }
}
