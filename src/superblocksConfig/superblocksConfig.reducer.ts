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
import { ISuperblocksRunConfigurationData, AccountType, IEnvironment } from './models';
import { Networks } from './networks';
import { replaceInArray } from '../reducers/utils';

export const initialState: ISuperblocksRunConfigurationData = {
    environmentName: 'Development',
    accountInfo: { balance: '', address: '' },
    networks: [{ host: 'http://superblocks-browser', port: 8545, id: '*' }],

    environments: [
        {
            name: 'Development',
            network: {
                host: 'http://superblocks-browser',  //
                port: 8545,                           //
                id: '*'                               // Optional. Defaults to '*' (any) i.e. reads network id from host.
            },
            accounts: [
                {
                    name: 'Account 1',                // Optional
                    type: AccountType.Seed,
                    seed: 'butter toward celery cupboard blind morning item night fatal theme display toy',
                    addressIndex: 0,                  // Optional. Defaults to 0.
                    hdpath: "m/44'/60'/0'/0/"         // Optional. Defaults to m/44'/60'/0'/0/ (BIP44).
                },
                {
                    name: 'Account 2',                // Optional
                    type: AccountType.Key,
                    key: '4a3aa20b292bb17c9d6efg000h00ff0f111c11c2f33cf4444444c5f66b777d00',
                    default: true
                },
                {
                    name: 'Account 3',                // Optional
                    type: AccountType.External
                }
            ],
        }
    ],
    compilerOptions: {},

    openWallets: {},
    metamaskAccounts: []
};

function getEnv(state: ISuperblocksRunConfigurationData): IEnvironment {
    return <IEnvironment>state.environments.find(e => e.name === state.environmentName);
}

function updateCurrentEnvironment(state: ISuperblocksRunConfigurationData, modifier: (env: IEnvironment) => IEnvironment) {
    return {
        environments: replaceInArray(state.environments, e => e.name === state.environmentName, e => modifier(e))
    };
}

export default function superblockConfigReducer(state = initialState, action: AnyAction): ISuperblocksRunConfigurationData {
    switch (action.type) {
        case 'PLUGIN.INIT': {
            return state;
        }
        case superblocksConfigActions.SET_ALL_NETWORKS:
            return {
                ...state,
                networks: Networks.concat(action.data)
            };
        case superblocksConfigActions.SET_NETWORK: {
            const network = state.networks.find(e => e.host === action.data.host && e.port === action.data.port);
            if (!network) {
                return state;
            }

            // if (currentNetwork.name) {
            //     accounts = resolveAccounts(state.dappfileData, currentNetwork.name, state.openWallets, state.metamaskAccounts);
            //     currentAccount = accounts.find(a => a.name === state.currentAccount.name) || initialState.currentAccount;
            // }
            return {
                ...state,
                ...updateCurrentEnvironment(state, e => ({ ...e, network }))
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
            return {
                ...state,
                ...updateCurrentEnvironment(state, e => {
                    return {
                        ...e,
                        accounts: e.accounts.map(a => ({...a, default: a.name === action.data}))
                    };
                })
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
