export const panesActions = {
    ADD_PANE: 'ADD_PANE',
    addPane(id, name) {
        return {
            type: panesActions.ADD_PANE,
            data: { id, name } 
        }
    },

    REMOVE_PANE: 'REMOVE_PANE',
    removePane(id) {
        return {
            type: panesActions.REMOVE_PANE,
            data: { id }
        }
    }
};
