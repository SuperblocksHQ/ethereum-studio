import { from, of } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError, tap, mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { getSelectedProjectId } from '../../selectors/projects';
import { ipfsActions, explorerActions } from '../../actions';

const uploadToIPFS = (action$, state$, { backend }) => action$.pipe(
    ofType(ipfsActions.UPLOAD_TO_IPFS),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const projectId = getSelectedProjectId(state);
        const { includeBuildInfo } = action.data;
        return from(backend.ipfsSyncUp(projectId, includeBuildInfo))
        .pipe(
            map(hash => document.location.href + '#/ipfs/' + hash),
            tap(shareURL => backend.saveFilePromise(projectId, {
                    path: '/.super/ipfs.json',
                    contents: JSON.stringify({ timestamp: Date.now(), shareURL: shareURL })
                })
                .then(console.log('File Saved'))
                .catch(e => console.log('[ERROR] Could not save the file.'))
            ),
            mergeMap(shareURL => of(
                explorerActions.redrawUI(),
                ipfsActions.uploadToIPFSSuccess(shareURL))
            ),
            catchError(error => of(ipfsActions.uploadToIPFSFail(error)))
        )
    })
);

export default uploadToIPFS;
