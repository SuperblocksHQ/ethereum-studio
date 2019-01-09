import { sidePanelsActions } from './sidePanels.actions';

describe('actions', () => {
    it('should create an action to toggle the transactions history panel', () => {
        const expectedAction = {
            type: 'TOGGLE_TRANSACTIONS_HISTORY_PANEL'
        };
        expect(sidePanelsActions.toggleTransactionsHistoryPanel()).toEqual(expectedAction);
    });

    it('should create an action to show the transactions history panel', () => {
        const expectedAction = {
            type: 'OPEN_TRANSACTIONS_HISTORY_PANEL'
        };
        expect(sidePanelsActions.openTransactionsHistoryPanel()).toEqual(expectedAction);
    });

    it('should create an action to close the transactions history panel', () => {
        const expectedAction = {
            type: 'CLOSE_TRANSACTIONS_HISTORY_PANEL'
        };
        expect(sidePanelsActions.closeTransactionsHistoryPanel()).toEqual(expectedAction);
    });
});
