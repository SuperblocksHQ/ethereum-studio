import { connect } from 'react-redux';
import { toastSelectors } from '../../../selectors/toast.selectors';
import { toastActions } from '../../../actions';
import ToastContainer from './ToastContainer';

const mapStateToProps = state => ({
    toasts: toastSelectors.getToasts(state),
});

function mapDispatchToProps(dispatch) {
    return {
        toastDismissed: (index) => {
            dispatch(toastActions.toastDismissed(index))
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ToastContainer);
