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

import { ProjectItemTypes, IProjectItem } from '../models';

export const explorerActions = {
    INIT_EXPLORER: 'INIT_EXPLORER',
    initExplorer(tree: any) {
        return {
            type: explorerActions.INIT_EXPLORER,
            data: tree
        };
    },

    // TODO: remove this action
    RENAME_FILE: 'RENAME_FILE',
    renameFile(id: string, name: string) { // maybe should use filepath instead
        return {
            type: explorerActions.RENAME_FILE,
            data: { id, name }
        };
    },

    TOGGLE_TREE_ITEM: 'TOGGLE_TREE_ITEM',
    toggleTreeItem(id: string) {
        return {
            type: explorerActions.TOGGLE_TREE_ITEM,
            data: { id }
        };
    },

    CREATE_FOLDER_BY_PATH: 'CREATE_FOLDER_BY_PATH',
    createFolderWith(path: string[], items: IProjectItem[]) {
        return {
            type: explorerActions.CREATE_FOLDER_BY_PATH,
            data: { path, items }
        };
    },

    // --------- Contract specific

    CONFIGURE_CONTRACT: 'CONFIGURE_CONTRACT',
    configureContract(item: IProjectItem) {
        return {
            type: explorerActions.CONFIGURE_CONTRACT,
            data: item
        };
    },

    COMPILE_CONTRACT: 'COMPILE_CONTRACT',
    compileContract(item: IProjectItem) {
        return {
            type: explorerActions.COMPILE_CONTRACT,
            data: item
        };
    },

    DEPLOY_CONTRACT: 'DEPLOY_CONTRACT',
    deployContract(item: IProjectItem) {
        return {
            type: explorerActions.DEPLOY_CONTRACT,
            data: item
        };
    },

    INTERACT_CONTRACT: 'INTERACT_CONTRACT',
    interactContract(item: IProjectItem) {
        return {
            type: explorerActions.INTERACT_CONTRACT,
            data: item
        };
    },

    // ----- Context menu

    CREATE_ITEM: 'CREATE_ITEM',
    createItem(parentId: string, itemType: ProjectItemTypes, name: string) {
        return {
            type: explorerActions.CREATE_ITEM,
            data: { parentId, itemType, name }
        };
    },

    CREATE_ITEM_FAIL: 'CREATE_ITEM_FAIL',
    createItemFail(id: string) {
        return {
            type: explorerActions.CREATE_ITEM_FAIL,
            data: { id }
        };
    },

    IMPORT_FILE: 'IMPORT_FILE',
    importFile(parentId: string) {
        return {
            type: explorerActions.IMPORT_FILE,
            data: { parentId }
        };
    },

    RENAME_ITEM: 'RENAME_ITEM',
    renameItem(id: string, name: string) {
        return {
            type: explorerActions.RENAME_ITEM,
            data: { id, name }
        };
    },

    RENAME_ITEM_FAIL: 'RENAME_ITEM_FAIL',
    renameItemFail(id: string, oldName: string) {
        return {
            type: explorerActions.RENAME_ITEM_FAIL,
            data: { id, oldName }
        };
    },

    DELETE_ITEM: 'DELETE_ITEM',
    deleteItem(id: string) {
        return {
            type: explorerActions.DELETE_ITEM,
            data: { id }
        };
    },

    DELETE_ITEM_SUCCESS: 'DELETE_ITEM_SUCCESS',
    deleteItemSuccess(id: string) {
        return {
            type: explorerActions.DELETE_ITEM_SUCCESS,
            data: { id }
        };
    },

    DELETE_ITEM_FAIL: 'DELETE_ITEM_FAIL',
    deleteItemFail(id: string) {
        return {
            type: explorerActions.DELETE_ITEM_FAIL,
            data: { id }
        };
    },
};
