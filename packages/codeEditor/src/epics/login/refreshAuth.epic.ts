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

import { ofType } from 'redux-observable';
import { authActions } from '../../actions';
import { withLatestFrom, catchError, switchMap, takeWhile, map } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { userService, authService } from '../../services';
import { EMPTY, of, timer } from 'rxjs';
import { ITokenExpiration } from '../../models';

export const refreshAuthStart = (action$: AnyAction, state$: any) => action$.pipe(
    ofType(authActions.REFRESH_AUTH_START),
    withLatestFrom(state$),
    // currently the TTL of AuthToken is 120 sec, so refresh every 110 sec
    map(() => authService.getAuthTokenExpiration()),
    switchMap((authToken: ITokenExpiration) => timer(authToken.nextRefresh * 1000, authToken.refreshInterval * 1000)
        .pipe(
            takeWhile(() => state$.value.auth.isAuthenticated),
            switchMap(() => userService.credentialsExist()
                .pipe(
                    switchMap(() => authService.refreshAuth()
                        .pipe(
                            switchMap((token) => of(authActions.refreshAuthSuccess(token))),
                            catchError((error) => [authActions.refreshAuthFail(error.message)])
                        )
                    )
                )
            )
        )
    ),
    catchError(() => EMPTY)
);

