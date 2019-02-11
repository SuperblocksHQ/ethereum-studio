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

import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export function getAuthToken() {
    return localStorage.getItem('authToken') || null;
}

export interface IRequestParams {
    body?: any;
    headers?: any;
    method?: string;
}

export function fetchJSON(url: string, params: IRequestParams) {
    return from(fetch(url, {
        method: params.method || 'GET',
        headers: {
            ...params.headers,
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(params.body)
    }));
}

fetchJSON.setAuthToken = (token: string) => {
    localStorage.setItem('authToken', token);
};

fetchJSON.clearAuthToken = () => {
    localStorage.removeItem('authToken');
};
