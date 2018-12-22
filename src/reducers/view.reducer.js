import View from '../store/view';

export const initialState = View;

export default function viewReducers(state = initialState, action) {
    switch (action.type) {
        case 'CLOSE_ALL_PANELS': {
            return {
                ...state,
                panel: {
                    showTransactionsHistory: false
                }
            };
        }
        case 'TOGGLE_TRANSACTIONS_HISTORY_PANEL': {
            return {
                ...state,
                panel: {
                    showTransactionsHistory: !state.panel.showTransactionsHistory,
                }
            };
        }
        case 'OPEN_TRANSACTIONS_HISTORY_PANEL': {
            return {
                ...state,
                panel: {
                    showTransactionsHistory: true,
                }

            };
        }
        case 'CLOSE_TRANSACTIONS_HISTORY_PANEL': {
            return {
                ...state,
                panel: {
                    showTransactionsHistory: false,
                }
            };
        }
        default:
            return state;
    }
}
