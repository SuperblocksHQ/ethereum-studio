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



/**
 * A really naive way to store the token in memory (so we don't have to access the LocalStorage
 * every time we try to make an api call)
 */
let authToken = null;
function getAuthToken() {
    if (authToken) {
        return ;
    } else {
        return localStorage.getItem('authToken');
    }
}

export const superFetch = function (url, params = {}) {
    params.headers = Object.assign(
        {},
        headerDict(params.headers),
        // Default custom headers
        {
            Authorization: `Bearer ${getAuthToken()}`
        }
    );
    params.credentials = 'same-origin';

    if (params.body
        && typeof params.body !== 'string'
        && !(params.body instanceof FormData)) {

            let body = new FormData();
            Object.entries(params.body).forEach(([k, v]) => body.append(k, v));

            params.body = body;
    }

    return fetch(url, params);
}

const headerDict = function (headers) {
    let dict = {};

    if (headers instanceof Headers) {
        for (let [key, value] of headers.entries()) {
            dict[key] = value;
        }
    }else{
        dict = headers;
    }

    return dict;
}

superFetch.setAuthToken = function (token) {
    localStorage.setItem('authToken', token);
}

superFetch.clearAuthToken = function () {
    jwtToken = null;
    localStorage.removeItem('authToken');
}

superFetch.throwErrors = function (response) {
    if (!response.ok) {
        const err = new Error(response.statusText);
        err.response = response;
        throw err;
    }
    return response;
}
