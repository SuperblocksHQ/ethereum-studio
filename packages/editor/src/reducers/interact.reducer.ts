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
import { transactionsActions, interactActions } from '../actions';
import { IInteractState, ITransaction, IDeployedContract, TransactionType } from '../models';
// import { updateItemInTree } from './interactLib';

const initialState: IInteractState = {
    items: []
};

export default function interactReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        // case interactActions.TOGGLE_INTERACT_TREE_ITEM:
        //     return {
        //         ...state,
        //         tree: updateItemInTree(state.tree, action.data.id, (i: IProjectItem) => ({ ...i, opened: !i.opened }))[0]
        //     };
        case transactionsActions.ADD_TRANSACTION:
            const transaction = <ITransaction> action.data.transaction;

            if (transaction.type !== TransactionType.Deploy) {
                return { ...state };
            }

            const item = <IDeployedContract> {
                contractAddress: transaction.to,
                contractName: transaction.contractName
            };

            return {
                ...state,
                items: [
                    {...item},
                    ...state.items,
                ]
            };

            // TODO - We would need to update the info in certain cases, per example when re-deploying the same contract to a different address
        // case transactionsActions.UPDATE_TRANSACTION:
        //     return {
        //         ...state,
        //         items: replaceInArray(
        //             state.items,
        //             item => item.hash === action.data.transaction.hash,
        //             item => ({...item, ...action.data.transaction, createdAt: item.createdAt})
        //         )
        //     };
        default:
            return state;
    }
}
