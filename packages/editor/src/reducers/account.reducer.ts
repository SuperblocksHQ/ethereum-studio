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

import { accountActions } from '../actions';
import { AnyAction } from 'redux';

export const initialState = {
};

export default function panesReducer(state = initialState, action: AnyAction, rootState: any) {
    switch (action.type) {

        case accountActions.OPEN_ACCOUNT_CONFIGURATION: {
            const selectedAccount = action.data.account;

            return {
                state
            };
        }

        case accountActions.CLOSE_ACCOUNT_CONFIGURATION: {
            return {
                ...state,
                showContractConfig: false
            };
        }

        default:
            return state;
    }
}
