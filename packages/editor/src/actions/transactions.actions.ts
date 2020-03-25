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
    addTransaction(transactionType: TransactionType, hash?: string, environment?: string, receipt?: any, contractName?: string, tx?: any, contractArgs?: any[], functionName?: string) {
        return {
            type: transactionsActions.ADD_TRANSACTION,
            data: {
                transactionType, hash, environment, receipt, contractName, tx, contractArgs, functionName
            }
        };
    },
    UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
    updateTransaction(transactionType: TransactionType, hash?: string, environment?: string, receipt?: any, contractName?: string, tx?: any, contractArgs?: any[], functionName?: string) {
        return {
            type: transactionsActions.UPDATE_TRANSACTION,
            data: {
                transactionType, hash, environment, receipt, contractName, tx, contractArgs, functionName
            }
        };
    },

    UPDATE_TRANSACTION_SUCCESS: 'UPDATE_TRANSACTION_SUCCESS',
    updateTransactionSuccess(transactionType: TransactionType, hash?: string, environment?: string, receipt?: any, contractName?: string, tx?: any, contractArgs?: any[], functionName?: string) {
        return {
            type: transactionsActions.UPDATE_TRANSACTION_SUCCESS,
            data: {
                transactionType, hash, environment, receipt, contractName, tx, contractArgs, functionName
            }
        };
    },

    UPDATE_TRANSACTION_FAIL: 'UPDATE_TRANSACTION_FAIL',
    updateTransactionFail(error: any) {
        return {
            type: transactionsActions.UPDATE_TRANSACTION_FAIL,
            data: error
        };
    },

    CHECK_SENT_TRANSACTIONS: 'CHECK_SENT_TRANSACTIONS',
    checkSentTransactions(endpoint: string, contractName: string) {
        return {
            type: transactionsActions.CHECK_SENT_TRANSACTIONS,
            data: { endpoint, contractName }
        };
    },
    CHECK_SENT_TRANSACTIONS_FAIL: 'CHECK_SENT_TRANSACTIONS_FAIL',
    checkSentTransactionsFail(err: any) {
        return {
            type: transactionsActions.CHECK_SENT_TRANSACTIONS_FAIL,
            data: { err }
        };
    }
};
