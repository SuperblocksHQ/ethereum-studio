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
import { IProjectState } from '../models/state';
import { AnyAction } from 'redux';
import { getDappSettings } from './dappfileLib';
import superblockConfigReducer from '../superblocksConfig/superblocksConfig.reducer';
import { replaceInArray } from './utils';

export const initialState: IProjectState = {
    project: undefined,
    selectedRunConfig: undefined,
    runConfigurations: [
        { id: '123', plugin: 'SuperBlocks', name: 'Run Develop', active: true, pluginData: { selectedEnvironment: 'Development' } },
        { id: '1234', plugin: 'SuperBlocks', name: 'Run Stage', active: false, pluginData: { selectedEnvironment: 'Development' } }
    ],
    environments: [],
    selectedEnvironment: { name: '', endpoint: '' },
    accounts: [],
    selectedAccount: { name: '', balance: null, address: null, walletName: null, isLocked: false, type: '' },
    openWallets: {},
    metamaskAccounts: []
};

function handlePluginAction(state: IProjectState, action: AnyAction) {
    if (state.selectedRunConfig) {
        const prevSelectedRunConfig = state.selectedRunConfig;
        const selectedRunConfig = { ...prevSelectedRunConfig, data: superblockConfigReducer(prevSelectedRunConfig.data, action) };
        return {
            ...state,
            selectedRunConfig,
            runConfigurations: replaceInArray(state.runConfigurations, c => c === prevSelectedRunConfig, () => selectedRunConfig)
        };
    } else {
        return state;
    }
}

export default function projectsReducer(state = initialState, action: AnyAction) {
    // handle plugin actions
    if (action.type.startsWith('PLUGINS.SUPERBLOCKS.')) {
        return handlePluginAction(state, action);
    }

    // handle project actions
    switch (action.type) {
        case projectsActions.SELECT_RUN_CONFIGURATION: {
            const stateChange = {
                ...state,
                selectedRunConfig: state.runConfigurations.find(r => r.id === action.data)
            };
            return handlePluginAction(stateChange, { type: 'PLUGIN.INIT', data: initialState.runConfigurations[0].pluginData });
        }
        case projectsActions.UPDATE_PROJECT_SETTINGS_SUCCESS: {
            return {
                ...state,
                project: {
                    ...state.project,
                    name: action.data.name
                },
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
            const stateChange: IProjectState = {
                ...state,
                selectedRunConfig: state.runConfigurations.find(r => !!r.active)
            };

            // parse dappjson file to get environment
            // try {
            //     const dappfile = files.children.find(f => f.name === 'dappfile.json');
            //     if (dappfile) {
            //         stateChange = getDappSettings(dappfile.code || '', state.openWallets, state.metamaskAccounts);
            //     }
            // } catch (e) {
            //     console.log(e);
            // }

            return {
                ...stateChange,
                ...handlePluginAction(stateChange, { type: 'PLUGIN.INIT', data: initialState.runConfigurations[0].pluginData }),
                project: { ...action.data.project, files: undefined },
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
