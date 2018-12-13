export const explorerActions = {
    RENAME_FILE: 'RENAME_FILE',
    renameFile(id, name) { // maybe should use filepath instead
        return {
            type: explorerActions.RENAME_FILE,
            data: { id, name }
        };
    }
};
