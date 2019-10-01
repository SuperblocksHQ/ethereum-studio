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
import { IAccountState } from '../models/state';

export const initialState: IAccountState =  {
    showAccountConfig: false,
    selectedAccount: undefined,
    knownWalletSeed: 'butter toward celery cupboard blind morning item night fatal theme display toy'
};

export default function accountsReducer(state = initialState, action: AnyAction, rootState: any) {
    switch (action.type) {

        case accountActions.OPEN_ACCOUNT_CONFIGURATION: {
            return {
                ...state,
                selectedAccount: action.data.account,
                showAccountConfig: true
            };
        }

        case accountActions.CLOSE_ACCOUNT_CONFIGURATION: {
            return {
                ...state,
                showAccountConfig: false,
                selectedAccount: undefined
            };
        }

        default:
            return state;
    }
}
