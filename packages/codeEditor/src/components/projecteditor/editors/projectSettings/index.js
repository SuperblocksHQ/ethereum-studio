import { connect } from 'react-redux';
import { projectsActions } from '../../../../actions';
import ProjectSettings from './ProjectSettings';

const mapDispatchToProps = dispatch => {
    return {
        updateProjectSettings: (newProjectSettings) => {
            dispatch(projectsActions.updateProjectSettings(newProjectSettings))
        },
    };
};

export default connect(null,mapDispatchToProps)(ProjectSettings);
