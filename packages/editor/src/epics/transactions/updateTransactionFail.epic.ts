import { Observable, Observer, empty, forkJoin, zip } from 'rxjs';
import { switchMap, withLatestFrom, catchError, tap, map } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { transactionsActions, outputLogActions } from '../../actions';
import { getWeb3 } from '../../services/utils';
import { TransactionType } from '../../models';
import { IEnvironment, IAccount } from '../../models/state';
import { projectSelectors } from '../../selectors/index.js';
const abiDecoder = require('abi-decoder');

export const updateTransactionFailEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(transactionsActions.UPDATE_TRANSACTION_FAIL),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        console.log('action', action.data);
        return[outputLogActions.addRows([{ msg: 'Error: ' + action.data.error, channel: 2 }])];
    })
);
