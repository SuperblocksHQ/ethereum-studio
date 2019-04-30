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

import { AnyAction } from 'redux';
import { authActions, userActions } from '../actions';

export const initialState = {
    projectList: [],
    isProjectListLoading: false,
    showForkButton: true,
    isProjectForking: false,
    errorLoadingProjectList: null,
    profile: null,
    githubRepositoryList: [],
    isRepositoriesLoading: false
};

export default function userReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case authActions.LOGOUT_SUCCESS:
            return {
                ...state,
                profile: null
            };
        case authActions.LOGIN_SUCCESS:
            let userData = null;
            if (action.data.user) {
                userData = action.data.user;
            }
            return {
                ...state,
                profile: userData
            };
        case userActions.GET_USER_REPOSITORY_LIST:
            return {
                ...state,
                isRepositoriesLoading: true
            };
        case userActions.GET_USER_REPOSITORY_LIST_SUCCESS:
            return {
                ...state,
                isRepositoriesLoading: false,
                githubRepositoryList: action.data.githubRepositoryList
            };
        case userActions.GET_USER_REPOSITORY_LIST_FAIL:
            return {
                ...state,
                isRepositoriesLoading: false,
                githubRepositoryList: []
            };
        default:
            return state;
    }

}
