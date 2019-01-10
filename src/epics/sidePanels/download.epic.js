import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { sidePanelsActions } from '../../actions';
import { previewService } from '../../services';

export const downloadEpic = (action$, state$) => action$.pipe(
    ofType(sidePanelsActions.preview.DOWNLOAD),
    map(() => {
        if (state$.value.sidePanels.preview.showDownloadModal) {
            previewService.downloadDapp();
        }

        return sidePanelsActions.preview.hideModals();
    }));
