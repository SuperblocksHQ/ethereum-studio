import { from, of, throwError } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError, tap, mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { getSelectedProjectId } from '../../selectors/projects';
import { ipfsActions, explorerActions } from '../../actions';

const addTimeStamp = (shareURL) => {
    return { shareURL: shareURL, timestamp: Date.now() }
}

const uploadToIPFS = (action$, state$, { backend }) => action$.pipe(
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
            mergeMap(({shareURL, timestamp}) => of(
                explorerActions.redrawUI(),
                ipfsActions.uploadToIPFSSuccess(timestamp, shareURL))
            ),
            catchError(error => {
                console.log(error);
                return of(ipfsActions.uploadToIPFSFail(error))
            })
        )
    })
);

export default uploadToIPFS;
