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

export const projectsActions = {
    SELECT_PROJECT: 'SELECT_PROJECT',
    selectProject(project) {
        return {
            type: projectsActions.SELECT_PROJECT,
            data: project
        };
    },

    SET_ENVIRONMENT: 'SET_ENVIRONMENT',
    setEnvironment(environmentName) {
       return {
            type: projectsActions.SET_ENVIRONMENT,
            data: environmentName
       };
    },

    UPDATE_PROJECT_SETTINGS: 'UPDATE_PROJECT_SETTINGS',
    updateProjectSettings(projectSettings) {
        return {
            type: projectsActions.UPDATE_PROJECT_SETTINGS,
            data: projectSettings
        };
    },
    UPDATE_PROJECT_SETTINGS_SUCCESS: 'UPDATE_PROJECT_SETTINGS_SUCCESS',
    updateProjectSettingsSuccess(newProjectSettings) {
        return {
            type: projectsActions.UPDATE_PROJECT_SETTINGS_SUCCESS,
            data: newProjectSettings,
        };
    },
    UPDATE_PROJECT_SETTINGS_FAIL: 'UPDATE_PROJECT_SETTINGS_FAIL',
    updateProjectSettingsFail(error) {
        return {
            type: projectsActions.UPDATE_PROJECT_SETTINGS_FAIL,
            error: error
        };
    },
    UPDATE_SELECTED_ACCOUNT: 'UPDATE_SELECTED_ACCOUNT',
    updateSelectAccount(name, balance, address) {
        return {
            type: projectsActions.UPDATE_SELECTED_ACCOUNT,
            data: {name: name, balance: balance, address: address}
        };
    },
    DELETE_PROJECT: 'DELETE_PROJECT',
    deleteProject(projectId) {
       return {
            type: projectsActions.DELETE_PROJECT,
            data: { projectId }
       };
    },
    DELETE_PROJECT_SUCCESS: 'DELETE_PROJECT_SUCCESS',
    deleteProjectSuccess() {
       return {
            type: projectsActions.DELETE_PROJECT_SUCCESS
       };
    },
    DELETE_PROJECT_FAIL: 'DELETE_PROJECT_FAIL',
    deleteProjectFail(error) {
       return {
            type: projectsActions.DELETE_PROJECT_FAIL,
            data: error
       };
    },
    LOAD_PROJECT: 'LOAD_PROJECT',
    loadProject(projectId) {
       return {
            type: projectsActions.LOAD_PROJECT,
            data: { projectId }
       };
    },
    LOAD_PROJECT_SUCCESS: 'LOAD_PROJECT_SUCCESS',
    loadProjectSuccess(project) {
       return {
            type: projectsActions.LOAD_PROJECT_SUCCESS,
            data: { project }
       };
    },
    LOAD_PROJECT_FAIL: 'LOAD_PROJECT_FAIL',
    loadProjectFail(error) {
       return {
            type: projectsActions.LOAD_PROJECT_FAIL,
            data: error
       };
    },
};
