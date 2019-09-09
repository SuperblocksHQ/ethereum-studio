import { connect } from 'react-redux';
import { projectSelectors } from '../../../selectors';
import { projectsActions } from '../../../actions';
import ProjectTitle from './ProjectTitle';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

const mapStateToProps = (state: any) => ({
    projectId: projectSelectors.getProjectId(state),
    isOwnProject: projectSelectors.getIsOwnProject(state)
});

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
    return {
        deleteProject: (projectId: string, redirect: boolean) => {
            dispatch(projectsActions.deleteProject(projectId, redirect));
        },
        renameProject: (newName: string) => {
            dispatch(projectsActions.renameProject(newName));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTitle);
