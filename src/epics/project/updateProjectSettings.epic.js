import { from } from 'rxjs';
import { switchMap, tap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { projectActions } from '../../actions';

export const updateProjectSettings = (action$, state$, { router }) => action$.pipe(
    ofType(projectActions.UPDATE_PROJECT_SETTINGS),
    withLatestFrom(state$),
    switchMap(([action, ]) => {
        const activeProject = router.control.getActiveProject();

        // TODO - This is some legacy code that could be moved to redux state
        activeProject.setName(action.data.name);
        activeProject.setTitle(action.data.title);

        return from(activeProject.saveDappfile())
        .pipe(
            map(() => projectActions.updateProjectSettingsSuccess(action.data)),
            // This should not be here but for simplicity lets leave it here
            tap(() => router.control.redrawMain(true)),
            catchError(error => {
                console.log("Error saving the DappFile: " + error);
                return of(ipfsActions.updateProjectSettingsFail(error))
            })
        );
    }));
