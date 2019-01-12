import { of, empty } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { getSelectedProjectId } from '../../selectors/projects';
import { ipfsActions, projectActions } from '../../actions';
import { ipfsService } from '../../services';

const showUploadButton = (action$, state$) => action$.pipe(
    ofType(projectActions.SELECT_PROJECT),
    withLatestFrom(state$),
    switchMap(([,state]) => {
        const projectId = getSelectedProjectId(state);
        return of(projectId)
        .pipe(
            map(projectId => {
                console.log(projectId);
                if (ipfsService.isTemporaryProject(projectId)) {
                    console.log("Temp project");
                    return ipfsActions.hideUploadButton();
                } else {
                    return ipfsActions.showUploadButton();
                }
            }),
            catchError(() => {
                console.log("Fail silently");
                return empty()
            })
        )
    })
);

export default showUploadButton;
