import { settingsActions } from '../actions';

export const initialState = {
    preferences: {
        network: {
            gasLimit: '7900000', //'0x288B60'
            gasPrice: '1000000000' //'0x3B9ACA00'
        },
        advanced: {
            trackAnalytics: true
        }
    },
    showTrackingAnalyticsDialog: true
};

export default function settingsReducer(state = initialState, action) {
    switch (action.type) {
        case settingsActions.SAVE_PREFERENCES: {
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
        case settingsActions.UPDATE_ANALYTICS_TRACKING: {
            return {
                ...state,
                preferences: {
                    ...state.preferences,
                    advanced: {
                        ...state.preferences.advanced,
                        trackAnalytics: action.data
                    }
                },
                showTrackingAnalyticsDialog: false
            };
        }
        default:
            return state;
    }
}

