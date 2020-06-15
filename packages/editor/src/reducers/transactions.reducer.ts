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
import { formatTransaction } from './transactionsLib';

const initialState: ITransactionsState = {
    items: []
};

export default function transactionsReducer(state = initialState, action: AnyAction, wholeState: any) {
    switch (action.type) {
        case transactionsActions.ADD_TRANSACTION:
            const transaction = formatTransaction({state: wholeState, transactionType: action.data.transactionType, hash: action.data.hash, environment: action.data.environment,
                receipt: action.data.receipt, contractName: action.data.contractName, tx: action.data.tx, contractArgs: action.data.contractArgs, functionName: action.data.functionName, error: action.data.error});
            return {
                ...state,
                items: [
                    { ...transaction },
                    ...state.items,
                ]
            };
        case transactionsActions.UPDATE_TRANSACTION:
            const updatedTx = formatTransaction({state: wholeState, transactionType: action.data.transactionType, hash: action.data.hash, environment: action.data.environment,
                receipt: action.data.receipt, contractName: action.data.contractName, tx: action.data.tx, functionName: action.data.functionName, error: action.data.error});
            return {
                ...state,
                items: replaceInArray(
                    state.items,
                    item => item.hash === updatedTx.hash,
                    item => ({ ...item, ...updatedTx, createdAt: item.createdAt, constructorArgs: item.constructorArgs })
                )
            };

        case transactionsActions.UPDATE_TRANSACTION_SUCCESS:
            const updatedTransaction = formatTransaction({state: wholeState, transactionType: action.data.transactionType, hash: action.data.hash, environment: action.data.environment,
                receipt: action.data.receipt, contractName: action.data.contractName, contractArgs: action.data.contractArgs, functionName: action.data.functionName, error: action.data.error});
            return {
                ...state,
                items: replaceInArray(
                    state.items,
                    item => item.hash === updatedTransaction.hash,
                    item => ({ ...item, ...updatedTransaction, createdAt: item.createdAt })
                )
            };
        case transactionsActions.UPDATE_TRANSACTION_FAIL:
            const updatedFailTx = formatTransaction({state: wholeState, transactionType: action.data.transactionType, hash: action.data.hash, environment: action.data.environment,
                receipt: action.data.receipt, contractName: action.data.contractName, contractArgs: action.data.contractArgs, functionName: action.data.functionName, error: action.data.error});
            return {
                ...state,
                items: replaceInArray(
                    state.items,
                    item => item.hash === updatedFailTx.hash,
                    item => ({ ...item, ...updatedFailTx, createdAt: item.createdAt})
                )
            };

        default:
            return state;
    }
}
