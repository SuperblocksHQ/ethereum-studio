import { connect } from 'react-redux';

import Control from './control';
import { getAppVersion } from '../../../selectors/app';
import { getSelectedProjectId } from '../../../selectors/projects';
import { selectProject } from '../../../actions/projects';
import { closeAllPanels } from '../../../actions/view';

const mapStateToProps = state => ({
    appVersion: getAppVersion(state),
    selectedProjectId: getSelectedProjectId(state),
});

const mapDispatchToProps = dispatch => {
    return {
        selectProject: project => {
            dispatch(selectProject(project));
        },
        closeAllPanels: () => {
            dispatch(closeAllPanels())
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Control);
