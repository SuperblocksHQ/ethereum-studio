// Copyright 2019 Superblocks AB
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

import { AnyAction } from 'redux';
import { transactionsActions } from '../actions';
import { ITransactionsState } from '../models';
import { replaceInArray } from './utils';

const initialState: ITransactionsState = {
    items: []
};

export default function transactionsReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case transactionsActions.ADD_TRANSACTION:
            return {
                ...state,
                items: [
                    {...action.data.transaction},
                    ...state.items,
                ]
            };
        case transactionsActions.UPDATE_TRANSACTION:
            return {
                ...state,
                items: replaceInArray(
                    state.items,
                    item => item.hash === action.data.transaction.hash,
                    item => ({...item, ...action.data.transaction, createdAt: item.createdAt})
                )
            };
        default:
            return state;
    }
}
