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

import { IProject, IUser } from '../models';

export const userActions = {

    GET_PROJECT_LIST: 'GET_PROJECT_LIST',
    getProjectList() {
        return {
            type: userActions.GET_PROJECT_LIST,
        };
    },
    GET_PROJECT_LIST_SUCCESS: 'GET_PROJECT_LIST_SUCCESS',
    getProjectListSuccess(projectList: IProject[]) {
        return {
            type: userActions.GET_PROJECT_LIST_SUCCESS,
            data: { projectList }
        };
    },
    GET_PROJECT_LIST_FAIL: 'GET_PROJECT_LIST_FAIL',
    getProjectListFail(error: any) {
        return {
            type: userActions.GET_PROJECT_LIST_FAIL,
            data: error
        };
    },
    SET_PROFILE_PICTURE: 'SET_PROFILE_PICTURE',
    setProfilePicture(user: any) {
        return {
            type: userActions.SET_PROFILE_PICTURE,
            data: { user }
        };
    },
    REMOVE_PROFILE_PICTURE: 'REMOVE_PROFILE_PICTURE',
    removeProfilePicture() {
        return {
            type: userActions.REMOVE_PROFILE_PICTURE,
        };
    }
};
