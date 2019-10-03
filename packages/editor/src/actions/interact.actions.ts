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

    GET_CONSTANT: 'GET_CONSTANT',
    getConstant(deployedContract: IDeployedContract, rawAbiDefinition: IRawAbiDefinition) {
        return {
            type: interactActions.GET_CONSTANT,
            data: { deployedContract, rawAbiDefinition }
        };
    },

    GET_CONSTANT_SUCCESS: 'GET_CONSTANT_SUCCESS',
    getConstantSuccess(result: any) {
        return {
            type: interactActions.GET_CONSTANT_SUCCESS,
            data: { result }
        };
    },

    GET_CONSTANT_FAIL: 'GET_CONSTANT_FAIL',
    getConstantFail(error: any) {
        return {
            type: interactActions.GET_CONSTANT_FAIL,
            data: error
        };
    },
};

