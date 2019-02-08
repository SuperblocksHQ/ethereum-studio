import { connect } from 'react-redux';
import { projectSelectors } from '../../../selectors';
import { projectsActions } from '../../../actions';
import ProjectTitle from './ProjectTitle';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

const mapStateToProps = (state: any) => ({
    projectId: projectSelectors.getProjectId(state),
});

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
    return {
        renameProject: (newName: string) => {
            dispatch(projectsActions.renameProject(newName));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTitle);
