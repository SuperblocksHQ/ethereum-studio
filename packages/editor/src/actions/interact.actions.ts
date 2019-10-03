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

import { IDeployedContract, IRawAbiDefinition } from '../models';

export const interactActions = {

    TOGGLE_INTERACT_TREE_ITEM: 'TOGGLE_INTERACT_TREE_ITEM',
    toggleInteractTreeItem(id: string) {
        return {
            type: interactActions.TOGGLE_INTERACT_TREE_ITEM,
            data: { id }
        };
    },

    INTERACT_WITH_CONTRACT: 'INTERACT_WITH_CONTRACT',
    interactWithContract(deployedContract: IDeployedContract, rawAbiDefinition: IRawAbiDefinition) {
        return {
            type: interactActions.INTERACT_WITH_CONTRACT,
            data: { deployedContract, rawAbiDefinition }
        };
    },

    INTERACT_WITH_CONTRACT_SUCCESS: 'INTERACT_WITH_CONTRACT_SUCCESS',
    interactWithContractSuccess(result: any) {
        return {
            type: interactActions.INTERACT_WITH_CONTRACT_SUCCESS,
            data: { result }
        };
    },

    INTERACT_WITH_CONTRACT_FAIL: 'INTERACT_WITH_CONTRACT_FAIL',
    interactWithContractFail(error: any) {
        return {
            type: interactActions.INTERACT_WITH_CONTRACT_FAIL,
            data: error
        };
    },
};

