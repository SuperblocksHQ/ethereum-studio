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

import { of, empty } from 'rxjs';
import { ofType } from 'redux-observable';
import { panesActions, accountActions } from '../../actions';
import { withLatestFrom, switchMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ProjectItemTypes, IProjectItem } from '../../models';
import { findItemByPath } from '../../reducers/explorerLib';
import { IAccount, IOpenWallet } from '../../models/state';

export const createNewAccountEpic = (action$: AnyAction, state$: any) => action$.pipe(
    ofType(accountActions.CREATE_NEW_ACCOUNT),
    withLatestFrom(state$),
    switchMap(([action, state]) => {

        const dappFileData = state.projects.dappfileData;
        const dappFileItem: Nullable<IProjectItem> = findItemByPath(state.explorer.tree, [ 'dappfile.json' ], ProjectItemTypes.File);
        if (dappFileItem != null) {
            const { accounts } = state.projects;
            const newAccount = {
                name: `Account${accounts.length + 1}`,
                address: '0x0',
                _environments: [{
                    name: 'browser',
                    data: {
                        wallet: 'development',
                        index: accounts.length + 1
                    }
                }, {
                    name: 'custom',
                    data: {
                        wallet: 'private',
                        index: accounts.length + 1
                    }
                }]
            };

            dappFileData.accounts.push(newAccount);
            return [panesActions.saveFile(dappFileItem.id, JSON.stringify(dappFileData, null, 4)), accountActions.createNewAccountSuccess()];
        } else {
            return empty();
        }
    }),
    catchError((err: any) => {
        console.log('Error while creating the new account: ', err);
        return of(accountActions.UPDATE_ACCOUNT_NAME_FAIL);
    })
);
