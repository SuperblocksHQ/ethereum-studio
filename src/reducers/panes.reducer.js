import { panesActions, explorerActions } from '../actions'
import { replaceInArray } from './utils';

export const initialState = {
    panes: []
};

export default function panesReducer(state = initialState, action) {
    switch (action.type) {
        case panesActions.ADD_PANE:
            return {
                ...state,
                panes: [ { ... action.data } ].concat(state.panes)
            };
        case panesActions.REMOVE_PANE:
            return {
                ...state,
                panes: state.panes.filter(p => p.id !== action.data.id)
            };
        case explorerActions.RENAME_FILE: {
            return {
                ...state,
                panes: replaceInArray(state.panes, p => p.fileId === action.data.id, p => ({ ...p, name: action.data.name }))
            };
        }
        default:
            return state;
    }
}
