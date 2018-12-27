import { empty } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { appActions, settingsActions } from '../../actions';
import * as analitics from '../../utils/analytics';

const initTrackingAnalytics = (action$, state$) => action$.pipe(
    ofType(appActions.APP_START, settingsActions.UPDATE_ANALYTICS_TRACKING),
    withLatestFrom(state$),
    switchMap(([, state]) => {
        const { trackAnalytics } = state.settings.preferences.advanced;
        analitics.setEnable(trackAnalytics)
        return empty();
    }))

export default initTrackingAnalytics;
