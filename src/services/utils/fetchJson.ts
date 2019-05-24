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

export function getAuthToken() {
    return localStorage.getItem('authToken') || null;
}

export function getRefreshToken() {
    return localStorage.getItem('refreshToken') || null;
}

function getAnonymousToken() {
    return localStorage.getItem('anonymousToken') || null;
}

function getTokenHeaders() {
    const headers: any = {};
    if (getAuthToken()) {
        headers.Authorization = `Bearer ${getAuthToken()}`;
    }
    if (getAnonymousToken()) {
        headers['x-anonymous-token'] = getAnonymousToken();
    }
    return headers;
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
            ...getTokenHeaders(),
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(params.body)
    }));
}

fetchJSON.setAuthTokens = (authToken: string, refreshToken: string) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('refreshToken', refreshToken);
};

fetchJSON.setAuthToken = (token: string) => {
    if (token) {
        localStorage.setItem('authToken', token);
    }
};

fetchJSON.clearAuthTokens = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
};

fetchJSON.setAnonymousToken = (token: string) => {
    localStorage.setItem('anonymousToken', token);
};

fetchJSON.clearAnonymousToken = () => {
    localStorage.removeItem('anonymousToken');
};
