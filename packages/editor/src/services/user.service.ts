// Copyright 2018 Superblocks AB
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
import { fetchJSON, getAuthToken, getRefreshToken } from './utils/fetchJson';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

function handleErrors(response: Response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export const userService = {
    getUser() {
        return fetchJSON(window.ENV.API_BASE_URL + '/v1/user', {})
            .pipe(
                map(handleErrors),
                switchMap(r => (r.ok ? r.json() : throwError(r.statusText))),
                catchError(err => {
                    console.log('Get user error: ', err);
                    throw Error(err);
                })
            );

    },
    credentialsExist() {
        // Don't try to log in if we don't have any credentials
        if (getAuthToken() || getRefreshToken()) {
            return of(true);
        } else {
            return of(false);
        }
    }
};
