// Copyright 2019 Superblocks AB
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

import { switchMap, catchError, withLatestFrom, map } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { interactActions } from '../../actions';
import { of, from, Observable, Observer, throwError } from 'rxjs';
import { getWeb3, convertGas } from '../../services/utils';
import { projectSelectors } from '../../selectors';
import { IDeployedContract, IRawAbiDefinition } from '../../models';
import { signTransaction } from '../../services/deployer/deploy.utils';
import { IEnvironment } from '../../models/state';
import { walletService } from '../../services';

const getData = (instance: any, name: string, args: any[]) => {
    console.log(...args);
    return instance[name].getData(...args);
};

const sendInternalTransaction = (endpoint: string, tx: any) => {
    return new Promise<any>((resolve, reject) => {
        getWeb3(endpoint).eth.sendRawTransaction(
            '0x' + tx.serialize().toString('hex'),
            (err: string, hash: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({hash, tx});
                }
            }
        );
    });
};

const deployToBrowser$ = (environment: IEnvironment, accountAddress: string, gasSettings: any, key: string, data: string, to?: string, value?: string) => {
    gasSettings = { gasPrice: convertGas(gasSettings.gasPrice), gasLimit: convertGas(gasSettings.gasLimit) };

    return Observable.create((observer: Observer<any>) => {
        getNonce(environment.endpoint, accountAddress).then(nonce => {
            observer.next({ channel: 1, msg: `Nonce for address ${accountAddress} is ${nonce}.` });
            const tx = signTransaction(accountAddress, nonce, gasSettings, key, data, to, value);
            observer.next({ channel: 1, msg: `Transaction signed.` });
            observer.next({ channel: 1, msg: `Gaslimit=${gasSettings.gasLimit}, gasPrice=${gasSettings.gasPrice}.` });
            observer.next({ channel: 1, msg: `Sending transaction to network ${environment.name} on endpoint ${environment.endpoint}...` });
            return tx;
        })
        .then(tx => sendInternalTransaction(environment.endpoint, tx))
        .then((result: any) => {
            observer.next({ channel: 4, msg: `Got receipt: ${result.hash}.` });
            observer.next(result);
            observer.complete();
        })
        .catch(err => observer.error({ msg: err, channel: 2 }));
    });
};

const getNonce = (endpoint: string, address: string) => {
    return new Promise((resolve, reject) => {
        getWeb3(endpoint).eth.getTransactionCount(address, (err: any, res: any) => {
            if (err == null) {
                resolve(res);
            } else {
                reject(`Could not get nonce for address ${address}.`);
            }
        });
    });
};

const getContractInstance$ = (endpoint: string, deployedContract: IDeployedContract) => {
    const web3 = getWeb3(endpoint);

    // Create the contract interface using the ABI provided in the configuration.
    const contractInterface = web3.eth.contract(deployedContract.abi);

    // Create the contract instance for the specific address provided in the configuration.
    return of(contractInterface.at(deployedContract.address));
};

export const sendTransactionEpic: Epic = (action$, state$) => action$.pipe(
    ofType(interactActions.SEND_TRANSACTION),
    withLatestFrom(state$),
    switchMap(([action, state]) => {

        const deployedContract: IDeployedContract = action.data.deployedContract;
        const rawAbiDefinition: IRawAbiDefinition = action.data.rawAbiDefinition;
        const args: any[] = action.data.args;

        const selectedEnv = projectSelectors.getSelectedEnvironment(state);
        const selectedAccount = projectSelectors.getSelectedAccount(state);
        const networkSettings = state.settings.preferences.network;

        if (!selectedAccount.walletName || !selectedAccount.address) {
            return throwError('walletName and address property should be set on the account');
        }
        const key = walletService.getKey(selectedAccount.walletName, selectedAccount.address);

        return getContractInstance$(selectedEnv.endpoint, deployedContract)
            .pipe(
                map((contractInstance) => getData(contractInstance, rawAbiDefinition.name, args)),
                switchMap((data) => deployToBrowser$(selectedEnv, selectedAccount.address, networkSettings, key, data, deployedContract.address)),
                switchMap((result) => [interactActions.getConstantSuccess(result)]),
                catchError((error) => {
                    console.log('There was an issue sending the transaction: ' + error);
                    return of(interactActions.getConstantFail(error));
                })
            );
    })
);
