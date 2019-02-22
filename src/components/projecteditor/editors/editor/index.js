import { connect } from 'react-redux';
import { ipfsActions } from '../../../../actions';
import Editor from './Editor';

const mapDispatchToProps = dispatch => {
    return {
        forkCurrentProject: () => {
            dispatch(ipfsActions.forkCurrentProject())
        },
    };
};

export default connect(null,mapDispatchToProps)(Editor);
