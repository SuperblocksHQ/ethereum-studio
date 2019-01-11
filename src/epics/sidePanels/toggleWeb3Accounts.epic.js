import { empty } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { sidePanelsActions } from '../../actions';
import { previewService } from '../../services';

export const toggleWeb3AccountsEpic = (action$, state$) => action$.pipe(
    ofType(sidePanelsActions.preview.TOGGLE_WEB3_ACCOUNTS),
    switchMap(() => {
        previewService.disableAccounts = state$.value.sidePanels.preview.disableAccounts;
        return empty();
    }));
