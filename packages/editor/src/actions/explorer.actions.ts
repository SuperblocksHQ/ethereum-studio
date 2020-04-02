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

import { ProjectItemTypes, IProjectItem, IApiError } from '../models';

export const explorerActions = {
    INIT_EXPLORER: 'INIT_EXPLORER',
    initExplorer(tree: any) {
        return {
            type: explorerActions.INIT_EXPLORER,
            data: tree
        };
    },

    INIT_EXPLORER_SUCCESS: 'INIT_EXPLORER_SUCCESS',
    initExplorerSuccess() {
        return {
            type: explorerActions.INIT_EXPLORER_SUCCESS,
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

    /**
     * Ensure there is folder with provided path and add item to it.
     */
    CREATE_PATH_WITH_CONTENT: 'CREATE_PATH_WITH_CONTENT',
    createPathWithContent(path: string[], items: IProjectItem[]) {
        return {
            type: explorerActions.CREATE_PATH_WITH_CONTENT,
            data: { path, items }
        };
    },

    UPDATE_TREE_SUCCESS: 'UPDATE_TREE_SUCCESS',
    updateTreeSuccess() {
        return {
            type: explorerActions.UPDATE_TREE_SUCCESS
        };
    },

    UPDATE_TREE_FAIL: 'UPDATE_TREE_FAIL',
    updateTreeFail(error: IApiError) {
        return {
            type: explorerActions.UPDATE_TREE_FAIL,
            data: error
        };
    },

    MOVE_ITEM: 'MOVE_ITEM',
    moveItem(sourceId: string, targetId: string) {
        return {
            type: explorerActions.MOVE_ITEM,
            data: { sourceId, targetId }
        };
    },

    MOVE_ITEM_SUCCESS: 'MOVE_ITEM_SUCCESS',
    moveItemSuccess(sourceId: string) {
        return {
            type: explorerActions.MOVE_ITEM_SUCCESS,
            data: { sourceId }
        };
    },

    MOVE_ITEM_FAIL: 'MOVE_ITEM_FAIL',
    moveItemFail(sourceId: string) {
        return {
            type: explorerActions.MOVE_ITEM_FAIL,
            data: { sourceId }
        };
    },

    // --------- Contract specific
    COMPILE_CONTRACT: 'COMPILE_CONTRACT',
    compileContract(item: IProjectItem, shouldBeDeployed?: boolean) {
        return {
            type: explorerActions.COMPILE_CONTRACT,
            data: {item, shouldBeDeployed}
        };
    },

    // ----- Context menu

    CREATE_ITEM: 'CREATE_ITEM',
    createItem(parentId: string, itemType: ProjectItemTypes, name: string, code?: string) {
        return {
            type: explorerActions.CREATE_ITEM,
            data: { parentId, itemType, name, code }
        };
    },

    CREATE_ITEM_SUCCESS: 'CREATE_ITEM_SUCCESS',
    createItemSuccess() {
        return {
            type: explorerActions.CREATE_ITEM_SUCCESS,
        };
    },

    CREATE_ITEM_FAIL: 'CREATE_ITEM_FAIL',
    createItemFail(id: string) {
        return {
            type: explorerActions.CREATE_ITEM_FAIL,
            data: { id }
        };
    },

    IMPORT_FILES: 'IMPORT_FILES',
    importFiles(parentId: string, items: IProjectItem[]) {
        return {
            type: explorerActions.IMPORT_FILES,
            data: { parentId, items }
        };
    },

    IMPORT_FILES_SUCCESS: 'IMPORT_FILES_SUCCESS',
    importFilesSuccess() {
        return {
            type: explorerActions.IMPORT_FILES_SUCCESS,
        };
    },

    IMPORT_FILES_FAIL: 'IMPORT_FILES_FAIL',
    importFilesFail(id: string) {
        return {
            type: explorerActions.IMPORT_FILES_FAIL,
            data: { id }
        };
    },

    RENAME_ITEM: 'RENAME_ITEM',
    renameItem(id: string, name: string) {
        return {
            type: explorerActions.RENAME_ITEM,
            data: { id, name }
        };
    },

    RENAME_ITEM_SUCCESS: 'RENAME_ITEM_SUCCESS',
    renameItemSuccess(id: string, name: string) {
        return {
            type: explorerActions.RENAME_ITEM_SUCCESS,
            data: { id, name }
        };
    },

    RENAME_ITEM_FAIL: 'RENAME_ITEM_FAIL',
    renameItemFail(id: string, name: string) {
        return {
            type: explorerActions.RENAME_ITEM_FAIL,
            data: { id, name }
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

    // ----- DappFile update
    UPDATE_DAPPFILE: 'UPDATE_DAPPFILE',
    updateDappfile(id?: string) {
        return {
            type: explorerActions.UPDATE_DAPPFILE,
            data: { id }
        };
    },
    UPDATE_DAPPFILE_SUCCESS: 'UPDATE_DAPPFILE_SUCCESS',
    updateDappfileSuccess() {
        return {
            type: explorerActions.UPDATE_DAPPFILE_SUCCESS
        };
    },
    UPDATE_DAPPFILE_FAIL: 'UPDATE_DAPPFILE_FAIL',
    updateDappfileFail(error: any) {
        return {
            type: explorerActions.UPDATE_DAPPFILE_FAIL,
            data: error
        };
    },
};
