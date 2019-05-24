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
import { initialState as settings } from '../reducers/settings.reducer';
import { initialState as projects } from '../reducers/projects.reducer';

const migrations = {
    1: (state) => {
        return {
            ...state,
            settings: {
                ...state.settings,
                preferences: {
                    chain: undefined,
                    network: settings.preferences.network
                }
            }
        }
    },
    2: (state) => {
        return {
            ...state,
            projects: {
                selectedProjectId: undefined,
                selectedProject: {
                    id: selectedProjectId ? selectedProjectId : 0
                }
            }
        }
    },
    3: (state) => {
        return {
            ...state,
            settings: {
                ...state.settings,
                preferences: {
                    ...state.settings.preferences,
                    advanced: settings.preferences.advanced
                }
            }
        }
    },
    4: (state) => {
        return {
            ...state,
            settings: {
                ...state.settings,
                showTrackingAnalyticsDialog: settings.showTrackingAnalyticsDialog
            }
        }
    },
    5: (state) => {
        return {
            ...state,
            projects: {
                ...state.projects,
                selectedProject: {
                    ...projects.selectedProject,
                    ...state.selectedProject
                },
            },
            settings: {
                ...state.settings,
                showSplash: undefined
            }
        };
    }
}

export default migrations;
