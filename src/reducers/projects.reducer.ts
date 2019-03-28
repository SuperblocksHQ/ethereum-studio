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
import { IProjectItem } from '../models';
import { getDappSettings, resolveAccounts } from './dappfileLib';
import {authActions, userActions} from '../actions';

export const initialState: IProjectState = {
    project: undefined,
    environments: [],
    selectedEnvironment: { name: '', endpoint: '' },
    accounts: [],
    selectedAccount: { name: '', balance: null, address: null, walletName: null, isLocked: false, type: '' },
    openWallets: {},
    metamaskAccounts: [],
    dappfileData: null,
    isOwnProject: false
};

function getEnvOrNull(environment: IEnvironment) {
    return (environment && environment.name)
        ? environment
        : null;
}

export default function projectsReducer(state = initialState, action: AnyAction, wholeState: any) {
    switch (action.type) {
        case projectsActions.SET_ALL_ENVIRONMENTS:
            return {
                ...state,
                environments: action.data,
                selectedEnvironment: getEnvOrNull(state.selectedEnvironment)
                            || action.data[0]
                            || initialState.selectedEnvironment
            };
        case projectsActions.SET_ENVIRONMENT: {
            const selectedEnvironment = state.environments.find(e => e.name === action.data) || initialState.selectedEnvironment;
            let accounts = initialState.accounts;
            let selectedAccount = state.selectedAccount;

            if (selectedEnvironment.name) {
                accounts = resolveAccounts(state.dappfileData, selectedEnvironment.name, state.openWallets, state.metamaskAccounts);
                selectedAccount = accounts.find(a => a.name === state.selectedAccount.name) || initialState.selectedAccount;
            }
            return {
                ...state,
                selectedEnvironment,
                accounts,
                selectedAccount
            };
        }
        case projectsActions.SET_METAMASK_ACCOUNTS: {
            let accounts = state.accounts;
            let selectedAccount = state.selectedAccount;
            const metamaskAccounts = action.data;

            if (state.selectedEnvironment.name) {
                accounts = resolveAccounts(state.dappfileData, state.selectedEnvironment.name, state.openWallets, metamaskAccounts);
                selectedAccount = accounts.find(a => a.name === state.selectedAccount.name) || initialState.selectedAccount;
            }
            return {
                ...state,
                metamaskAccounts,
                accounts,
                selectedAccount
            };
        }
        case projectsActions.SELECT_ACCOUNT:
            return {
                ...state,
                selectedAccount: state.accounts.find(a => a.name === action.data) || initialState.selectedAccount
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
        case projectsActions.UPDATE_ACCOUNT_BALANCE: {
            return {
                ...state,
                selectedAccount: {...state.selectedAccount, balance: action.data.balance}
            };
        }
        case projectsActions.OPEN_WALLET_SUCCESS:
            return {
                ...state,
                openWallets: {
                    ...state.openWallets,
                    [action.data.name]: action.data.addresses
                }
            };
        case projectsActions.LOAD_PROJECT_SUCCESS: {
            const files: IProjectItem = action.data.project.files;
            let stateChange = {
                environments: initialState.environments,
                selectedEnvironment: initialState.selectedEnvironment,
                dappfileData: null
            };

            // parse dappjson file to get environment
            try {
                const dappfile = files.children.find(f => f.name === 'dappfile.json');
                if (dappfile) {
                    stateChange = getDappSettings(dappfile.code || '', state.openWallets, state.metamaskAccounts);
                }
            } catch (e) {
                console.log(e);
            }

            // determine if loaded project is own or not
            if (wholeState.user.profile) {
                const projectOwnerId = action.data.project.ownerId;

                if (projectOwnerId === wholeState.user.profile.id) {
                    state.isOwnProject = true;
                }
            }

            return {
                ...state,
                project: { ...action.data.project, files: undefined },
                ...stateChange
            };
        }
        case authActions.LOGIN_SUCCESS: {
            if (action.data.user) {
                const userData = action.data.user;

                // if there's a project opened
                if (state.project) {
                    // determine if loaded project is own or not
                    if (state.project.ownerId === userData.id) {
                        state.isOwnProject = true;
                    }
                }
            }
            return {
                ...state,
            };
        }
        case projectsActions.RENAME_PROJECT_FAIL: {
            console.log('rename project failed: ', action.data);

            return {
                ...state,
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
                project: { ...action.data.project, files: undefined }
            };
        }
        default:
            return state;
    }
}
