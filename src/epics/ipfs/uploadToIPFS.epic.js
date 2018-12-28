import { from, of } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError, tap, share } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { getSelectedProjectId } from '../../selectors/projects';
import { ipfsActions } from '../../actions';

const uploadToIPFS = (action$, state$, { backend, router }) => action$.pipe(
    ofType(ipfsActions.UPLOAD_TO_IPFS),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const projectId = getSelectedProjectId(state);
        const { includeBuildInfo } = action.data;
        console.log('hola');
        return from(backend.ipfsSyncUp(projectId, includeBuildInfo))
        .pipe(
            map(hash => document.location.href + '#/ipfs/' + hash),
            tap(backend.newFilePromise(projectId, '/.super', 'ipfs.json').then(console.log('wrote to file'))),
            tap(shareURL => {
                const project = router.control.getActiveProject()
                project.getItemByPath(
                    '/.super/ipfs.json'.split('/'),
                    project
                ).then(item => {
                    item.setContents(
                        JSON.stringify({ timestamp: Date.now(), shareURL: shareURL })
                    );
                    item.save()
                        .then(console.log('File saved'))
                        .catch(e => {
                            console.log('[ERROR] Could not save the file.')
                            // project.deleteFile('abisrc'
                        });
                    })
            }),
            map(shareURL => ipfsActions.uploadToIPFSSuccess(shareURL)),
            catchError(error => of(ipfsActions.uploadToIPFSFail(error)))
        )
    })
);

export default uploadToIPFS;
