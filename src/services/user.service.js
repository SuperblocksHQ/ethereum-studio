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
import { superFetch } from './utils/superFetch';

export const userService = {

    async getUser() {
        return superFetch(process.env.REACT_APP_API_BASE_URL + '/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(handleErrors)
            .then(response => response.json())
            .catch(error => console.log('Get user error: ', error));

    }
};

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
