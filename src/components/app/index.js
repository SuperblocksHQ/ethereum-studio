import { connect } from 'react-redux';
import { appActions, ipfsActions } from '../../actions';
import { getShowAnalyticsTrackingDialog } from '../../selectors/settings';
import { appSelectors } from '../../selectors';
import App from './App';

const mapStateToProps = state => ({
    showTrackingAnalyticsDialog: getShowAnalyticsTrackingDialog(state),
    appVersion: appSelectors.getAppVersion(state),
});

const mapDispatchToProps = dispatch => {
    return {
        notifyAppStart: (isEmbeddedMode) => {
            dispatch(appActions.notifyAppStart(isEmbeddedMode));
        },
        importProjectFromIpfs: (hash) => {
            dispatch(ipfsActions.importProjectFromIpfs(hash));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
