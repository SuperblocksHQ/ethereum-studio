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

import { switchMap, withLatestFrom } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { explorerActions, panesActions } from '../../actions';
import { empty } from 'rxjs';
import { findItemByPath, traverseTree } from '../../reducers/explorerLib';
import { IContractConfiguration, IProjectItem, ProjectItemTypes } from '../../models';
import { isSolitidyFile } from '../../reducers/utils/fileUtils';
import { AnyAction } from 'redux';

function pathToString(path: string[]) {
    return '/' + path.join('/');
}

export const updateDappfileEpic = (action$: AnyAction, state$: any) => action$.pipe(
    ofType(explorerActions.UPDATE_DAPPFILE),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const files = state.explorer.tree;
        const dappFileData = state.projects.dappFileData;
        const dappFileItem: Nullable<IProjectItem> = findItemByPath(files, [ 'dappfile.json' ], ProjectItemTypes.File);

        if (dappFileItem !== null) {
            const newContracts: IContractConfiguration[] = [];
            traverseTree(files, (item, path) => {
                if (isSolitidyFile(item)) {
                    if (action.data.id === item.id) {
                        const contractConfig = dappFileData.contracts.find((contract: IContractConfiguration) => (contract.name === item.name.replace('.sol', '')));

                        const newContract = {
                            source: pathToString(path()),
                            name: item.name.replace('.sol', ''),
                            args: contractConfig.args,
                            value: contractConfig.value
                        };
                        newContracts.push(newContract);
                    } else {
                        const contractConfig = dappFileData.contracts.find((contract: IContractConfiguration) => (contract.name === item.name.replace('.sol', '') && contract.source === pathToString(path())));
                        if (contractConfig) {
                            newContracts.push(contractConfig);
                        } else {
                            const newContract = {
                                source: pathToString(path()),
                                name: item.name.replace('.sol', ''),
                                args: [],
                                value: ''
                            };
                            newContracts.push(newContract);
                        }
                    }
                }
            });

            dappFileData.contracts = newContracts;
            return [panesActions.saveFile(dappFileItem.id, JSON.stringify(dappFileData, null, 4)), explorerActions.updateDappfileSuccess()];
        } else {
            return empty();
        }
    })
);
