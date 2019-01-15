import { connect } from 'react-redux';
import Control from './control';
import { getAppVersion } from '../../../selectors/app';
import { projectSelectors } from '../../../selectors';
import { projectsActions, explorerActions, sidePanelsActions } from '../../../actions';

const mapStateToProps = state => ({
    appVersion: getAppVersion(state),
    selectedProjectId: projectSelectors.getSelectedProjectId(state)
});

const mapDispatchToProps = dispatch => {
    return {
        selectProject: (project) => {
            dispatch(projectsActions.selectProject(project));
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
