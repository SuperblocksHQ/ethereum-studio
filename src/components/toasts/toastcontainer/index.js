import { connect } from 'react-redux';
import { toastSelectors } from '../../../selectors/toast.selectors'
import ToastContainer from './ToastContainer';

const mapStateToProps = state => ({
    toasts: toastSelectors.getToasts(state),
});

export default connect(mapStateToProps, null)(ToastContainer);
