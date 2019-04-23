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

import { IProjectItem } from '../models';

export const deployerActions = {
    DEPLOY_CONTRACT: 'DEPLOY_CONTRACT',
    deployContract(item: IProjectItem) {
        return {
            type: deployerActions.DEPLOY_CONTRACT,
            data: item
        };
    },

    DEPLOY_TO_MAINNET: 'DEPLOY_TO_MAINNET',
    deployToMainnet() {
        return {
            type: deployerActions.DEPLOY_TO_MAINNET
        };
    },

    SHOW_MAIN_NET_WARNING: 'SHOW_MAIN_NET_WARNING',
    showMainNetWarning() {
        return {
            type: deployerActions.SHOW_MAIN_NET_WARNING
        };
    },

    HIDE_MAIN_NET_WARNING: 'HIDE_MAIN_NET_WARNING',
    hideMainNetWarning() {
        return {
            type: deployerActions.HIDE_MAIN_NET_WARNING
        };
    },

    SHOW_EXTERNAL_PROVIDER_INFO: 'SHOW_EXTERNAL_PROVIDER_INFO',
    showExternalProviderInfo() {
        return {
            type: deployerActions.SHOW_EXTERNAL_PROVIDER_INFO
        };
    },

    HIDE_EXTERNAL_PROVIDER_INFO: 'HIDE_EXTERNAL_PROVIDER_INFO',
    hideExternalProviderInfo() {
        return {
            type: deployerActions.HIDE_EXTERNAL_PROVIDER_INFO
        };
    },

    DEPLOY_SUCCESS: 'DEPLOY_SUCCESS',
    deploySuccess() {
        return { type: deployerActions.DEPLOY_SUCCESS };
    },

    DEPLOY_FAIL: 'DEPLOY_FAIL',
    deployFail() {
        return { type: deployerActions.DEPLOY_FAIL };
    }
};
