import * as actions from './projects';

describe('actions', () => {
  it('should create an action to select the project to open when re-loading the app', () => {
    const data = { props: { state: { data: { dir : 'project-name' }}}};
    const expectedAction = {
      type: 'SELECT_PROJECT',
      data: 'project-name'
    }
    expect(actions.selectProject(data)).toEqual(expectedAction)
  })
})
