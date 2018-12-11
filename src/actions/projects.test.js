import * as actions from './projects';

describe('actions', () => {
    it('should create an action to select the projec to open when re-loading the app', () => {
        const expectedAction = {
            type: 'SELECT_PROJECT',
            data: { id: 23, name: 'test' },
        };
        expect(actions.selectProject(23, 'test')).toEqual(expectedAction);
    });
});
