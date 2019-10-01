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

import { IAccount } from '../models/state';

export const accountActions = {

    OPEN_ACCOUNT_CONFIGURATION: 'OPEN_ACCOUNT_CONFIGURATION',
    openAccountConfig(account: IAccount) {
        return {
            type: accountActions.OPEN_ACCOUNT_CONFIGURATION,
            data: { account }
        };
    },

    CLOSE_ACCOUNT_CONFIGURATION: 'CLOSE_ACCOUNT_CONFIGURATION',
    closeAccountConfig() {
        return {
            type: accountActions.CLOSE_ACCOUNT_CONFIGURATION
        };
    },

    UPDATE_ACCOUNT_NAME: 'UPDATE_ACCOUNT_NAME',
    updateAccountName(account: IAccount, newName: string) {
        return {
            type: accountActions.UPDATE_ACCOUNT_NAME,
            data: { account, newName }
        };
    },

    UPDATE_ACCOUNT_BALANCE: 'ACCOUNT_ACTIONS.UPDATE_ACCOUNT_BALANCE',
    updateAccountBalance(accountName: string, balance: Nullable<string>) {
        return {
            type: accountActions.UPDATE_ACCOUNT_BALANCE,
            data: { accountName, balance }
        };
    },

    CREATE_NEW_ACCOUNT: 'CREATE_NEW_ACCOUNT',
    createNewAccount() {
        return {
            type: accountActions.CREATE_NEW_ACCOUNT,
        };
    },

    CREATE_NEW_ACCOUNT_SUCCESS: 'CREATE_NEW_ACCOUNT_SUCCESS',
    createNewAccountSuccess(dappFileData: any) {
        return {
            type: accountActions.CREATE_NEW_ACCOUNT_SUCCESS,
            data: { updatedDappFileData: dappFileData }
        };
    },

    CREATE_NEW_ACCOUNT_FAIL: 'CREATE_NEW_ACCOUNT_FAIL',
    createNewAccountFail() {
        return {
            type: accountActions.CREATE_NEW_ACCOUNT_FAIL
        };
    },

    DELETE_ACCOUNT: 'DELETE_ACCOUNT',
    deleteAccount(accountName: string) {
        return {
            type: accountActions.DELETE_ACCOUNT,
            data: { accountName }
        };
    },

    DELETE_ACCOUNT_SUCCESS: 'DELETE_ACCOUNT_SUCCESS',
    deleteAccountSuccess(dappFileData: any) {
        return {
            type: accountActions.DELETE_ACCOUNT_SUCCESS,
            data: { updatedDappFileData: dappFileData }
        };
    },

    CHANGE_ENVIRONMENT: 'CHANGE_ENVIRONMENT',
    changeEnvironment(environmentName: string) {
        return {
            type: accountActions.CHANGE_ENVIRONMENT,
            data: { environmentName }
        };
    },

    UPDATE_ADDRESS: 'ACCOUNT_ACTIONS.UPDATE_ADDRESS',
    updateAddress(address: string) {
        return {
            type: accountActions.UPDATE_ADDRESS,
            data: { address }
        };
    }
};
