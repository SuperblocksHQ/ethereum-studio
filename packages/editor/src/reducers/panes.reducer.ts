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

import { panesActions, explorerActions, projectsActions } from '../actions';
import { replaceInArray, moveInArray } from './utils';
import { AnyAction } from 'redux';
import { IPanesState, PaneType } from '../models/state';

export const initialState: IPanesState = {
    activePane: null,
    items: []
};

export default function panesReducer(state = initialState, action: AnyAction, rootState: any) {
    switch (action.type) {

        case panesActions.OPEN_FILE: {
            const currentPane = state.activePane;
            const activePane = action.data.id;

            if (currentPane === activePane) {
                return {
                    ...state
                };
            }

            const items = replaceInArray(state.items.slice(), p => p.active, p => ({ ...p, active: false }));
            const itemIndex = items.findIndex(i => i.file.id === action.data.id);

            if (itemIndex >= 0) {
                items[itemIndex] = { ...items[itemIndex], active: true };
            } else {
                items.unshift({ file: action.data, active: true, hasUnsavedChanges: false, type: PaneType.FILE });
            }
            return {
                ...state,
                activePane,
                items
            };
        }

        case panesActions.CLOSE_PANE: {
            const removeItemIndex = state.items.findIndex(i => i.file.id === action.data.id);

            if (removeItemIndex < 0) {
                return state;
            }

            // remove pane
            const items = state.items.slice();
            const removedPane = items.splice(removeItemIndex, 1)[0];
            let activePane = null;

            if (removedPane.active) {
                // activate next item or the last one
                const activeItemIndex = Math.min(items.length - 1, removeItemIndex);
                if (activeItemIndex >= 0) {
                    items[activeItemIndex] = { ...items[activeItemIndex], active: true };
                    activePane = items[activeItemIndex].file.id;
                }
            }

            return {
                ...state,
                activePane,
                items
            };
        }

        case panesActions.CLOSE_ALL_OTHER_PANES: {
            const item = state.items.find(i => i.file.id === action.data.id);
            if (!item) {
                return state;
            }

            return {
                ...state,
                items: [ item ]
            };
        }

        case panesActions.CLOSE_ALL_PANES: {
            return initialState;
        }

        case panesActions.SAVE_FILE_SUCCESS: {
            return {
                ...state,
                items: replaceInArray(
                    state.items,
                    p => p.file.id === action.data.fileId,
                    p => ({ ...p, hasUnsavedChanges: false, file: { ...p.file, code: action.data.code } })
                )
            };
        }

        case panesActions.STORE_UNSAVED_CHANGES:
            const { fileId, code, hasUnsavedChanges } = action.data;

            return {
                ...state,
                items: replaceInArray(
                    state.items,
                    p => p.file.id === fileId,
                    p => ({ ...p, file: { ...p.file, code }, hasUnsavedChanges })
                )
            };

        case projectsActions.SAVE_PROJECT_SUCCESS:
            const newItems = state.items.map((pane) => {
                pane.hasUnsavedChanges = false;
                return pane;
            });
            return { ...state, items: newItems };

        case explorerActions.RENAME_ITEM_SUCCESS:
            return {
                ...state,
                items: replaceInArray(
                    state.items,
                    p => p.file.id === action.data.id,
                    p => ({ ...p, file: { ...p.file, name: action.data.name }})
                )
            };

        case panesActions.MOVE_PANE: {
            return {
                ...state,
                items: moveInArray(
                    state.items,
                    action.data.fromIndex,
                    action.data.toIndex
                )
            };
        }

        default:
            return state;
    }
}
