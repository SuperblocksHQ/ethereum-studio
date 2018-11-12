import { connect } from 'react-redux';
import { showSplashNoMore } from '../../actions/settings';
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
            dispatch(showSplashNoMore());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
