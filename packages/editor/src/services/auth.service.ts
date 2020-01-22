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

import { fetchJSON, getAuthToken, getRefreshToken } from './utils/fetchJson';
import { catchError, switchMap, tap } from 'rxjs/operators';
import platform from 'platform';
import { EMPTY, throwError } from 'rxjs';
import { ITokenExpiration } from '../models';
import jwt_decode from 'jwt-decode';

export const authService = {

    githubAuth(data: any) {
        const code = data.code;
        const userDevice = this.getUserDeviceInfo();

        return fetchJSON(window.ENV.API_BASE_URL + '/v1/auth/github', {
            method: 'POST',
            body: {code, userDevice},
        }).pipe(
            switchMap(r => (r.ok ? r.json() : throwError(r.statusText))),
            tap(jsonData => fetchJSON.setAuthTokens(jsonData.token, jsonData.refreshToken)),
            catchError(err => {
                throw err;
            })
        );
    },

    refreshAuth() {
        const refreshToken = getRefreshToken();
        if (refreshToken === null) {
            throw Error('RefreshToken is not available');
        }
        return fetchJSON(window.ENV.API_BASE_URL + '/v1/auth/refreshToken', {
            method: 'POST',
            body: { refreshToken }
        }).pipe(
            switchMap(r => (r.ok ? r.json() : throwError('Invalid refreshToken'))),
            tap(jsonData => fetchJSON.setAuthToken(jsonData.token)),
            catchError(err => {
                // Delete invalid refreshToken
                fetchJSON.clearAuthTokens();
                throw Error(err);
            })
        );
    },

    logout() {
        const refreshToken = getRefreshToken();
        if (refreshToken === null) {
            return EMPTY;
        }
        return fetchJSON(window.ENV.API_BASE_URL + '/v1/auth/refreshToken', {
            method: 'DELETE',
            body: { refreshToken }
        }).pipe(
            switchMap(r => (r.ok ? r.json() : EMPTY)),
            catchError(err => {
                throw Error(err);
            })
        );
    },

    getUserDeviceInfo() {
        const isMobile = this.isMobile();
        return {os: (platform.os || {}).family, isMobile, userAgent: navigator.userAgent};
    },

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    getAuthTokenExpiration(): ITokenExpiration {
        const token = getAuthToken();

        if (!token) {
            return { nextRefresh: 0, refreshInterval: 45 };
        }

        const decoded: any = jwt_decode(token);

        const refreshOffset: number = Number(window.ENV.AUTH_REFRESH_OFFSET);

        // how many seconds before expiration do refresh
        const TTL = decoded.exp - Math.floor(Date.now() / 1000);
        // refresh x seconds before expiration
        const nextRefresh = Math.max(0, TTL - refreshOffset);

        // difference between expiration and issuance
        const refreshInterval = decoded.exp - decoded.iat - refreshOffset;

        return {nextRefresh, refreshInterval};
    }
};
