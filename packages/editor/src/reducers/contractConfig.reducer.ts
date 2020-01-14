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
import { findContractConfiguration } from './dappfileLib';

export const initialState: IContractConfigState = {
    showContractConfig: false,
    selectedContract: undefined,
    errorLoadingContractConfig: undefined,
};

export default function contractConfigReducer(state = initialState, action: AnyAction, rootState: any) {
    switch (action.type) {

        case contractConfigActions.OPEN_CONTRACT_CONFIGURATION: {
            const dappFileData = rootState.projects.dappFileData;
            const contractSource = action.data.contractSource;

            const contractConfiguration = findContractConfiguration(dappFileData, contractSource);
            return {
                ...state,
                showContractConfig: true,
                selectedContract: {
                    config: {
                        args: contractConfiguration.args,
                        name: contractConfiguration.name,
                        source: contractSource,
                        value: contractConfiguration.value
                    },
                },
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
