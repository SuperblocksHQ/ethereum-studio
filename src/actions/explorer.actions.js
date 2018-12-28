export const explorerActions = {
    // TODO: This should not be forced through an event, but until we have a solid
    // way to update automatically the UI
    REDRAW_UI: 'REDRAW_UI',
    redrawUI() {
        return {
            type: explorerActions.REDRAW_UI,
        };
    },
    RENAME_FILE: 'RENAME_FILE',
    renameFile(id, name) { // maybe should use filepath instead
        return {
            type: explorerActions.RENAME_FILE,
            data: { id, name }
        };
    }
};
