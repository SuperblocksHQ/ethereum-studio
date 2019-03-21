import { IProjectItem } from '../models';

export const panesActions = {
    OPEN_FILE: 'OPEN_FILE',
    openFile(file: IProjectItem) {
        return {
            type: panesActions.OPEN_FILE,
            data: file
        };
    },

    CLOSE_PANE: 'CLOSE_PANE',
    closePane(fileId: string) {
        return {
            type: panesActions.CLOSE_PANE,
            data: { id: fileId }
        };
    },

    CLOSE_ALL_OTHER_PANES: 'CLOSE_ALL_OTHER_PANES',
    closeAllOtherPanes(fileId: string) {
        return {
            type: panesActions.CLOSE_ALL_OTHER_PANES,
            data: { id: fileId }
        };
    },

    CLOSE_ALL_PANES: 'CLOSE_ALL_PANES',
    closeAllPanes() {
        return {
            type: panesActions.CLOSE_ALL_PANES
        };
    },

    SET_ACTIVE_PANE: 'SET_ACTIVE_PANE',
    setActivePane(id: string) {
        return {
            type: panesActions.SET_ACTIVE_PANE,
            data: { id }
        };
    },

    SAVE_FILE: 'SAVE_FILE',
    saveFile(fileId: string, code: string) {
        return {
            type: panesActions.SAVE_FILE,
            data: { fileId, code }
        };
    },

    SAVE_FILE_SUCCESS: 'SAVE_FILE_SUCCESS',
    saveFileSuccess(fileId: string, code: string) {
        return {
            type: panesActions.SAVE_FILE_SUCCESS,
            data: { fileId, code }
        };
    },

    SAVE_FILE_FAIL: 'SAVE_FILE_FAIL',
    saveFileFail(fileId: string, code: string) {
        return {
            type: panesActions.SAVE_FILE_FAIL,
            data: { fileId, code }
        };
    },

    SET_UNSAVED_CHANGES: 'SET_UNSAVED_CHANGES',
    setUnsavedChanges(fileId: string, hasUnsavedChanges: boolean) {
        return {
            type: panesActions.SET_UNSAVED_CHANGES,
            data: { fileId, hasUnsavedChanges }
        };
    }
};
