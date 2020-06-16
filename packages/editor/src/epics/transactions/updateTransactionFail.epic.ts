import { switchMap, withLatestFrom } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { transactionsActions, outputLogActions } from '../../actions';

export const updateTransactionFailEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(transactionsActions.UPDATE_TRANSACTION_FAIL),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        return[outputLogActions.addRows([{ msg: 'Error: ' + action.data.error, channel: 2 }])];
    })
);
