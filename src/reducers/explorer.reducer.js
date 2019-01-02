import { explorerActions } from '../actions'

export const initialState = {
    redrawUI: false
};

export default function explorerReducer(state = initialState, action) {
    switch (action.type) {
        case explorerActions.REDRAW_UI: {
            return {
                ...state,
                redrawUI: !state.redrawUI // Always trigger a redraw when this event gets fired
            };
        }
        default:
            return state;
    }
}
