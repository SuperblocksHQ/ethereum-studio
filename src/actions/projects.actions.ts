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

import { IEnvironment } from '../models/state';
import { IProject } from '../models';

export const projectsActions = {
    SET_ALL_ENVIRONMENTS: 'SET_ALL_ENVIRONMENTS',
    setAllEnvironments(environments: IEnvironment[]) {
        return {
            type: projectsActions.SET_ALL_ENVIRONMENTS,
            data: environments
        };
    },
    SET_ENVIRONMENT: 'SET_ENVIRONMENT',
    setEnvironment(environmentName: string) {
       return {
            type: projectsActions.SET_ENVIRONMENT,
            data: environmentName
       };
    },
    SELECT_ACCOUNT: 'SELECT_ACCOUNT',
    selectAccount(name: string) {
        return {
            type: projectsActions.SELECT_ACCOUNT,
            data: name
        };
    },
    UPDATE_ACCOUNT_BALANCE: 'UPDATE_ACCOUNT_BALANCE',
    updateAccountBalance(balance: string) {
        return {
            type: projectsActions.UPDATE_ACCOUNT_BALANCE,
            data: {balance}
        };
    },
    SET_METAMASK_ACCOUNTS: 'SET_METAMASK_ACCOUNTS',
    setMetamaskAccounts(addresses: string[]) {
        return {
            type: projectsActions.SET_METAMASK_ACCOUNTS,
            data: addresses
        };
    },

    UPDATE_PROJECT_SETTINGS: 'UPDATE_PROJECT_SETTINGS',
    updateProjectSettings(projectSettings: any) {
        return {
            type: projectsActions.UPDATE_PROJECT_SETTINGS,
            data: projectSettings
        };
    },
    UPDATE_PROJECT_SETTINGS_SUCCESS: 'UPDATE_PROJECT_SETTINGS_SUCCESS',
    updateProjectSettingsSuccess(newProjectSettings: any) {
        return {
            type: projectsActions.UPDATE_PROJECT_SETTINGS_SUCCESS,
            data: newProjectSettings,
        };
    },
    UPDATE_PROJECT_SETTINGS_FAIL: 'UPDATE_PROJECT_SETTINGS_FAIL',
    updateProjectSettingsFail(error: any) {
        return {
            type: projectsActions.UPDATE_PROJECT_SETTINGS_FAIL,
            error
        };
    },

    // ----------- Wallet ---------------
    OPEN_WALLET: 'OPEN_WALLET',
    openWallet(name: string, seed: string) {
        return {
            type: projectsActions.OPEN_WALLET,
            data: { name, seed }
        };
    },
    OPEN_WALLET_SUCCESS: 'OPEN_WALLET_SUCCESS',
    openWalletSuccess(name: string, addresses: string[]) {
        return {
            type: projectsActions.OPEN_WALLET_SUCCESS,
            data: { name, addresses }
        };
    },

    // ---------- CRUD Project actions ----------
    DELETE_PROJECT: 'DELETE_PROJECT',
    deleteProject(projectId: string) {
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
    deleteProjectFail(error: string) {
       return {
            type: projectsActions.DELETE_PROJECT_FAIL,
            data: error
       };
    },
    LOAD_PROJECT: 'LOAD_PROJECT',
    loadProject(projectId: string) {
        return {
            type: projectsActions.LOAD_PROJECT,
            data: { projectId }
        };
    },
    LOAD_PROJECT_SUCCESS: 'LOAD_PROJECT_SUCCESS',
    loadProjectSuccess(project: IProject) {
       return {
            type: projectsActions.LOAD_PROJECT_SUCCESS,
            data: { project }
       };
    },
    LOAD_PROJECT_FAIL: 'LOAD_PROJECT_FAIL',
    loadProjectFail(error: string) {
       return {
            type: projectsActions.LOAD_PROJECT_FAIL,
            data: error
       };
    },
    RENAME_PROJECT: 'RENAME_PROJECT',
    renameProject(newName: string) {
       return {
            type: projectsActions.RENAME_PROJECT,
            data: { newName }
       };
    },
    UPDATE_PROJECT_SUCCESS: 'UPDATE_PROJECT_SUCCESS',
    updateProjectSuccess(project: IProject) {
       return {
            type: projectsActions.UPDATE_PROJECT_SUCCESS,
            data: { project}
       };
    },
    UPDATE_PROJECT_FAIL: 'UPDATE_PROJECT_FAIL',
    updateProjectFail(error: string) {
       return {
            type: projectsActions.UPDATE_PROJECT_FAIL,
            data: error
       };
    },

    // ---------- FORK ----------
    FORK_CURRENT_PROJECT: 'FORK_CURRENT_PROJECT',
    forkCurrentProject() {
        return {
            type: projectsActions.FORK_CURRENT_PROJECT,
        };
    },
    FORK_PROJECT_BY_ID: 'FORK_PROJECT_BY_ID',
    forkProjectById(projectId: string) {
        return {
            type: projectsActions.FORK_PROJECT_BY_ID,
            data: { projectId }
        };
    },
    FORK_PROJECT_SUCCESS: 'FORK_PROJECT_SUCCESS',
    forkProjectSuccess() {
        return {
            type: projectsActions.FORK_PROJECT_SUCCESS,
        };
    },
    FORK_PROJECT_FAIL: 'FORK_PROJECT_FAIL',
    forkProjectFail(error: string) {
        return {
            type: projectsActions.FORK_PROJECT_FAIL,
            data: error
        };
    },

     // ---------- CREATE_EMPTY_PROJECT ----------
     CREATE_EMPTY_PROJECT: 'CREATE_EMPTY_PROJECT',
     createEmptyProject() {
         return {
             type: projectsActions.CREATE_EMPTY_PROJECT,
         };
     }
};
