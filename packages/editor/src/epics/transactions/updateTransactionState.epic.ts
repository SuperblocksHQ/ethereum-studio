// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import { Observable, Observer, empty, forkJoin, zip } from 'rxjs';
import { switchMap, withLatestFrom, catchError, tap, map } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { transactionsActions } from '../../actions';
import { getWeb3 } from '../../services/utils';
import { TransactionType } from '../../models';
import { IEnvironment, IAccount } from '../../models/state';
import { projectSelectors } from '../../selectors/index.js';


const getReceipt$ = (currWeb3: any, hash: string) => {
    return Observable.create((observer: Observer<any>) => {
        const getReceipt = () => currWeb3.eth.getTransactionReceipt(hash, (err: string, receipt: any) => {
            if (err) {
                observer.error({ msg: err, channel: 2 });
                return;
            }
            if (receipt == null || receipt.blockHash == null) {
                setTimeout(getReceipt, 1000);
            } else {
                observer.next(receipt);
                observer.complete();
            }
        });

        getReceipt();
    });
};


const getTxObject$ = (currWeb3: any, hash: string) => {
    return Observable.create((observer: Observer<any>) => {
        const getTxObject = () => currWeb3.eth.getTransaction(hash, (err: string, res: any) => {
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

function waitForContract(hash: string, selectedAccount: IAccount, environment: IEnvironment) {
    const currWeb3 = selectedAccount.type === 'metamask' ? window.web3 : getWeb3(environment.endpoint);
    return zip(getTxObject$(currWeb3, hash), getReceipt$(currWeb3, hash));
}

export const updateTransactionStateEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(transactionsActions.ADD_TRANSACTION),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const { transactionType, hash, functionName, contractArgs, contractName} = action.data;
        const selectedAccount = projectSelectors.getSelectedAccount(state);
        const selectedEnv = projectSelectors.getSelectedEnvironment(state);

        // For now, the deployer is taking care of all this, so there is no need to re-do it here. Make sure
        // we consolidate both approaches into a single one in the future
        if (transactionType === TransactionType.Deploy) {
            return empty();
        } else {
            return waitForContract(hash, selectedAccount, selectedEnv)
            .pipe(
                switchMap((([txObject, receipt]) => [transactionsActions.updateTransaction(transactionType, hash, selectedEnv.name, receipt, contractName, txObject, contractArgs, functionName)])),
                catchError((error) => [ transactionsActions.updateTransactionFail(error) ])
            );
        }
    })
);

