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

import { superblocksConfigActions } from './superblocksConfig.actions';
import { AnyAction } from 'redux';
import { ISuperblocksRunConfiguration, IEnvironment, ISuperblocksPluginState } from './models';
import { IProjectItem } from '../models';
import { Networks } from './networks';

export const initialState: ISuperblocksPluginState = {
    configUI: {
        selectedConfig: { id: '', data: { environmentName: '' } },
        environment: undefined,
        networks: Networks
    },

    activeConfig: { id: '', data: { environmentName: '' } },
    dappfile: { environments: [], compilerOptions: {} },

    accountInfo: { balance: '', address: '' },
    openWallets: { },
    metamaskAccounts: []
};

function findEnvironment(config: ISuperblocksRunConfiguration, environments: IEnvironment[]) {
    return (config.id && environments.find((e: IEnvironment) => e.name === config.data.environmentName)) || undefined;
}

// TODO: IProjectItem - should be separate plugin interface or in the shared package
export default function superblocksConfigReducer(state = initialState, action: AnyAction, explorerTree: Nullable<IProjectItem>): ISuperblocksPluginState {
    switch (action.type) {
        case 'PLUGINS:SUPERBLOCKS.FILE_SYSTEM_UPDATE': {
            if (!explorerTree) {
                return state;
            }
            // parse dappjson file to get environments
            try {
                const dappfile: any = explorerTree.children.find(f => f.name === 'dappfile.json');
                const dappfileData: any = JSON.parse(dappfile.code || '');

                return {
                    ...state,
                    dappfile: dappfileData,
                    configUI: { // TODO: enhance logic here
                        ...state.configUI,
                        environment: findEnvironment(state.configUI.selectedConfig, dappfileData.environments)
                        // TODO: update networks as well
                    }
                };
            } catch (e) {
                console.error(e);
                return state;
            }
        }
        case 'PLUGINS:SUPERBLOCKS.SET_ACTIVE_RUN_CONFIGURATION': {
            return {
                ...state,
                activeConfig: action.data
            };
        }
        case 'PLUGINS:SUPERBLOCKS.SHOW_RUN_CONFIGURATION': {
            return {
                ...state,
                configUI: {
                    ...state.configUI,
                    selectedConfig: action.data,
                    environment: findEnvironment(action.data, state.dappfile.environments)
                }
            };
        }
        case superblocksConfigActions.SET_ENVIRONMENT: {
            const selectedConfig = { ...state.configUI.selectedConfig, data: { environmentName: action.data } };
            return {
                ...state,
                configUI: {
                    ...state.configUI,
                    selectedConfig,
                    environment: findEnvironment(selectedConfig, state.dappfile.environments)
                }
            };
        }
        case superblocksConfigActions.SET_NETWORK: {
            const network = state.configUI.networks.find(e => e.host === action.data.host && e.port === action.data.port);
            if (!network || !state.configUI.environment) {
                return state;
            }

            // if (currentNetwork.name) {
            //     accounts = resolveAccounts(state.dappfileData, currentNetwork.name, state.openWallets, state.metamaskAccounts);
            //     currentAccount = accounts.find(a => a.name === state.currentAccount.name) || initialState.currentAccount;
            // }
            return {
                ...state,
                configUI: {
                    ...state.configUI,
                    environment: {
                        ...state.configUI.environment,
                        network
                    }
                }
            };
        }
        case superblocksConfigActions.SET_METAMASK_ACCOUNTS: {
            // let accounts = state.accounts;
            // let currentAccount = state.currentAccount;
            const metamaskAccounts = action.data;

            // if (state.currentNetwork.name) {
            //     accounts = resolveAccounts(state.dappfileData, state.currentNetwork.name, state.openWallets, metamaskAccounts);
            //     currentAccount = accounts.find(a => a.name === state.currentAccount.name) || initialState.currentAccount;
            // }
            return {
                ...state,
                metamaskAccounts
            };
        }
        case superblocksConfigActions.SET_ACCOUNT:
            const environment = state.configUI.environment;
            if (!environment) {
                return state;
            }

            return {
                ...state,
                configUI: {
                    ...state.configUI,
                    environment: { ...environment, accounts: environment.accounts.map(a => ({...a, default: a.name === action.data})) }
                }
            };
        // case superblocksConfigActions.UPDATE_ACCOUNT_BALANCE: {
        //     return {
        //         ...state,
        //         // currentAccount: {...state.currentAccount, balance: action.data.balance}
        //     };
        // }
        case superblocksConfigActions.OPEN_WALLET_SUCCESS:
            return {
                ...state,
                openWallets: {
                    ...state.openWallets,
                    [action.data.name]: action.data.addresses
                }
            };
        default:
            return state;
    }
}
