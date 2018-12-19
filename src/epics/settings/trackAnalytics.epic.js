import 'rxjs';
import { empty } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { settingsActions, appActions } from '../../actions';
import * as analitics from '../../utils/analytics';

const trackAnalytics = (action$, state$) => action$.pipe(
    ofType(settingsActions.SAVE_PREFERENCES, appActions.APP_START),
    withLatestFrom(state$),
    switchMap(([, state]) => {
        const { trackAnalytics } = state.settings.preferences.advanced;
        analitics.setOptOut(trackAnalytics)
        return empty();
    }))

export default trackAnalytics;
