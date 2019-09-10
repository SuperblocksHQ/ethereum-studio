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
import { authActions, contractConfigurationActions } from '../../actions';
import { withLatestFrom, switchMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';

// if (this.state.name.length === 0) {
//     alert('Error: Missing name.');
//     return;
// }

// if (!this.state.name.match(/^([a-zA-Z0-9-_]+)$/) || this.state.name.length > 255) {
//     alert('Illegal contract name. Only A-Za-z0-9, dash (-) and underscore (_) allowed. Max 255 characters.');
//     return;
// }

// // Check all arguments so that they are valid.
// for (const arg of this.state.args) {
//     if (arg.type === ContractArgTypes.contract) {
//         // Check so that the contract actually exists.
//         if (this.getOtherContracts().indexOf(arg.value) === -1) {
//             alert(`Error: Contract arguments are not valid, missing: "${arg.value}".`);
//             return;
//         }
//     }
// }

export const saveContractConfig = (action$: AnyAction, state$: any) => action$.pipe(
    ofType(contractConfigurationActions.SAVE_CONTRACT_CONFIGURATION),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const contractConfig = action.data.contractConfig;
        return empty();
    }),
    catchError((err: any) => {
        console.log('Error while logging in via GitHub: ', err);
        return of(authActions.loginFail(err));
    })
);
