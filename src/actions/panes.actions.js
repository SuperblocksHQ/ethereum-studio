export const panesActions = {
    ADD_PANE: 'ADD_PANE',
    addPane(id, name, fileId) {
        return {
            type: panesActions.ADD_PANE,
            data: { id, name, fileId } 
        }
    },

    REMOVE_PANE: 'REMOVE_PANE',
    removePane(id) {
        return {
            type: panesActions.REMOVE_PANE,
            data: { id }
        }
    },

    SET_ACTIVE_PANE: 'SET_ACTIVE_PANE',
    setActivePane(id) {
        return {
            type: panesActions.SET_ACTIVE_PANE,
            data: { id }
        };
    }
};
