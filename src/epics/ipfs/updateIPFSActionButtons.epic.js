import { of, empty } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { getSelectedProjectId } from '../../selectors/projects';
import { ipfsActions, projectActions } from '../../actions';
import { ipfsService } from '../../services';

const updateIPFSActionButtons = (action$, state$) => action$.pipe(
    ofType(projectActions.SELECT_PROJECT),
    withLatestFrom(state$),
    switchMap(([,state]) => {
        const projectId = getSelectedProjectId(state);
        return of(projectId)
        .pipe(
            map(projectId => {
                if (ipfsService.isTemporaryProject(projectId)) {
                    return ipfsActions.updateIpfsActionButtons({
                        showUploadButton: false,
                        showForkButton: true,
                    });
                } else if(projectId === 0) { // Welcome screen
                    return ipfsActions.updateIpfsActionButtons({
                        showUploadButton: false,
                        showForkButton: false,
                    });
                }
                else {
                    return ipfsActions.updateIpfsActionButtons({
                        showUploadButton: true,
                        showForkButton: true,
                    });
                }
            }),
            catchError(() => {
                console.log("Fail silently");
                return empty()
            })
        )
    })
);

export default updateIPFSActionButtons;
