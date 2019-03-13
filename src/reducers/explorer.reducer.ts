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

import { explorerActions, panesActions } from '../actions';
import { isValidProjectItemName, replaceInArray } from './utils';
import { IExplorerState, IItemNameValidation } from '../models/state';
import { IProjectItem } from '../models';
import { AnyAction } from 'redux';
import { generateUniqueId } from '../services/utils';
import { updateItemInTree, sortProjectItems, findItemById, addOrReplaceChildItems, ensurePath } from './explorerLib';

export const initialState: IExplorerState = {
    tree: null,
    itemNameValidation: { isValid: false },
    lastDeletedId: null
};

function hasNoChildWithName(parentItem: Nullable<IProjectItem>, name: string) {
    return parentItem && parentItem.children.every(c => c.name.toLowerCase() !== name.toLowerCase());
}

export default function explorerReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case explorerActions.INIT_EXPLORER:
            return { ...state, tree: action.data };

        case explorerActions.TOGGLE_TREE_ITEM:
            return {
                ...state,
                tree: updateItemInTree(state.tree, action.data.id, (i: IProjectItem) => ({ ...i, opened: !i.opened }))[0]
            };

        case explorerActions.RENAME_ITEM: {
            let itemNameValidation: IItemNameValidation = initialState.itemNameValidation;
            let tree: Nullable<IProjectItem> = state.tree;
            const name = action.data.name.trim();

            if (isValidProjectItemName(name)) {
                const parentItem = findItemById(state.tree, action.data.id).parentItem;

                // do update only in case there is no item with the same name in target directory
                if (hasNoChildWithName(parentItem, name.toLowerCase())) {
                    const [newTree, replacedTargetItem] = updateItemInTree(state.tree, action.data.id, (i: IProjectItem) => ({ ...i, name }));
                    if (replacedTargetItem) {
                        itemNameValidation = {
                            isValid: true,
                            name,
                            oldName: replacedTargetItem.name,
                            itemId: action.data.id
                        };
                        tree = newTree;
                    }
                }

            }

            return {
                ...state,
                tree,
                itemNameValidation
            };
        }

        case explorerActions.RENAME_ITEM_FAIL:
            return {
                ...state,
                tree: updateItemInTree(
                    state.tree,
                    action.data.id,
                    i => ({ ...i, name: action.data.oldName })
                )[0],
                itemNameValidation: initialState.itemNameValidation
            };

        case explorerActions.CREATE_ITEM: {

            let itemNameValidation: IItemNameValidation = initialState.itemNameValidation;
            let tree: Nullable<IProjectItem> = state.tree;
            const name = action.data.name.trim();

            if (isValidProjectItemName(action.data.name)) {
                const parentItem = findItemById(state.tree, action.data.parentId).item;

                if (hasNoChildWithName(parentItem, name)) {

                    const newItem: IProjectItem = {
                        id: generateUniqueId(),
                        name,
                        mutable: true,
                        type: action.data.itemType,
                        opened: false,
                        children: []
                    };

                    // add new item to the tree
                    const [newTree, replacedTargetItem] = updateItemInTree(
                        state.tree,
                        action.data.parentId,
                        i => ({ ...i, children: sortProjectItems(i.children.concat([newItem])) })
                    );

                    // parent item was found and child was added
                    if (replacedTargetItem) {
                        itemNameValidation = {
                            isValid: true,
                            name,
                            itemId: newItem.id
                        };
                        tree = newTree;
                    }
                }
            }
            return {
                ...state,
                tree,
                itemNameValidation
            };
        }

        case explorerActions.DELETE_ITEM: {
            const [tree, deletedItem] = updateItemInTree(state.tree, action.data.id, i => ({...i, deleted: true }));

            return {
                ...state,
                tree,
                lastDeletedId: deletedItem && deletedItem.id
            };
        }

        case explorerActions.MOVE_ITEM: {
            const { sourceId, targetId } = action.data;
            let itemNameValidation: IItemNameValidation = initialState.itemNameValidation;
            let tree: Nullable<IProjectItem> = state.tree;

            // Add source item to target folder
            const sourceItem = updateItemInTree(
                state.tree,
                sourceId,
                i => null
            )[1];

            let newTree = state.tree;
            let replacedTargetItem = null;

            // Remove source item
            if (sourceItem) {
                [newTree, replacedTargetItem] = updateItemInTree(
                    state.tree,
                    targetId,
                    i => ({ ...i, children: sortProjectItems(i.children.concat([sourceItem])) })
                );

                // parent item was found and child was added
                if (replacedTargetItem) {
                    itemNameValidation = {
                        isValid: true,
                        name,
                        itemId: sourceItem.id
                    };
                    tree = newTree;
                }
            }

            return {
                ...state,
                tree,
                itemNameValidation
            };
        }

        case explorerActions.CREATE_ITEM_FAIL:
        case explorerActions.DELETE_ITEM_SUCCESS:
            return {
                ...state,
                tree: updateItemInTree(state.tree, action.data.id, i => null)[0],
                itemNameValidation: initialState.itemNameValidation,
                lastDeletedId: null
            };

        case explorerActions.DELETE_ITEM_FAIL:
            return {
                ...state,
                tree: updateItemInTree(state.tree, action.data.id, i => ({...i, deleted: false}))[0],
                lastDeletedId: null
            };

        case panesActions.SAVE_FILE:
            return {
                ...state,
                tree: updateItemInTree(state.tree, action.data.fileId, i => ({...i, code: action.data.code}))[0],
            };

        case panesActions.SAVE_FILE_FAIL:
            return {
                ...state,
                tree: updateItemInTree(state.tree, action.data.fileId, i => ({...i, code: action.data.code}))[0],
            };

        case explorerActions.CREATE_PATH_WITH_CONTENT: {
            if (!state.tree) {
                return state;
            }

            const tree: IProjectItem = { ...state.tree };
            const resultFolder = ensurePath(tree, action.data.path);
            resultFolder.children = addOrReplaceChildItems(resultFolder, action.data.items).children;

            return { ...state, tree };
        }

        default:
            return state;
    }
}
