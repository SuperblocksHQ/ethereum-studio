import * as actions from './settings';

describe('actions', () => {
    it('should create an action to do not show the splash screen anymore', () => {
        const data = false;
        const expectedAction = {
            type: 'SHOW_SPLASH',
            data,
        };
        expect(actions.showSplashNoMore()).toEqual(expectedAction);
    });
});
