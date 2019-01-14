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

import { projectActions } from '../actions';

export const initialState = {
    selectedProject: {
        id: 0,
        name: ''
    },
};

export default function projectsReducer(state = initialState, action) {
    switch (action.type) {
        case projectActions.SELECT_PROJECT: {
            return {
                ...state,
                selectedProject: action.data ? { ...action.data } : initialState.selectedProject,
            };
        }
        case projectActions.UPDATE_PROJECT_SETTINGS_SUCCESS: {
            return {
                ...state,
                selectedProject: {
                    ...state.selectedProject,
                    name: action.data.name
                },
            };
        }
        default:
            return state;
    }
}
