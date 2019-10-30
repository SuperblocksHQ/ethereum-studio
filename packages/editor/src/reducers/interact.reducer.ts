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
import { interactActions, deployerActions, explorerActions, projectsActions } from '../actions';
import { ProjectItemTypes, IRawAbiDefinition } from '../models';
import { findItemByPath } from './explorerLib';
import { IExplorerState, IProjectState, IInteractState, IDeployedContract } from '../models/state';
import { replaceInArray } from './utils';

const initialState: IInteractState = {
    items: []
};

export default function interactReducer(state = initialState, action: AnyAction, { explorer, projects }: { explorer: IExplorerState, projects: IProjectState })
    : IInteractState {
    switch (action.type) {
        case interactActions.TOGGLE_INTERACT_TREE_ITEM:
            return {
                ...state,
                items: state.items.map((item) => item.id !== item.id ? item : { ...item, opened: !item.opened })
            };
        case interactActions.SET_CONTRACT_DEPLOYED:
            return {
                ...state,
                items: replaceInArray(state.items, i => i.id === action.data.itemId, i => ({ ...i, deployed: action.data.deployed }))
            };
        case projectsActions.SET_ENVIRONMENT_SUCCESS:
        case explorerActions.INIT_EXPLORER_SUCCESS:
        case deployerActions.DEPLOY_SUCCESS:
            const tree: any = explorer.tree;
            const newItems = [];

            // Go through all the contracts folder and extract each contract info
            const contractListFolder = findItemByPath(tree, [ 'build', 'contracts' ], ProjectItemTypes.Folder);
            if (contractListFolder && contractListFolder.children.length > 0) {
                for (const contractFolder of contractListFolder.children) {
                    const jsFile = contractFolder.children.find(file => file.name.includes(`${projects.selectedEnvironment.name}.js`));
                    const addressFile = contractFolder.children.find(file => file.name.includes(`${projects.selectedEnvironment.name}.address`));
                    const deployFile = contractFolder.children.find(file => file.name.includes(`${projects.selectedEnvironment.name}.deploy`));
                    const txFile = contractFolder.children.find(file => file.name.includes(`${projects.selectedEnvironment.name}.tx`));
                    const abiFile = contractFolder.children.find(file => file.name.includes(`.abi`));

                    if ((!jsFile || !jsFile.code) || (!addressFile || !addressFile.code) || (!deployFile || !deployFile.code) || (!txFile || !txFile.code) || (!abiFile || !abiFile.code)) {
                        // TODO - Throw some issue saying that one of the required files is not available and it should be re-deployed
                        return initialState;
                    }

                    const item: IDeployedContract = {
                        contractName: contractFolder.name,
                        id: contractFolder.id,
                        abi: JSON.parse(abiFile.code).sort(compareAbi),
                        address: addressFile.code,
                        deploy: deployFile.code,
                        js: jsFile.code,
                        opened: false,
                        tx: txFile.code,
                        deployed: false
                    };

                    newItems.push(item);
                }
            }
            return {
                ...state,
                items: newItems
            };
        case interactActions.GET_CONSTANT_SUCCESS: {
            return {
                ...state,
                items: replaceInArray(state.items, i => i.id === action.data.deployedContractId, i => ({
                    ...i,
                    abi: i.abi.map((a, index) => {
                        if (index === action.data.abiIndex) {
                            return { ...a, lastResult: handleFunctionResult(action.data.result, a) };
                        } else {
                            return a;
                        }
                    })
                }))
            };
        }
        case interactActions.CLEAR_LAST_RESULT: {
            return {
                ...state,
                items: replaceInArray(state.items, i => i.id === action.data.deployedContractId, i => ({
                    ...i,
                    abi: i.abi.map((a, index) => {
                        if (index === action.data.abiIndex) {
                            return { ...a, lastResult: undefined };
                        } else {
                            return a;
                        }
                    })
                }))
            };
        }
        default:
            return state;
    }
}

function compareAbi(a: IRawAbiDefinition, b: IRawAbiDefinition) {
    const isConstantA = a.constant;
    const isConstantB = b.constant;
    return (isConstantA === isConstantB) ? 0 : isConstantA ? -1 : 1;
}

function handleFunctionResult(result: any, abi: IRawAbiDefinition) {
    if (result instanceof Array) {
        const r = result.map(i => i.toString());
        // in case return type is an array
        if (abi.outputs.length === 1 && abi.outputs[0].type.includes('[]')) {
            return [r];
        } else {
            return r;
        }
    } else {
        return [ result.toString() ];
    }
}
