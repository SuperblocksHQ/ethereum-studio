import { transactionsActions } from '../../actions';
import {catchError, map, switchMap, takeWhile, withLatestFrom, mergeMap } from 'rxjs/operators';
import { from, interval, Observable, Observer } from 'rxjs';
import { ofType, Epic } from 'redux-observable';
import { ITransaction } from '../../models';
import { getWeb3 } from '../../services/utils';

export const checkSentTransactionsEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(transactionsActions.CHECK_SENT_TRANSACTIONS),
    withLatestFrom(state$),
    switchMap(([action]) => interval(1000)
        .pipe(
            takeWhile(() => !checkIfAllTransactionsAreConfirmed(state$.value.transactions.items)),
            mergeMap(() =>
                from(findUnconfirmedTransactions(state$.value.transactions.items)).pipe(
                    map((res: any) => {
                        return res;
                    })
                )
            ),
            switchMap((transaction: any) => {
                const { type, hash } = transaction;

                const res = getReceipt$(action.data.endpoint, transaction.hash);

                return res.pipe(
                    map((tx: ITransaction) => {
                        tx.status === 1 ? tx.status = 1 : tx.status = 2;
                        tx.to = transaction.to;
                        tx.network = transaction.network;

                        return transactionsActions.updateTransaction(type, hash, undefined, tx, action.data.contractName, transaction) ;
                    })
                );
            })
        )
    ),
    catchError(e => [ transactionsActions.checkSentTransactionsFail(e) ])
);

const getReceipt$ = (endpoint: string, hash: string) => {
    const web3 = getWeb3(endpoint);
    return new Observable((observer: Observer<any>) => {
        const getTxObject = () => web3.eth.getTransactionReceipt(hash, (err: string, res: any) => {
            if (err) {
                observer.error({ msg: err, channel: 2 });
                return;
            }
            if (res == null || res.blockHash == null) {
                setTimeout(getTxObject, 1000);
            } else {
                observer.next(res);
                observer.complete();
            }
        });

        getTxObject();
    });
};

function checkIfAllTransactionsAreConfirmed(transactions: ITransaction[]) {
    let allConfirmed = true;

    for (const transaction of transactions) {
        if (transaction.status === null || transaction.status <= 0 ) {
            allConfirmed = false;
            break;
        }
    }

    return allConfirmed;
}

function findUnconfirmedTransactions(transactions: ITransaction[]) {
    return transactions.filter((transaction) => transaction.status === null || transaction.status <= 0);
}

