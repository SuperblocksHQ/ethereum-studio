import { panesActions } from '../actions'

export const initialState = {
    panes: []
};

export default function panesReducer(state = initialState, action) {
    switch (action.type) {
        case panesActions.ADD_PANE: {
            return {
                ...state,
                panes: state.panes.concat([ { ... action.data } ])
            };
        }
        case panesActions.REMOVE_PANE: {
            return {
                ...state,
                panes: state.panes.filter(p => p.id !== action.data.id)
            }
        }
        default:
            return state;
    }
}
