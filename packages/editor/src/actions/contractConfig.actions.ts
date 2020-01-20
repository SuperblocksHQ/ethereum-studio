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

import { IContractConfiguration } from '../models';

export const contractConfigActions = {

    OPEN_CONTRACT_CONFIGURATION: 'OPEN_CONTRACT_CONFIGURATION',
    openContractConfig(contractSource: string) {
        return {
            type: contractConfigActions.OPEN_CONTRACT_CONFIGURATION,
            data: { contractSource }
        };
    },

    CLOSE_CONTRACT_CONFIG: 'CLOSE_CONTRACT_CONFIG',
    closeContractConfig() {
        return {
            type: contractConfigActions.CLOSE_CONTRACT_CONFIG
        };
    },

    SAVE_CONTRACT_CONFIGURATION: 'SAVE_CONTRACT_CONFIGURATION',
    saveContractConfig(contractConfig: IContractConfiguration) {
        return {
            type: contractConfigActions.SAVE_CONTRACT_CONFIGURATION,
            data: { contractConfig }
        };
    },
    SAVE_CONTRACT_CONFIGURATION_SUCCESS: 'SAVE_CONTRACT_CONFIGURATION_SUCCESS',
    saveContractConfigSuccess() {
        return {
            type: contractConfigActions.SAVE_CONTRACT_CONFIGURATION_SUCCESS,
        };
    },
    SAVE_CONTRACT_CONFIGURATION_FAIL: 'SAVE_CONTRACT_CONFIGURATION_FAIL',
    saveContractConfigFail(error: any) {
        return {
            type: contractConfigActions.SAVE_CONTRACT_CONFIGURATION_FAIL,
            data: error
        };
    },
};
