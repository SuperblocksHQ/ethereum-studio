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

import { IDeployedContract } from '../models/state';

export const interactActions = {

    TOGGLE_INTERACT_TREE_ITEM: 'TOGGLE_INTERACT_TREE_ITEM',
    toggleInteractTreeItem(id: string) {
        return {
            type: interactActions.TOGGLE_INTERACT_TREE_ITEM,
            data: { id }
        };
    },

    SET_CONTRACT_DEPLOYED: 'SET_CONTRACT_DEPLOYED',
    setContactDeployed(itemId: string, deployed: boolean) {
        return {
            type: interactActions.SET_CONTRACT_DEPLOYED,
            data: { itemId, deployed }
        };
    },

    GET_CONSTANT: 'GET_CONSTANT',
    getConstant(abiIndex: number, deployedContract: IDeployedContract, args?: any[]) {
        return {
            type: interactActions.GET_CONSTANT,
            data: { abiIndex, deployedContract, args }
        };
    },

    GET_CONSTANT_SUCCESS: 'GET_CONSTANT_SUCCESS',
    getConstantSuccess(deployedContractId: string, abiIndex: number, result: any) {
        return {
            type: interactActions.GET_CONSTANT_SUCCESS,
            data: { deployedContractId, abiIndex, result }
        };
    },

    CLEAR_LAST_RESULT: 'INTERACT_ACTIONS.CLEAR_LAST_RESULT',
    clearLastResult(deployedContractId: string, abiIndex: number) {
        return {
            type: interactActions.CLEAR_LAST_RESULT,
            data: { deployedContractId, abiIndex }
        };
    },

    SEND_TRANSACTION: 'SEND_TRANSACTION',
    sendTransaction(deployedContract: IDeployedContract, rawAbiDefinitionName: string, abiIndex: number, args?: any[], value?: number) {
        return {
            type: interactActions.SEND_TRANSACTION,
            data: { deployedContract, rawAbiDefinitionName, abiIndex, args, value }
        };
    },

    SEND_TRANSACTION_SUCCESS: 'SEND_TRANSACTION_SUCCESS',
    sendTransactionSuccess(result: any) {
        return {
            type: interactActions.SEND_TRANSACTION_SUCCESS,
            data: { result }
        };
    },

    SEND_TRANSACTION_FAIL: 'SEND_TRANSACTION_FAIL',
    sendTransactionFail(error: any) {
        return {
            type: interactActions.SEND_TRANSACTION_FAIL,
            data: error
        };
    }
};
