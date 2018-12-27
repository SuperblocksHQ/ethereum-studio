import { settingsActions } from './settings.actions';

describe('actions', () => {
    it('should create an action to do not show the splash screen anymore', () => {
        const data = false;
        const expectedAction = {
            type: settingsActions.SHOW_SPLASH,
            data,
        };
        expect(settingsActions.showSplashNoMore()).toEqual(expectedAction);
    });
});
