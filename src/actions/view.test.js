import * as actions from './view';

describe('actions', () => {
    it('should create an action to close all the panels', () => {
        const expectedAction = {
            type: 'CLOSE_ALL_PANELS'
        };
        expect(actions.closeAllPanels()).toEqual(expectedAction);
    });

    it('should create an action to toggle the transactions history panel', () => {
        const expectedAction = {
            type: 'TOGGLE_TRANSACTIONS_HISTORY_PANEL'
        };
        expect(actions.toggleTransactionsHistoryPanel()).toEqual(expectedAction);
    });

    it('should create an action to show the transactions history panel', () => {
        const expectedAction = {
            type: 'OPEN_TRANSACTIONS_HISTORY_PANEL'
        };
        expect(actions.openTransactionsHistoryPanel()).toEqual(expectedAction);
    });

    it('should create an action to close the transactions history panel', () => {
        const expectedAction = {
            type: 'CLOSE_TRANSACTIONS_HISTORY_PANEL'
        };
        expect(actions.closeTransactionsHistoryPanel()).toEqual(expectedAction);
    });
});
