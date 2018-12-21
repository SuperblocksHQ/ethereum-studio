import { connect } from 'react-redux';
import { settingsActions, appActions } from '../../actions';
import { getShowSplashScreen, getShowAnalyticsTrackingDialog } from '../../selectors/settings';
import { getAppVersion } from '../../selectors/app';
import App from './App';

const mapStateToProps = state => ({
    showSplash: getShowSplashScreen(state),
    showTrackingAnalyticsDialog: getShowAnalyticsTrackingDialog(state),
    appVersion: getAppVersion(state),
});

const mapDispatchToProps = dispatch => {
    return {
        notifyAppStart: () => {
            dispatch(appActions.notifyAppStart());
        },
        showSplashNoMore: () => {
            dispatch(settingsActions.showSplashNoMore());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
