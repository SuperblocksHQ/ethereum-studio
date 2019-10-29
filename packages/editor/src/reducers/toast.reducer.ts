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

import { projectsActions, toastActions } from '../actions';
import { AnyAction } from 'redux';

export const initialState = {
    toasts: new Array<any>()
};

let counter = 0;
export default function toastsReducer(state = initialState, action: AnyAction, rootState: any) {
    function pushToastToState() {
        counter += 1;
        const toast = {
            id: counter,
            type: action.type
        };
        return {
            ...state,
            toasts: state.toasts.concat(toast)
        };
    }

    switch (action.type) {
        case projectsActions.UPDATE_PROJECT_SETTINGS_FAIL:
        case projectsActions.FORK_PROJECT:
        case projectsActions.CREATE_PROJECT_SUCCESS:
        case projectsActions.DELETE_PROJECT_FAIL:
        case projectsActions.RENAME_PROJECT_FAIL:
        case projectsActions.FORK_PROJECT_FAIL: {
            return pushToastToState();
        }
        case toastActions.TOAST_DISMISSED:
            return {
                ...state,
                toasts: state.toasts.filter(toast => action.data !== toast.id),
            };
        default:
            return state;
    }
}
