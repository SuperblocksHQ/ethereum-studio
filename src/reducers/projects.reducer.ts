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
import { IProjectState, IExplorerState, IRunConfiguration } from '../models/state';
import { AnyAction } from 'redux';
import { superblocksConfigReducer, runConfigDataSelector } from '../superblocksConfig';
import { replaceInArray } from './utils';
import { IProjectItem, ProjectItemTypes } from '../models';
import { explorerActions } from '../actions';
import { createFile, findItemByPath } from './explorerLib';

export const initialState: IProjectState = {
    project: undefined,
    runConfigurations: [ ],
    runConfigurationsFile: undefined,
    hasUpdates: false,
    pluginsState: [{ name: 'SUPERBLOCKS', data: undefined }],
    openWallets: {}
};

function handlePluginAction(state: IProjectState, action: AnyAction, explorerTree: Nullable<IProjectItem>) {
    const pluginName = (action.type.match(/PLUGINS:(.*?)\./)[1] || '').toUpperCase();
    const pluginState = state.pluginsState.find(p => p.name === pluginName);

    if (pluginState) {
        const result = superblocksConfigReducer(pluginState.data, action, explorerTree);

        return {
            ...state,
            pluginsState: replaceInArray(state.pluginsState, c => c === pluginState, () => ({...pluginState, data: result}))
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
        case projectsActions.SAVE_RUN_CONFIGURATION: {
            try {
                const runConfigurations = replaceInArray(
                    state.runConfigurations,
                    r => r.id === action.data.id,
                    r => {
                        const pluginState = state.pluginsState.find(s => s.name === r.plugin);
                        if (!pluginState) {
                            return r;
                        }
                        const name = action.data.name === undefined ? r.name : action.data.name;
                        return {...r, name, data: runConfigDataSelector(pluginState.data) };
                    }
                );

                return {
                    ...state,
                    runConfigurations,
                    // TODO: think. not a pure peice of code because of an id generation
                    runConfigurationsFile: createFile('.runConfigs', JSON.stringify(runConfigurations))
                };
            } catch (e) {
                console.error(e);
                return { ...state, runConfigurationsFile: undefined };
            }
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
            if (!explorer.tree) {
                return state;
            }

            try {
                let activeConfig: IRunConfiguration | undefined;
                let runConfigurations = initialState.runConfigurations;
                const configsFile = findItemByPath(explorer.tree, ['.super', '.runConfigs'], ProjectItemTypes.File);

                if (configsFile && configsFile.code) {
                    console.log('No configurations file detected');
                    runConfigurations = <IRunConfiguration[]>JSON.parse(configsFile.code);
                    activeConfig = runConfigurations.find(r => r.active);
                }

                let intermediateState = handlePluginAction({ ...state, runConfigurations }, { type: 'PLUGINS:SUPERBLOCKS.FILE_SYSTEM_UPDATE'  }, explorer.tree);
                intermediateState = handlePluginAction(intermediateState, { type: 'PLUGINS:SUPERBLOCKS.SET_ACTIVE_RUN_CONFIGURATION', data: activeConfig }, explorer.tree);

                const selectedConfig = runConfigurations.find(r => r.selected);
                if (selectedConfig) {
                    return handlePluginAction(intermediateState, {
                        type: 'PLUGINS:SUPERBLOCKS.' + projectsActions.SHOW_RUN_CONFIGURATION,
                        data: selectedConfig
                    }, explorer.tree);
                } else {
                    return intermediateState;
                }
            } catch (e) {
                console.error(e);
                return state;
            }
        }

        case projectsActions.ADD_RUN_CONFIGURATION:
            return {
                ...state,
                runConfigurations: state.runConfigurations.concat([ {
                    id: action.data,
                    name: 'Noname',
                    plugin: 'SUPERBLOCKS',
                    active: false,
                    selected: false,
                    data: { }
                } ]),
                // TODO: add some conditions here
                hasUpdates: true
            };

        // case projectsActions.REMOVE_RUN_CONFIGURATION: {
        //     const index = state.runConfigurations.find(r => r.id === action);
        //     state.runConfigurations.filter(r => r.id !== action.data);
        //     return {
        //         ...state,
        //         runConfigurations: 
        //     };
        // }

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
