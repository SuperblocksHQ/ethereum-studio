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

import { contractConfigActions } from '../actions';
import { AnyAction } from 'redux';
import { IContractConfigState } from '../models/state';
import { getItemPath } from './explorerLib';
import { IContractConfiguration } from '../models';
import { findContractConfiguration } from './dappfileLib';

export const initialState: IContractConfigState = {
    showContractConfig: false,
    selectedContract: undefined,
    otherContracts: [''],
    errorLoadingContractConfig: undefined,
};

export default function contractConfigReducer(state = initialState, action: AnyAction, rootState: any) {
    switch (action.type) {

        case contractConfigActions.OPEN_CONTRACT_CONFIGURATION: {
            const file = action.data.file;
            const tree = rootState.explorer.tree;
            const dappFileData = rootState.projects.dappFileData;

            const contractSource = getItemPath(tree, file);
            const contractConfiguration = findContractConfiguration(dappFileData, contractSource);
            const otherContracts = dappFileData.contracts.map((contract: any) => contract.source !== contractSource);

            return {
                ...state,
                showContractConfig: true,
                selectedContract: {
                    config: {
                        args: contractConfiguration.args,
                        name: contractConfiguration.name,
                        source: contractSource
                    },
                },
                otherContracts: otherContracts ? otherContracts.map((contract: IContractConfiguration) => contract.source) : [''],
            };
        }

        case contractConfigActions.CLOSE_CONTRACT_CONFIG: {
            return {
                ...state,
                showContractConfig: false
            };
        }

        default:
            return state;
    }
}
