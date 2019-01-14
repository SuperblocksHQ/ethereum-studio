import { connect } from 'react-redux';
import { projectActions } from '../../../../actions';
import ProjectSettings from './ProjectSettings';

const mapDispatchToProps = dispatch => {
    return {
        updateProjectSettings: (newProjectSettings) => {
            dispatch(projectActions.updateProjectSettings(newProjectSettings))
        },
    };
};

export default connect(null,mapDispatchToProps)(ProjectSettings);
