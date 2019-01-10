import { connect } from 'react-redux';

import Control from './control';
import { getAppVersion } from '../../../selectors/app';
import { getSelectedProjectId } from '../../../selectors/projects';
import { closeAllPanels } from '../../../actions/view';
import { projectActions, selectProject, explorerActions, sidePanelsActions } from '../../../actions';

const mapStateToProps = state => ({
    appVersion: getAppVersion(state),
    selectedProjectId: getSelectedProjectId(state)
});

const mapDispatchToProps = dispatch => {
    return {
        selectProject: (id, name) => {
            dispatch(projectActions.selectProject(id, name));
        },
        closeAllPanels: () => {
            dispatch(sidePanelsActions.closeAllPanels())
        },
        renameFile: (id, name) => {
            dispatch(explorerActions.renameFile(id, name));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Control);
