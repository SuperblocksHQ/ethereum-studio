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

import { IUser } from '../models/user.model';

export const authActions = {
    GITHUB_LOGIN: 'GITHUB_LOGIN',
    githubLogin() {
        return {
            type: authActions.GITHUB_LOGIN,
        };
    },

    GITHUB_LOGIN_SUCCESS: 'GITHUB_LOGIN_SUCCESS',
    githubLoginSuccess() {
        return {
            type: authActions.GITHUB_LOGIN_SUCCESS,
        };
    },

    LOGIN: 'LOGIN',
    login(githubData: any) {
        return {
            type: authActions.LOGIN,
            data: { githubData }
        };
    },

    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    loginSuccess(user: IUser) {
        return {
            type: authActions.LOGIN_SUCCESS,
            data: { user }
        };
    },

    LOGIN_FAIL: 'LOGIN_FAIL',
    loginFail(error: any) {
        return {
            type: authActions.LOGIN_FAIL,
            data: error
        };
    },

    LOGOUT: 'LOGOUT',
    logout() {
        return {
            type: authActions.LOGOUT,
        };
    },

    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
    logoutSuccess() {
        return {
            type: authActions.LOGOUT_SUCCESS,
        };
    }
};
