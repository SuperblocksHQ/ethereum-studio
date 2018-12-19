import { connect } from 'react-redux';
import { settingsActions } from '../../actions';
import { getShowSplashScreen } from '../../selectors/settings';
import { getAppVersion } from '../../selectors/app';
import App from './App';

const mapStateToProps = state => ({
    showSplash: getShowSplashScreen(state),
    appVersion: getAppVersion(state),
});

const mapDispatchToProps = dispatch => {
    return {
        showSplashNoMore: () => {
            dispatch(settingsActions.showSplashNoMore());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
