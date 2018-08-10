import Store from '../store/recipes';

export const initialState = Store;

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'SELECT_PROJECT': {
            return {
            ...state,
            selectedProject: action.data,
            };
        }
        default:
            return state;
    }
}
