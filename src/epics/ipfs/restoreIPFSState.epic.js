import { from, of } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { getSelectedProjectId } from '../../selectors/projects';
import { ipfsActions, projectActions } from '../../actions';

const restoreIPFSState = (action$, state$, { backend }) => action$.pipe(
    ofType(projectActions.SELECT_PROJECT),
    withLatestFrom(state$),
    switchMap(([,state]) => {
        const projectId = getSelectedProjectId(state);
        return from(backend.loadFilePromise(projectId, '/.super/ipfs.json'))
        .pipe(
            map(JSON.parse),
            map(ipfsActions.restoreIPFSStateSuccess),
            catchError(() => {
                console.log("IPFS backup information not available");
                return of(ipfsActions.restoreIPFSStateFail())
            })
        )
    })
);

export default restoreIPFSState;
