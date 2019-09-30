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

import { TransactionType } from '../models';

export const transactionsActions = {
    ADD_TRANSACTION: 'ADD_TRANSACTION',
    addTransaction(transactionType: TransactionType, hash?: string, res?: any, contractName?: string, tx?: any) {
        return {
            type: transactionsActions.ADD_TRANSACTION,
            data: {
                transactionType, hash, res, contractName, tx
            }
        };
    },
    UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
    updateTransaction(transactionType: TransactionType, hash?: string, res?: any, contractName?: string, tx?: any) {
        return {
            type: transactionsActions.UPDATE_TRANSACTION,
            data: {
                transactionType, hash, res, contractName, tx
            }
        };
    },
};
