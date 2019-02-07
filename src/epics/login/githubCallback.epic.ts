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

import { empty, from } from 'rxjs';
import { ofType, Epic } from 'redux-observable';
import queryString from 'query-string';
import { appActions, authActions } from '../../actions';
import { catchError, map, tap, switchMap, concat } from 'rxjs/operators';
import { authService } from '../../services/auth.service';
import { userService } from '../../services/user.service';

const getGithubCodeFromQuery = () => {
    return queryString.parse(location.search);
};

export const githubCallback: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(appActions.APP_START),
    map(() => getGithubCodeFromQuery()),
    switchMap((data: any) => {
        if (data.code) {
            return from(authService.githubAuth(data))
                .pipe(
                    concat(from(userService.getUser())),
                    map(authActions.loginSuccess)
                );
        } else {
            return empty();
        }
    }),
    catchError((err: any) => {
        console.log('There was an error login you in', err);
        return empty();
    }));
