// Copyright 2019 Superblocks AB
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

import { IEnvironment, INetwork } from './models';

export const superblocksConfigActions = {
    SET_ENVIRONMENT: 'PLUGINS.SUPERBLOCKS.SET_ENVIRONMENT',
    setEnvironment(name: string) {
        return {
            type: superblocksConfigActions.SET_ENVIRONMENT,
            data: name
        };
    },
    SET_ALL_NETWORKS: 'PLUGINS.SUPERBLOCKS.SET_ALL_NETWORKS',
    setAllNetworks(networks: INetwork[]) {
        return {
            type: superblocksConfigActions.SET_ALL_NETWORKS,
            data: networks
        };
    },
    SET_NETWORK: 'PLUGINS.SUPERBLOCKS.SET_NETWORK',
    setNetwork(network: INetwork) {
       return {
            type: superblocksConfigActions.SET_NETWORK,
            data: network
       };
    },
    SET_ACCOUNT: 'PLUGINS.SUPERBLOCKS.SET_ACCOUNT',
    setAccount(name: string) {
        return {
            type: superblocksConfigActions.SET_ACCOUNT,
            data: name
        };
    },
    SET_METAMASK_ACCOUNTS: 'PLUGINS.SUPERBLOCKS.SET_METAMASK_ACCOUNTS',
    setMetamaskAccounts(addresses: string[]) {
        return {
            type: superblocksConfigActions.SET_METAMASK_ACCOUNTS,
            data: addresses
        };
    },

    OPEN_WALLET: 'PLUGINS.SUPERBLOCKS.OPEN_WALLET',
    openWallet(name: string, seed: string) {
        return {
            type: superblocksConfigActions.OPEN_WALLET,
            data: { name, seed }
        };
    },
    OPEN_WALLET_SUCCESS: 'PLUGINS.SUPERBLOCKS.OPEN_WALLET_SUCCESS',
    openWalletSuccess(name: string, addresses: string[]) {
        return {
            type: superblocksConfigActions.OPEN_WALLET_SUCCESS,
            data: { name, addresses }
        };
    },

};
