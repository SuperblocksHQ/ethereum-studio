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

import {ofType} from "redux-observable";
import {loginActions} from "../../actions";
import {withLatestFrom, tap, switchMap, catchError} from "rxjs/operators";
import PopupWindow from "../../components/login/github/PopupWindow";
import {empty, of} from "rxjs";

const githubLogin = (action$, state$) => action$.pipe(
    ofType(loginActions.GITHUB_LOGIN),
    withLatestFrom(state$),
    switchMap(() => {
        // @TODO env variables
        const scope = 'user:email';
        const client_id = 'b6117ba12bf5f306cdad';
        const redirect_uri = 'http://localhost:3000/github/callback';
        return of(toQuery({
            client_id:  client_id,
            scope,
            redirect_uri: redirect_uri,
        }))
            .pipe(
                tap(search => PopupWindow.open(
                    'github-oauth-authorize',
                    `https://github.com/login/oauth/authorize?${search}`,
                    { height: 1000, width: 600 }
                ))
            )
    }),
    catchError((err) => {
        console.log("Error: ", err);
        return empty()
        })
    );

const toQuery = (params, delimiter = '&') => {
    const keys = Object.keys(params);

    return keys.reduce((str, key, index) => {
        let query = `${str}${key}=${params[key]}`;

        if (index < (keys.length - 1)) {
            query += delimiter;
        }
        return query;
    }, '');
};

export default githubLogin;
