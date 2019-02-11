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
import { userActions } from '../actions';

export const initialState = {
    projectList: [],
    isProjectListLoading: false,
    errorLoadingProjectList: null,
    profile: {
        profileImageUrl: null
    }
};

export default function userReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case userActions.GET_PROJECT_LIST:
            return {
                ...state,
                isProjectListLoading: true
            };
        case userActions.GET_PROJECT_LIST_SUCCESS:
            return {
                ...state,
                projectList: action.data.projectList,
                isProjectListLoading: false
            };
        case userActions.GET_PROJECT_LIST_FAIL:
            return {
                ...state,
                isProjectListLoading: false,
                errorLoadingProjectList: action.data
            };
        case userActions.SET_PROFILE_PICTURE:
            return {
                ...state,
                profile: {
                    profileImageUrl: action.data.user.imageUrl
                }
            };
        case userActions.REMOVE_PROFILE_PICTURE:
            return {
                ...state,
                profile: {
                    profileImageUrl: null
                }
            };
        default:
            return state;
    }

}
