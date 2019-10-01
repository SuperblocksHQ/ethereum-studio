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
import { IInteractState, ProjectItemTypes, IDeployedContract, IProjectItem } from '../models';
import { findItemByPath } from './explorerLib';
import { IExplorerState, IProjectState } from '../models/state';

const initialState: IInteractState = {
    items: []
};

export default function interactReducer(state = initialState, action: AnyAction, { explorer, projects }: { explorer: IExplorerState, projects: IProjectState }) {
    switch (action.type) {
        case interactActions.TOGGLE_INTERACT_TREE_ITEM:
            return {
                ...state,
                items: state.items.map((item) => item.id !== item.id ? item : { ...item, opened: !item.opened })
            };
        case explorerActions.INIT_EXPLORER_SUCCESS:
        case deployerActions.DEPLOY_SUCCESS:
            const tree: any = explorer.tree;
            const newItems = [];

            // Go through all the contracts folder and extract each contract info
            const contractListFolder = findItemByPath(tree, [ 'build', 'contracts' ], ProjectItemTypes.Folder);
            if (contractListFolder && contractListFolder.children.length > 0) {
                for (const contractFolder of contractListFolder.children) {
                    const jsFile = contractFolder.children.find((file) => file.name.includes(`${projects.selectedEnvironment.name}.js`));
                    const addressFile = contractFolder.children.find((file) => file.name.includes(`${projects.selectedEnvironment.name}.address`));
                    const deployFile = contractFolder.children.find((file) => file.name.includes(`${projects.selectedEnvironment.name}.deploy`));
                    const txFile = contractFolder.children.find((file) => file.name.includes(`${projects.selectedEnvironment.name}.tx`));
                    const abiFile = contractFolder.children.find((file) => file.name.includes(`.abi`));

                    if ((!jsFile || !jsFile.code) || (!addressFile || !addressFile.code) || (!deployFile || !deployFile.code) || (!txFile || !txFile.code) || (!abiFile || !abiFile.code)) {
                        // TODO - Throw some issue saying that one of the required files is not available and it should be re-deployed
                        return state;
                    }

                    const item: IDeployedContract = {
                        contractName: contractFolder.name,
                        id: contractFolder.id,
                        abi: JSON.parse(abiFile.code),
                        address: addressFile.code,
                        deploy: deployFile.code,
                        js: jsFile.code,
                        opened: false,
                        tx: txFile.code
                    };

                    newItems.push(item);
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
