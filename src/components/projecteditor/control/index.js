import { connect } from 'react-redux';

import Control from './control';
import { getAppVersion } from '../../../selectors/app';
import { getSelectedProjectId } from '../../../selectors/projects';
import { getRedrawUI } from '../../../selectors/explorer.selector';
import { projectActions, explorerActions } from '../../../actions';
import { closeAllPanels } from '../../../actions/view';

const mapStateToProps = state => ({
    appVersion: getAppVersion(state),
    selectedProjectId: getSelectedProjectId(state),
    redrawUI: getRedrawUI(state)
});

const mapDispatchToProps = dispatch => {
    return {
        selectProject: (id, name) => {
            dispatch(projectActions.selectProject(id, name));
        },
        closeAllPanels: () => {
            dispatch(closeAllPanels())
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
