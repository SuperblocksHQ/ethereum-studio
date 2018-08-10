import { connect } from 'react-redux';
import { showSplashNoMore } from '../../actions/settings';
import { getShowSplashScreen } from '../../selectors/settings'
import App from './app';

const mapStateToProps = state => ({
    showSplash: getShowSplashScreen(state),
  });

const mapDispatchToProps = (dispatch) => {
    return {
        showSplashNoMore: () => {
            dispatch(showSplashNoMore())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
