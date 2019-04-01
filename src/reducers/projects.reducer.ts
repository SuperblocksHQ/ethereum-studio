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
import { IProjectState, IExplorerState } from '../models/state';
import { AnyAction } from 'redux';
import superblockConfigReducer from '../superblocksConfig/superblocksConfig.reducer';
import { replaceInArray } from './utils';
import { IProjectItem } from '../models';
import { explorerActions } from '../actions';

export const initialState: IProjectState = {
    project: undefined,
    selectedRunConfig: undefined,
    runConfigurations: [
        { id: '123', plugin: 'SUPERBLOCKS', name: 'Dev', active: true, selected: true, data: { environmentName: 'Development' } },
        { id: '1234', plugin: 'SUPERBLOCKS', name: 'Stage', active: false, selected: false, data: { environmentName: 'Staging' } }
    ],
    pluginsState: [{ name: 'SUPERBLOCKS', data: undefined }],
    openWallets: {}
};

function handlePluginAction(state: IProjectState, action: AnyAction, explorerTree: Nullable<IProjectItem>) {
    const pluginName = (action.type.match(/PLUGINS:(.*?)\./)[1] || '').toUpperCase();
    const pluginState = state.pluginsState.find(p => p.name === pluginName);

    if (pluginState) {
        // const prevSelectedRunConfig = state.selectedRunConfig;
        const result = superblockConfigReducer(pluginState.data, action, explorerTree);
        // const selectedRunConfig = { ...prevSelectedRunConfig, data: result };

        return {
            ...state,
            pluginsState: replaceInArray(state.pluginsState, c => c === pluginState, () => ({...pluginState, data: result})),
            // selectedRunConfig
        };
    } else {
        return state;
    }
}

export default function projectsReducer(state = initialState, action: AnyAction, { explorer }: { explorer: IExplorerState }) {
    // handle plugin actions
    if (action.type.startsWith('PLUGINS:')) {
        return handlePluginAction(state, action, explorer.tree);
    }

    // handle project actions
    switch (action.type) {
        case projectsActions.SHOW_RUN_CONFIGURATION: {
            const stateChange = {
                ...state,
                runConfigurations: state.runConfigurations.map(r => ({...r, selected: r.id === action.data}))
            };
            const pluginAction = {
                type: 'PLUGINS:SUPERBLOCKS.' + projectsActions.SHOW_RUN_CONFIGURATION,
                data: stateChange.runConfigurations.find(r => r.selected)
            };
            return handlePluginAction(stateChange, pluginAction, explorer.tree);
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

        case projectsActions.LOAD_PROJECT_SUCCESS:
            return {
                ...state,
                // selectedRunConfig: state.runConfigurations.find(r => !!r.active),
                project: { ...action.data.project, files: undefined },
            };

        case explorerActions.INIT_EXPLORER_COMPLETE: {
            const activeConfig = state.runConfigurations.find(r => r.active);
            let intermediateState = handlePluginAction(state, { type: 'PLUGINS:SUPERBLOCKS.FILE_SYSTEM_UPDATE'  }, explorer.tree);
            intermediateState = handlePluginAction(intermediateState, { type: 'PLUGINS:SUPERBLOCKS.SET_ACTIVE_RUN_CONFIGURATION', data: activeConfig }, explorer.tree);
            return handlePluginAction(intermediateState, {
                type: 'PLUGINS:SUPERBLOCKS.' + projectsActions.SHOW_RUN_CONFIGURATION,
                data: state.runConfigurations.find(r => r.selected)
            }, explorer.tree);
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
