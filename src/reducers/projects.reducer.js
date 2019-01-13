export const initialState = {
    selectedProject: {
        id: 0,
        name: ''
    },
};

export default function projectsReducer(state = initialState, action) {
    switch (action.type) {
        case 'SELECT_PROJECT': {
            return {
                ...state,
                selectedProject: action.data ? { ...action.data } : initialState.selectedProject,
            };
        }
        default:
            return state;
    }
}
