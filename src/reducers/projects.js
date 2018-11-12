import Store from '../store/projects';

export const initialState = Store;

export default function projectsReducer(state = initialState, action) {
    switch (action.type) {
        case 'SELECT_PROJECT': {
            return {
                ...state,
                selectedProjectId: action.data,
            };
        }
        default:
            return state;
    }
}
