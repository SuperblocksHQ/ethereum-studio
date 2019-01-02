import { from, of } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError, tap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { getSelectedProjectId } from '../../selectors/projects';
import { ipfsActions } from '../../actions';

/**
 * Add a timestamp to the upload object we are about to save in order to have the possibility to build a timeline
 * of backups
 * @param {string} shareURL The share URL given to the user
 */
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
            switchMap(({shareURL, timestamp}) => from(backend.loadFilePromise(projectId, '/.super/ipfs.json'))
                .pipe(
                    map(JSON.parse),
                    catchError(() => of([])), // Make sure that if there is any error while reading the file (ex. does not exists), we can continue
                    map(array => {
                        // Keep the history from top to bottom (most recent in the beginning of the array)
                        array.unshift({ timestamp: timestamp, shareURL: shareURL });
                        return array;
                    }),
                    switchMap(array => from(backend.saveFilePromise(projectId, {
                        path: '/.super/ipfs.json',
                        contents: JSON.stringify(array)
                    }))),
                    catchError(error => {
                        console.log(error);
                        return of('Error saving the file ipfs.json file.')
                    }),
                    map(() => ({shareURL, timestamp})) // Finally simply return the original object we are interested on for the UI
                )
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
