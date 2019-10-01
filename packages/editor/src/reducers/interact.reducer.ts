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
import { interactActions, deployerActions, explorerActions } from '../actions';
import { IInteractState, ProjectItemTypes, IDeployedContract } from '../models';
import { findItemByPath } from './explorerLib';
import { IExplorerState, IProjectState } from '../models/state';

const initialState: IInteractState = {
    items: []
};

export default function interactReducer(state = initialState, action: AnyAction, { explorer, projects }: { explorer: IExplorerState, projects: IProjectState }) {
    switch (action.type) {
        case interactActions.TOGGLE_INTERACT_TREE_ITEM:
            return {
                ...state
            };
        case explorerActions.INIT_EXPLORER_SUCCESS:
        case deployerActions.DEPLOY_SUCCESS:
            const tree: any = explorer.tree;
            const newItems = [];

            // Things that we need here:
            // 1. ABI
            // 2. Contract deploy address (got from here)
            // 3. Contract name which already have an Abi

            // Go through all the contracts folder and extract each contract info
            // let contractJs = '';
            const contractListFolder = findItemByPath(tree, [ 'build', 'contracts' ], ProjectItemTypes.Folder);
            if (contractListFolder && contractListFolder.children.length > 0) {
                for (const contractFolder of contractListFolder.children) {
                    const item: IDeployedContract = {
                        contractName: contractFolder.name,
                        id: contractFolder.id,
                        abi: '',
                        address: '0x0',
                        contractAddress: '0x0',
                        deploy: '',
                        js: '',
                        opened: false,
                        tx: ''
                    };

                    newItems.push(item);

                    // const contractFiles = contractFolder.children.filter((file) => file.name.includes(`${projects.selectedEnvironment.name}.js`));
                    // for (const file of contractFiles) {
                    //     contractJs += file.code + '\n';
                    // }
                }
            }

            return {
                ...state,
                items: [...state.items, ...newItems]
            };
        default:
            return state;
    }
}
