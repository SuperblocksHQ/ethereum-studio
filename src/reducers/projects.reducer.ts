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
import { IProjectState, IEnvironment } from '../models/state';
import { AnyAction } from 'redux';

export const initialState: IProjectState = {
    project: undefined,
    environments: [],
    selectedEnvironment: { name: null, endpoint: null },
    selectedAccount: {name: null, balance: null, address: null}
};

function getEnvOrNull(environment: IEnvironment) {
    return (environment && environment.name)
        ? environment
        : null;
}

export default function projectsReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case projectsActions.SET_ALL_ENVIRONMENTS:
            return {
                ...state,
                environments: action.data,
                selectedEnvironment: getEnvOrNull(state.selectedEnvironment)
                            || action.data[0]
                            || initialState.selectedEnvironment
            };
        case projectsActions.SET_ENVIRONMENT:
            return {
                ...state,
                selectedEnvironment: state.environments.find(e => e.name === action.data)
                                    || initialState.selectedEnvironment
            };
        case projectsActions.UPDATE_PROJECT_SETTINGS_SUCCESS: {
            return {
                ...state,
                project: {
                    ...state.project,
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
        case projectsActions.LOAD_PROJECT_SUCCESS: {
            return {
                ...state,
                project: action.data.project
            };
        }
        case projectsActions.LOAD_PROJECT_FAIL: {
            console.log('project load failed', action.data);

            return {
                ...state,
            };
        }
        case projectsActions.DELETE_PROJECT_SUCCESS: {
            return {
                ...state,
                project: null
            };
        }
        case projectsActions.UPDATE_PROJECT_SUCCESS: {
            return {
                ...state,
                project: action.data.project
            };
        }
        default:
            return state;
    }
}
