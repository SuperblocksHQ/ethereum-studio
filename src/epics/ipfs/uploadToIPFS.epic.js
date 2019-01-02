import { from, of, throwError } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError, tap, mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { getSelectedProjectId } from '../../selectors/projects';
import { ipfsActions, explorerActions } from '../../actions';

const addTimeStamp = (shareURL) => {
    return { shareURL: shareURL, timestamp: Date.now() }
}

/**
 * This is needed becase atm the file explorer has no way to auto update itself when the
 * underlying state has actually changed (per example by using the backend.js class)
 */
const updateFileSystemState = (project) => {
    project.getChildren()[0].getChildren(true);
}

const uploadToIPFS = (action$, state$, { backend, router }) => action$.pipe(
    ofType(ipfsActions.UPLOAD_TO_IPFS),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const projectId = getSelectedProjectId(state);
        const { uploadSettings } = action.data;
        return from(backend.ipfsSyncUp(projectId, uploadSettings))
        .pipe(
            map(hash => document.location.href + '#/ipfs/' + hash),
            map(addTimeStamp),
            tap(({shareURL, timestamp}) => backend.saveFilePromise(projectId, {
                    path: '/.super/ipfs.json',
                    contents: JSON.stringify({ timestamp: timestamp, shareURL: shareURL })
                })
                .catch(e => throwError('[ERROR] Could not save the file.'))
            ),
            tap(() => updateFileSystemState(router.control.getActiveProject())),
            map(({shareURL, timestamp}) => ipfsActions.uploadToIPFSSuccess(timestamp, shareURL)),
            catchError(error => {
                console.log(error);
                return of(ipfsActions.uploadToIPFSFail(error))
            })
        )
    })
);

export default uploadToIPFS;
