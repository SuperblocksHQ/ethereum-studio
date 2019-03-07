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

import { interval, empty, of } from 'rxjs';
import { switchMap,  takeUntil, catchError } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { projectsActions } from '../../actions';
import { walletService } from '../../services';

export const updateAccountBalanceEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.LOAD_PROJECT_SUCCESS),
    switchMap(() => {
        return interval(3000).pipe(
            takeUntil(action$.ofType(projectsActions.LOAD_PROJECT)),
            switchMap(() => {
                const endpoint = state$.value.projects.selectedEnvironment.endpoint;
                const selectedAccount = state$.value.projects.selectedAccount;

                if (selectedAccount.name && selectedAccount.address) {
                    return walletService.fetchBalance(endpoint, selectedAccount.address).pipe(
                        switchMap(balance => {
                            if (selectedAccount.balance !== balance) { // little optimization to keep redux log cleaner
                                return of(projectsActions.updateAccountBalance(balance));
                            } else {
                                return empty();
                            }
                        }),
                        catchError(() => [ /*projectsActions.updateAccountBalance('')*/ ])
                    );
                } else {
                    return empty();
                }
            })
        );
    })
);

