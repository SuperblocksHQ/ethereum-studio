import { from, of } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { getSelectedProjectId } from '../../selectors/projects';
import { ipfsActions } from '../../actions';

const uploadToIPFS = (action$, state$, { backend }) => action$.pipe(
    ofType(ipfsActions.UPLOAD_TO_IPFS),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const projectId = getSelectedProjectId(state);
        const { includeBuildInfo } = action.data;
        return from(backend.ipfsSyncUp(projectId, includeBuildInfo))
        .pipe(
            map(hash => ipfsActions.uploadToIPFSSuccess(document.location.href + '#/ipfs/' + hash)),
            catchError(error => of(ipfsActions.uploadToIPFSFail(error)))
        )
    })
);

export default uploadToIPFS;
