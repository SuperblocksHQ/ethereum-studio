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
import { switchMap,  catchError, map } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { accountActions, projectsActions } from '../../actions';
import { walletService } from '../../services';
import { IAccountConfigState } from '../../models/state';
import Networks from '../../networks';

export const fetchBalanceEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(accountActions.CHANGE_ENVIRONMENT, accountActions.OPEN_ACCOUNT_CONFIGURATION, projectsActions.OPEN_WALLET_SUCCESS),
    switchMap(() => {
        const accountConfigState: IAccountConfigState = state$.value.accountsConfig;
        const account = accountConfigState.accountInfo;
        if (!account || !account.address || !accountConfigState.environment) {
            return empty();
        }

        return walletService.fetchBalance(Networks[accountConfigState.environment].endpoint, account.address).pipe(
            map(balance => accountActions.updateAccountBalance(account.name, balance)),
            catchError(() => [ accountActions.updateAccountBalance(account.name, null) ])
        );
    })
);

