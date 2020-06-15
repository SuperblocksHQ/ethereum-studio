import { Observable, Observer, empty, forkJoin, zip } from 'rxjs';
import { switchMap, withLatestFrom, catchError, tap, map } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { transactionsActions } from '../../actions';
import { getWeb3 } from '../../services/utils';
import { TransactionType } from '../../models';
import { IEnvironment, IAccount } from '../../models/state';
import { projectSelectors } from '../../selectors/index.js';
const abiDecoder = require('abi-decoder');

export const updateTransactionEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(transactionsActions.UPDATE_TRANSACTION),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const { transactionType, hash, error} = action.data;
        const selectedEnv = projectSelectors.getSelectedEnvironment(state);
        const abiData = state$.value.interact.items[0].abi;
        const contractName = state$.value.interact.items[0].contractName;
        const txData = action.data.tx.input;
        abiDecoder.addABI(abiData);
        const decodedData = abiDecoder.decodeMethod(txData);
        if (transactionType === TransactionType.Preview && !error) {
            return[transactionsActions.updateTransactionSuccess(transactionType, hash, selectedEnv.name, action.data.receipt, contractName, undefined, decodedData.params, decodedData.name)];
        } else if (error) {
            return[transactionsActions.updateTransactionFail({transactionType, hash, environment: selectedEnv.name, receipt: action.data.receipt, contractName, contractArgs: decodedData.params, functionName: decodedData.name, error})];
        } else {
            return empty();
        }
    })
);
