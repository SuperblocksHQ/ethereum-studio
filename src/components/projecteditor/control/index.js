import { connect } from 'react-redux';
import Control from './control';
import { projectSelectors, appSelectors } from '../../../selectors';
import { projectsActions, explorerActions, sidePanelsActions } from '../../../actions';

const mapStateToProps = state => ({
    appVersion: appSelectors.getAppVersion(state),
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
