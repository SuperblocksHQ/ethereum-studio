import { connect } from 'react-redux';
import { ipfsActions } from '../../../../actions';
import Editor from './Editor';

const mapDispatchToProps = dispatch => {
    return {
        forkProject: () => {
            dispatch(ipfsActions.forkProject())
        },
    };
};

export default connect(null,mapDispatchToProps)(Editor);
