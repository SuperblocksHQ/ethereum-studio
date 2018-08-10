import { connect } from 'react-redux';
import Control from './control';

const mapStateToProps = state => ({
    appVersion: state.app.version || '',
  });

export default connect(mapStateToProps, null)(Control);
