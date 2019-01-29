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

import { projectsActions } from '../actions/projects.actions';

export const initialState = {
    selectedProject: {
        id: 0,
        name: '',
        environments: [],
        selectedEnvironment: { name: null, endpoint: null },
        selectedAccount: {name: null, balance: null, address: null}
    }
};

function getEnvOrNull(environment) {
    return (environment && environment.name)
        ? environment
        : null;
}

export default function projectsReducer(state = initialState, action) {
    switch (action.type) {
        case projectsActions.SELECT_PROJECT: {
            return {
                ...state,
                selectedProject: action.data 
                    ? { 
                        ...action.data,
                        selectedEnvironment: getEnvOrNull(state.selectedProject.selectedEnvironment)
                            || action.data.environments[0]
                            || initialState.selectedProject.selectedEnvironment
                    } : initialState.selectedProject,
            };
        }
        case projectsActions.SET_ENVIRONMENT:
            return {
                ...state,
                selectedProject: {
                    ...state.selectedProject,
                    selectedEnvironment: state.selectedProject.environments.find(e => e.name === action.data) 
                                        || initialState.selectedProject.selectedEnvironment
                }
            };

        case projectsActions.UPDATE_PROJECT_SETTINGS_SUCCESS: {
            return {
                ...state,
                selectedProject: {
                    ...state.selectedProject,
                    name: action.data.name
                },
            };
        }

        case projectsActions.UPDATE_SELECTED_ACCOUNT: {
            return {
                ...state,
                selectedAccount: action.data
            };
        }
        default:
            return state;
    }
}
