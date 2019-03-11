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
import { IExplorerState } from '../models/state';
import { findItemById, findItemByPath } from './explorerLib';
import { getCompilerOutputPath as getContractBuildPath } from './compilerLib';
import { ProjectItemTypes, IProjectItem } from '../models';
import sha256 from 'crypto-js/sha256';
import { deployerActions } from '../actions';

const initialState = {
    needsCompilation: false,
    contractArgs: [],
    buildFiles: [],
    outputPath: []
};

function isCompilationFresh(buildFiles: IProjectItem[], contractItem: IProjectItem): boolean {
    for (const ext of ['.abi', '.hash', '.meta', '.bin']) {
        // TODO: think of passing contract name!
        if (!buildFiles.find(i => i.name.toLowerCase().endsWith(ext))) {
            return false;
        }
    }

    const hashFile = <IProjectItem>buildFiles.find(i => i.name.endsWith('.hash'));

    return sha256(contractItem.code || '').toString() === hashFile.code;
}

export default function deployerReducer(state = initialState, action: AnyAction, { explorer }: { explorer: IExplorerState }) {
    switch (action.type) {
        case deployerActions.DEPLOY_CONTRACT: {
            if (!explorer.tree) {
                return state;
            }

            // 1. build arguments
            // const contractArgs = [];

            // 2. check if compilation is fresh
            const findItemResult = findItemById(explorer.tree, action.data.id);
            if (!findItemResult.item) {
                return state;
            }
            const outputPath = getContractBuildPath(findItemResult.path);
            const contractBuildFolder = findItemByPath(explorer.tree, outputPath, ProjectItemTypes.Folder);
            if (!contractBuildFolder || !isCompilationFresh(contractBuildFolder.children, findItemResult.item)) {
                return {
                    ...state,
                    needsCompilation: true,
                    buildFiles: []
                };
            } else {
                return {
                    ...state,
                    needsCompilation: false,
                    // we know here that file already exists
                    buildFiles: contractBuildFolder.children,
                    outputPath
                };
            }

            // 3. load all files from 'build/contracts/[contract_name]' folder

            // 4. build bin file - need output from outside

            // 5. check deploy???- need output from outside

            // 6. do deploy

        }
        default:
            return state;
    }
}
