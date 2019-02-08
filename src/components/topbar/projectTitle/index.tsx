import { connect } from 'react-redux';
import { userActions } from '../../../actions';
import { userSelectors } from '../../../selectors';
import ProjectTitle from './ProjectTitle';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

const mapStateToProps = (state: any) => ({
    projectList: userSelectors.getProjectList(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return {
        getProjectList: () => {
            dispatch(userActions.getProjectList());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTitle);
