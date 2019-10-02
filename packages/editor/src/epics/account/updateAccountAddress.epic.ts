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

import { empty } from 'rxjs';
import { ofType } from 'redux-observable';
import { panesActions, accountActions } from '../../actions';
import { withLatestFrom, switchMap } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { UpdateAccountResults } from '../../models/state';

export const updateAccountAddressEpic = (action$: AnyAction, state$: any) => action$.pipe(
    ofType(accountActions.UPDATE_ADDRESS),
    withLatestFrom(state$),
    switchMap(([, state]) => {
        if (state.accountsConfig.updateAccountResult === UpdateAccountResults.IllegalAddress) {
            alert('Illegal Ethereum account address. Must be on format: 0xabcdef0123456789, 42 characters in total.');
            return empty();
        }

        if (state.accountsConfig.dappFileCodeToSave) {
            return [ panesActions.saveFile(state.accountsConfig.dappFileId, state.accountsConfig.dappFileCodeToSave) ];
        } else {
            return empty();
        }
    })
);
