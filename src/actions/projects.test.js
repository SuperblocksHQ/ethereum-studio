import * as actions from './projects';
import ProjectItem from '../components/projecteditor/control/item/projectItem';
jest.mock('../components/projecteditor/control/item/projectItem'); // ProjectItem is now a mock constructor

describe('actions', () => {
    beforeAll(() => {
        ProjectItem.mockImplementation(() => {
            return {
                getInode: () => {
                    return 123
                }
            }
        });
    });

    it('should create an action to select the projec to open when re-loading the app', () => {
        const projectItem = new ProjectItem();

        const expectedAction = {
            type: 'SELECT_PROJECT',
            data: 123,
        };
        expect(actions.selectProject(projectItem)).toEqual(expectedAction);
    });
});
