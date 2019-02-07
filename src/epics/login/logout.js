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
import {withLatestFrom, tap, catchError} from "rxjs/operators";
import {empty} from "rxjs";
import { superFetch } from "../../services/utils/superFetch";

// destroy JWT token locally
const logout = (action$, state$) => action$.pipe(
    ofType(loginActions.LOGOUT),
    withLatestFrom(state$),
    tap(() => console.log("loggin' out!")),
    tap(() => superFetch.clearAuthToken()),
    catchError((err) => {
        console.log("Error", err);
        return empty()
    })
);

export default logout;
