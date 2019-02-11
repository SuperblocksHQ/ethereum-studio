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
import { fetchJSON } from './utils/fetchJson';
import { map, switchMap, catchError } from 'rxjs/operators';

function handleErrors(response: Response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export const userService = {
    getUser() {
        return fetchJSON(process.env.REACT_APP_API_BASE_URL + '/user', {})
            .pipe(
                map(handleErrors),
                switchMap(response => response.json()),
                catchError(error => {
                    console.log('Get user error: ', error);
                    throw error;
                })
            );

    }
};
