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

import { IProjectState, IEnvironment, IExplorerState } from '../models/state';
import { AnyAction } from 'redux';
import { IProjectItem } from '../models';
import { getDappSettings, resolveAccounts } from './dappfileLib';
import { authActions, accountActions, panesActions, projectsActions } from '../actions';
import { findItemById } from './explorerLib';
import { replaceInArray } from './utils';

export const initialState: IProjectState = {
    project: {
        name: '',
        id: ''
    },
    isProjectLoading: false,
    loadProjectError: undefined,
    environments: [],
    selectedEnvironment: { name: '', endpoint: '' },
    accounts: [],
    selectedAccount: { name: '', balance: null, address: '0x0', walletName: null, isLocked: false, type: '' },
    openWallets: {},
    metamaskAccounts: [],
    dappFileData: null,
    isOwnProject: false
};

function getEnvOrNull(environment: IEnvironment) {
    return (environment && environment.name)
        ? environment
        : null;
}

export default function projectsReducer(state = initialState, action: AnyAction, { explorer }: { explorer: IExplorerState }) {
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
                accounts = resolveAccounts(state.dappFileData, selectedEnvironment.name, state.openWallets, state.metamaskAccounts);
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
                accounts = resolveAccounts(state.dappFileData, state.selectedEnvironment.name, state.openWallets, metamaskAccounts);
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
        case projectsActions.CREATE_PROJECT_FROM_TEMPLATE_REQUEST:
        case projectsActions.LOAD_PROJECT_REQUEST: {
            return {
                ...state,
                isProjectLoading: true
            };
        }
        case projectsActions.LOAD_PROJECT_SUCCESS: {
            const files: IProjectItem = action.data.project.files;
            const metamaskAccounts = action.data.metamaskAccounts || [];
            let stateChange = {
                environments: initialState.environments,
                selectedEnvironment: initialState.selectedEnvironment,
                dappFileData: null
            };

            // parse dappjson file to get environment
            try {
                const dappfile = files.children.find(f => f.name === 'dappfile.json');
                if (dappfile) {
                    stateChange = getDappSettings(dappfile.code || '', state.openWallets, metamaskAccounts);
                }
            } catch (e) {
                console.log(e);
            }

            // determine if loaded project is own or not
            state.isOwnProject = action.data.project.isOwner;

            return {
                ...state,
                project: { ...action.data.project, files: undefined },
                isProjectLoading: false,
                loadProjectError: undefined,
                metamaskAccounts,
                ...stateChange
            };
        }
        case projectsActions.LOAD_PROJECT_FAIL: {
            return {
                ...state,
                isProjectLoading: false,
                loadProjectError: action.data
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

        case panesActions.SAVE_FILE_SUCCESS: {
            if (!explorer.tree) {
                return state;
            }

            const result = findItemById(explorer.tree, action.data.fileId);
            // reload dapp file data if the file was updated
            if (result.item && result.path.length === 1 && result.path[0] === 'dappfile.json') {
                try {
                    const stateChange = getDappSettings(result.item.code || '', state.openWallets, state.metamaskAccounts);
                    const selectedAccount = state.selectedAccount;
                    const accounts = state.accounts;
                    const selectedEnvironment = stateChange.environments.find((e: any) => e.name === state.selectedEnvironment.name) || stateChange.selectedEnvironment;

                    return {
                        ...state,
                        ...stateChange,
                        selectedAccount,
                        accounts,
                        selectedEnvironment
                    };
                } catch (e) {
                    console.log(e);
                    return state;
                }

            } else {
                return state;
            }
        }

        case accountActions.DELETE_ACCOUNT_SUCCESS:
        case accountActions.CREATE_NEW_ACCOUNT_SUCCESS: {
            const { updatedDappFileData } = action.data;
            let stateChange = {
                accounts: state.accounts,
                dappFileData: state.dappFileData
            };

            // parse dappjson file to get environment
            try {
                stateChange = getDappSettings(JSON.stringify(updatedDappFileData) || '', state.openWallets, state.metamaskAccounts);
            } catch (e) {
                console.log(e);
            }

            return {
                ...state,
                ...stateChange
            };
        }
        case accountActions.UPDATE_ACCOUNT_NAME: {
            return {
                ...state,
                accounts: replaceInArray(
                    state.accounts,
                    acc => acc.name === action.data.account.name,
                    acc => ({ ...acc, name: action.data.newName })
                ),
                selectedAccount: {
                    ...state.selectedAccount,
                    name: state.selectedAccount.name === action.data.account.name ? action.data.newName : state.selectedAccount.name
                }
            };
        }
        default:
            return state;
    }
}
