import { empty } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { ipfsActions } from '../../actions';
import { logEvent } from '../../utils/analytics';
import { ipfsService } from '../../services';
import { projectSelectors } from '../../selectors';

const reportIPFSEvents = (action$, state$) => action$.pipe(
    ofType(
        ipfsActions.UPLOAD_TO_IPFS,
        ipfsActions.FORK_PROJECT,
        ipfsActions.IMPORT_PROJECT_FROM_IPFS),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        if (action.type === ipfsActions.FORK_PROJECT) {
            const projectId = projectSelectors.getSelectedProjectId(state);
            logEvent(action.type, { ownProject: !ipfsService.isTemporaryProject(projectId)});
        } else {
            logEvent(action.type);
        }

        return empty();
    })
);

export default reportIPFSEvents;
