import { Observable, Observer, empty, forkJoin, zip } from 'rxjs';
import { switchMap, withLatestFrom, catchError, tap, map } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { transactionsActions } from '../../actions';
import { TransactionType } from '../../models';
import { projectSelectors } from '../../selectors/index.js';
const abiDecoder = require('abi-decoder');
import * as analytics from '../../utils/analytics';

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
        const templateName = state.projects.dappFileData.project.info.name;
        const status = action.data.receipt.status === 1 ? 'success' : 'fail';
        if (transactionType === TransactionType.Preview) {
            analytics.logEvent('SEND_TRANSACTION', { template: templateName, status });
            return[transactionsActions.updateTransactionSuccess(transactionType, hash, selectedEnv.name, action.data.receipt, contractName, undefined, decodedData.params, decodedData.name)];
        } else if (error) {
            analytics.logEvent('SEND_TRANSACTION', { template: templateName, status });
            return[transactionsActions.updateTransactionFail({transactionType, hash, environment: selectedEnv.name, receipt: action.data.receipt, contractName, contractArgs: decodedData.params, functionName: decodedData.name, error})];
        } else {
            analytics.logEvent('SEND_TRANSACTION', { template: templateName, status });
            return empty();
        }
    })
);
