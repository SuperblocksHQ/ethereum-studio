import { from, of } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError, first, tap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { projectSelectors } from '../../selectors';
import { ipfsActions, projectActions } from '../../actions';

const restoreIPFSState = (action$, state$, { backend }) => action$.pipe(
    ofType(projectActions.SELECT_PROJECT),
    withLatestFrom(state$),
    switchMap(([,state]) => {
        const projectId = projectSelectors.getSelectedProjectId(state);
        return from(backend.loadFilePromise(projectId, '/.super/ipfs.json'))
        .pipe(
            switchMap(file => from(JSON.parse(file))),
            first(),
            map(ipfsActions.restoreIPFSStateSuccess),
            catchError(() => {
                console.log("IPFS backup information not available");
                return of(ipfsActions.restoreIPFSStateFail())
            })
        )
    })
);

export default restoreIPFSState;
