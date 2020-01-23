// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import { settingsActions, appActions } from '../actions';
import { AnyAction } from 'redux';

export const initialState = {
    preferences: {
        network: {
            gasLimit: '7900000', // '0x288B60'
            gasPrice: '1000000000' // '0x3B9ACA00'
        },
        advanced: {
            trackAnalytics: process.env.NODE_ENV === 'production'
        }
    },
    showTrackingAnalyticsDialog: true
};

export default function settingsReducer(state = initialState, action: AnyAction, rootState: any) {
    switch (action.type) {
        case appActions.APP_STARTED: {
            return {
                ...state,
                showTrackingAnalyticsDialog: state.showTrackingAnalyticsDialog && !rootState.app.isEmbeddedMode,
            };
        }
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

