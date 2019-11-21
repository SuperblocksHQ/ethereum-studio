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
import { IProject, IProjectItem, ITemplate } from '../models';

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
    SET_ENVIRONMENT_SUCCESS: 'SET_ENVIRONMENT_SUCCESS',
    setEnvironmentSuccess() {
       return {
            type: projectsActions.SET_ENVIRONMENT_SUCCESS,
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
    openWallet(name: string, seed?: string) {
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
    OPEN_WALLET_FAIL: 'OPEN_WALLET_FAIL',
    openWalletFail(err: any) {
        return {
            type: projectsActions.OPEN_WALLET_FAIL,
            data: { err }
        };
    },

    // ---------- CRUD Project actions ----------
    DELETE_PROJECT: 'DELETE_PROJECT',
    deleteProject(projectId: string, redirect: boolean = false) {
       return {
            type: projectsActions.DELETE_PROJECT,
            data: { projectId, redirect }
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
    LOAD_PROJECT_REQUEST: 'LOAD_PROJECT_REQUEST',
    loadProject(projectId: string) {
        return {
            type: projectsActions.LOAD_PROJECT_REQUEST,
            data: { projectId }
        };
    },
    LOAD_PROJECT_SUCCESS: 'LOAD_PROJECT_SUCCESS',
    loadProjectSuccess(project: IProject) {
        return {
            type: projectsActions.LOAD_PROJECT_SUCCESS,
            data: { project, metamaskAccounts: (window.web3 && window.web3.eth) ? window.web3.eth.accounts : [] }
       };
    },
    LOAD_PROJECT_FAIL: 'LOAD_PROJECT_FAIL',
    loadProjectFail(error: string) {
       return {
            type: projectsActions.LOAD_PROJECT_FAIL,
            data: error
       };
    },

    CREATE_PROJECT_FROM_TEMPLATE_REQUEST: 'CREATE_PROJECT_FROM_TEMPLATE_REQUEST',
    createProjectFromTemplate(template: ITemplate) {
        return {
            type: projectsActions.CREATE_PROJECT_FROM_TEMPLATE_REQUEST,
            data: { template }
        };
    },
    RENAME_PROJECT: 'RENAME_PROJECT',
    renameProject(newName: string) {
       return {
            type: projectsActions.RENAME_PROJECT,
            data: { newName }
       };
    },
    RENAME_PROJECT_FAIL: 'RENAME_PROJECT_FAIL',
    renameProjectFail(error: string) {
        return {
            type: projectsActions.RENAME_PROJECT_FAIL,
            data: error
        };
    },
    UPDATE_PROJECT: 'UPDATE_PROJECT',
    updateProject(project: IProject) {
       return {
            type: projectsActions.UPDATE_PROJECT,
            data: { project }
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

    SAVE_PROJECT: 'SAVE_PROJECT',
    saveProject(item?: IProjectItem) {
        return {
            type: projectsActions.SAVE_PROJECT,
            data: { item }
        };
    },
    SAVE_PROJECT_SUCCESS: 'SAVE_PROJECT_SUCCESS',
    saveProjectSuccess(files: IProjectItem) {
        return {
            type: projectsActions.SAVE_PROJECT_SUCCESS,
            data: { files }
        };
    },
    SAVE_PROJECT_FAIL: 'SAVE_PROJECT_FAIL',
    saveProjectFail(error: string) {
        return {
            type: projectsActions.SAVE_PROJECT_FAIL,
            data: error
        };
    },

    // ---------- FORK ----------
    FORK_PROJECT: 'FORK_PROJECT',
    forkProject(projectId: string, redirect: boolean) {
        return {
            type: projectsActions.FORK_PROJECT,
            data: { projectId, redirect }
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
    CREATE_FORKED_PROJECT: 'CREATE_FORKED_PROJECT',
    createForkedProject(name: string, description: string, tree: any) {
        return {
            type: projectsActions.CREATE_FORKED_PROJECT,
            data: { name, description, tree }
        };
    },
    CREATE_PROJECT_SUCCESS: 'CREATE_PROJECT_SUCCESS',
    createProjectSuccess() {
        return {
            type: projectsActions.CREATE_PROJECT_SUCCESS,
        };
    },

    // ---------- EXPORT PROJECT ----------
    EXPORT_PROJECT: 'EXPORT_PROJECT',
    exportProject() {
        return {
            type: projectsActions.EXPORT_PROJECT
        };
    },
    EXPORT_PROJECT_SUCCESS: 'EXPORT_PROJECT_SUCCESS',
    exportProjectSuccess() {
        return {
            type: projectsActions.EXPORT_PROJECT_SUCCESS
        };
    },
    EXPORT_PROJECT_ERROR: 'EXPORT_PROJECT_ERROR',
    exportProjectError(error: any) {
        return {
            type: projectsActions.EXPORT_PROJECT_ERROR,
            data: error
        };
    },
};
