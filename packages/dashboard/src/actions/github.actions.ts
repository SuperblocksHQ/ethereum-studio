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

import { IGithubRepository } from '../models';

export const githubActions = {
    GET_USER_REPOSITORY_LIST: 'GET_USER_REPOSITORY_LIST',
    getUserRepositoryList() {
        return {
            type: githubActions.GET_USER_REPOSITORY_LIST,
        };
    },

    GET_USER_REPOSITORY_LIST_SUCCESS: 'GET_USER_REPOSITORY_LIST_SUCCESS',
    getUserRepositoryListSuccess(githubRepositoryList: IGithubRepository[]) {
        return {
            type: githubActions.GET_USER_REPOSITORY_LIST_SUCCESS,
            data: { githubRepositoryList }
        };
    },

    GET_USER_REPOSITORY_LIST_FAIL: 'GET_USER_REPOSITORY_LIST_FAIL',
    getUserRepositoryListFail(error: any) {
        return {
            type: githubActions.GET_USER_REPOSITORY_LIST_FAIL,
            error
        };
    },
};
