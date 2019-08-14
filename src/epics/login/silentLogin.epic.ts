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
import { appActions, authActions, userActions } from '../../actions';
import { withLatestFrom, tap, catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { userService, authService } from '../../services';
import { of } from 'rxjs';

export const silentLogin = (action$: AnyAction, state$: any) => action$.pipe(
    ofType(appActions.APP_START),
    withLatestFrom(state$),
    switchMap(() => of(userService.credentialsExist())
        .pipe(
            tap((value) => {
              if (!value) { throw new Error('No credentials available!'); }
            }),
            switchMap(() => userService.getUser()
                .pipe(
                    tap(() => console.log('Silent login success using authToken')),
                    mergeMap((data) => [authActions.loginSuccess(data), authActions.refreshAuthStart(), userActions.getProjectList()]),
                    catchError((err: any) => {
                            console.log('Unable to login using authToken: ', err.message);
                            return authService.refreshAuth()
                                .pipe(
                                    tap((e) => console.log(e)),
                                    switchMap(() => userService.getUser()
                                        .pipe(
                                            tap(() => console.log('Silent login success using refreshToken')),
                                            mergeMap((data) => [authActions.loginSuccess(data), authActions.refreshAuthStart(), userActions.getProjectList()]),
                                            catchError((error) => [authActions.silentLoginFail(error.message)])
                                        )
                                    )
                                );
                        }
                    )
                )
            )
        )
    ),
    catchError((error) => [authActions.silentLoginFail(error.message)])
);
