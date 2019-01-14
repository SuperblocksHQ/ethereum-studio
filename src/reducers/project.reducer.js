import { projectActions } from '../actions';

export const initialState = {
    selectedProject: {
        id: 0,
        name: ''
    },
};

export default function projectsReducer(state = initialState, action) {
    switch (action.type) {
        case projectActions.SELECT_PROJECT: {
            return {
                ...state,
                selectedProject: action.data ? { ...action.data } : initialState.selectedProject,
            };
        }
        case projectActions.UPDATE_PROJECT_SETTINGS_SUCCESS: {
            return {
                ...state,
                selectedProject: {
                    ...state.selectedProject,
                    name: action.data.name
                },
            };
        }
        default:
            return state;
    }
}
