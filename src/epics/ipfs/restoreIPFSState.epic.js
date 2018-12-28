import { from, of } from 'rxjs';
import { switchMap, withLatestFrom, tap, map, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { getSelectedProjectId } from '../../selectors/projects';
import { ipfsActions, projectActions } from '../../actions';

const extractInfo = (ipfsFileObject) => {
    console.log(ipfsFileObject);
    return ipfsFileObject.shareURL;
}

const restoreIPFSState = (action$, state$, { backend }) => action$.pipe(
    ofType(projectActions.SELECT_PROJECT),
    withLatestFrom(state$),
    switchMap(([,state]) => {
        const projectId = getSelectedProjectId(state);
        return from(backend.loadFilePromise(projectId, '/.super/ipfs.json'))
        .pipe(
            map(JSON.parse),
            // map(extractInfo),
            map(ipfsActions.restoreIPFSStateSuccess),
            catchError(() => of(ipfsActions.restoreIPFSStateFail()))
        )
    })
);

export default restoreIPFSState;
