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

import {empty, from, pipe} from 'rxjs';
import { ofType } from 'redux-observable';
import { appActions, authActions } from '../../actions';
import {withLatestFrom, tap, catchError, map, flatMap} from 'rxjs/operators';
import { AnyAction } from 'redux';
import { userService } from '../../services';

// TODO - Naive implementation. Make sure if we get a 401 we try to get a new token with the refresh token.
export const silentLogin = (action$: AnyAction, state$: any) => action$.pipe(
    ofType(appActions.APP_START),
    withLatestFrom(state$),
    flatMap(() => from(userService.getUser())),
    pipe(
        map(authActions.loginSuccess),
        tap(() => console.log('Silent login success'))
    ),
    catchError((err: any) => {
        console.log(err);
        return empty();
    }
));
