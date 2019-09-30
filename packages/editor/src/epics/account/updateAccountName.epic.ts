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

import { of, empty, Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import { panesActions, accountActions } from '../../actions';
import { withLatestFrom, switchMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ProjectItemTypes, IProjectItem } from '../../models';
import { findItemByPath } from '../../reducers/explorerLib';
import { IAccount } from '../../models/state';

// if (!this.form.name.match(/^([a-zA-Z0-9-_]+)$/)) {
//     alert(
//         'Illegal account name. Only A-Za-z0-9, dash (-) and underscore (_) allowed.'
//     );
//     return;
// }

// if (this.props.item.getName() != this.form.name) {
//     // Name is changing, check for clash.
//     if (
//         project
//             .getHiddenItem('accounts')
//             .getByName(this.form.name)
//     ) {
//         alert('Error: An account with that name already exists.');
//         cb(1);
//         return;
//     }
// }

export const updateAccountNameEpic = (action$: AnyAction, state$: any) => action$.pipe(
    ofType(accountActions.UPDATE_ACCOUNT_NAME),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const newAccountName: string = action.data.newName;
        const account: IAccount = action.data.account;
        const dappFileData = state.projects.dappFileData;
        const dappFileItem: Nullable<IProjectItem> = findItemByPath(state.explorer.tree, [ 'dappfile.json' ], ProjectItemTypes.File);

        if (dappFileItem != null) {
            const dappFileAccount = dappFileData.accounts.find((a: any) => a.name === account.name);
            const index = dappFileData.accounts.indexOf(dappFileAccount);

            dappFileAccount.name = newAccountName;
            dappFileData.accounts[index] = dappFileAccount;

            return [panesActions.saveFile(dappFileItem.id, JSON.stringify(dappFileData, null, 4)), accountActions.updateAccountNameSuccess(account.name, newAccountName)];
        } else {
            return empty();
        }
    }),
    catchError((err: any) => {
        console.log('Error while updating the account name: ', err);
        return of(accountActions.UPDATE_ACCOUNT_NAME_FAIL);
    })
);
