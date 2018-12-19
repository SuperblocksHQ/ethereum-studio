import { empty } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { settingsActions } from '../../actions';
import * as analitics from '../../utils/analytics';

const reportSettings = (action$, state$) => action$.pipe(
    ofType(settingsActions.SAVE_PREFERENCES),
    withLatestFrom(state$),
    switchMap(([, state]) => {
        const { preferences } = state.settings;
        const trackAnalytics = preferences.advanced.trackAnalytics;
        if (trackAnalytics) {
            analitics.setEnable(true);
            analitics.logEvent("SAVE_PREFERENCES", preferences);
        } else {
            analitics.logEvent("SAVE_PREFERENCES", preferences);
            analitics.setEnable(false);
        }

        return empty();
    }));

export default reportSettings;

