import { connect } from 'react-redux';
import { getAppVersion } from '../../selectors/app';
import ContactContainer from './ContactContainer';

const mapStateToProps = state => ({
    appVersion: getAppVersion(state),
});

export default connect(mapStateToProps, null)(ContactContainer);
