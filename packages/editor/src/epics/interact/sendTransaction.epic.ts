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

import { switchMap, catchError, withLatestFrom, map, mergeMap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { interactActions, outputLogActions, deployerActions, transactionsActions } from '../../actions';
import { of, from, Observable, Observer, throwError, concat } from 'rxjs';
import { getWeb3, convertGas } from '../../services/utils';
import { projectSelectors } from '../../selectors';
import { TransactionType } from '../../models';
import { signTransaction } from '../../services/deployer/deploy.utils';
import { IEnvironment, IAccount, IDeployedContract } from '../../models/state';
import { walletService } from '../../services';
import Networks from '../../networks';

function getData(instance: any, name: string, abiIndex: number, args: any[]) {
    const inputTypes = instance.abi[abiIndex].inputs.map((input: any) => input.type).join();
    return instance[name][inputTypes].getData(...args);
}

function sendInternalTransaction(endpoint: string, tx: any) {
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
}

function getNonce(endpoint: string, address: string) {
    return new Promise((resolve, reject) => {
        getWeb3(endpoint).eth.getTransactionCount(address, (err: any, res: any) => {
            if (err == null) {
                resolve(res);
            } else {
                reject(`Could not get nonce for address ${address}.`);
            }
        });
    });
}

function getContractInstance$(endpoint: string, deployedContract: IDeployedContract) {
    const web3 = getWeb3(endpoint);

    // Create the contract interface using the ABI provided in the configuration.
    const contractInterface = web3.eth.contract(deployedContract.abi);

    // Create the contract instance for the specific address provided in the configuration.
    return of(contractInterface.at(deployedContract.address));
}

function sendToBrowser$(environment: IEnvironment, accountAddress: string, networkSettings: any, key: string, data: string, to?: string, value?: string): Observable<any> {
    const gasSettings: any = { gasPrice: convertGas(networkSettings.gasPrice), gasLimit: convertGas(networkSettings.gasLimit) };

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
        .catch(err => observer.error({ msg: 'Error sending internal transation: ' + err.toString(), channel: 2 }));
    });
}

function tryExternalSend$(environment: IEnvironment, selectedAccount: IAccount, networkSettings: any, contractName: string, data: string, to?: string, value?: string) {
    const chainId = (Networks[environment.name] || {}).chainId;
    if (chainId && window.web3.version.network !== chainId.toString()) {
        return throwError('The Metamask network does not match the Ethereum Studio network. Check so that you have the same network chosen in Metamask as in Superblocks Lab, then try again.');
    }

    return concat(
        of(outputLogActions.addRows([{ channel: 1, msg: 'External account detected. Opening external account provider...' }])),
        of(deployerActions.showExternalProviderInfo()),
        // here we need to wait for confirmation for mainnet deploy
        doSendExternally$(environment, selectedAccount, networkSettings, contractName, data, to, value)
    );
}

/**
 * Actually does external deployment
 * @param state
 * @param deployRunner
 */
function doSendExternally$(environment: IEnvironment, selectedAccount: IAccount, networkSettings: any, contractName: string, data: string, to?: string, value?: string) {
    return deployExternally$(environment, selectedAccount, networkSettings, contractName, data, to, value).pipe(
        switchMap((result: any) =>
            concat(
                of(outputLogActions.addRows([ result ])),
                of(deployerActions.hideExternalProviderInfo()),
                of(transactionsActions.addTransaction(TransactionType.Interact, result.hash, undefined, result.contractName),
                of(transactionsActions.checkSentTransactions(environment.endpoint, contractName))),
                // finalizeDeploy(state, deployRunner, result.hash, state.deployer.outputPath, false)
            )
        ),
        catchError(e => [ outputLogActions.addRows([ e ]), deployerActions.deployFail() ])
    );
}

function deployExternally$(environment: IEnvironment, selectedAccount: IAccount, networkSettings: any, contractName: string, data: string, to?: string, value?: string) {
    const gasSettings = { gasPrice: convertGas(networkSettings.gasPrice), gasLimit: convertGas(networkSettings.gasLimit) };

    const params = {
        from: selectedAccount.address,
        to: to ? to : '',
        value: value ? value : '0x0',
        gasPrice: gasSettings.gasPrice,
        gasLimit: gasSettings.gasLimit,
        data
    };

    return from(new Promise<any>((resolve, reject) => {
        const web3 = selectedAccount.type === 'metamask' ? window.web3 : getWeb3(environment.endpoint);
        web3.eth.sendTransaction(params, (err: any, hash: string) => {
            if (err) {
                console.log(err);
                reject({ msg: 'Could not interact with contract using external provider.', channel: 2 });
                return;
            }
            resolve({ msg: 'Got receipt: ' + hash, channel: 4, hash, contractName });
        });
    }));
}

export const sendTransactionEpic: Epic = (action$, state$) => action$.pipe(
    ofType(interactActions.SEND_TRANSACTION),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const deployedContract: IDeployedContract = action.data.deployedContract;
        const value = action.data.value;
        const {args, rawAbiDefinitionName} = action.data;
        const selectedEnv = projectSelectors.getSelectedEnvironment(state);
        const selectedAccount = projectSelectors.getSelectedAccount(state);
        const networkSettings = state.settings.preferences.network;

        return getContractInstance$(selectedEnv.endpoint, deployedContract)
            .pipe(
                map(contractInstance => getData(contractInstance, action.data.rawAbiDefinitionName, action.data.abiIndex, action.data.args)),
                switchMap(data => {
                    if (selectedAccount.type === 'metamask') {
                        return tryExternalSend$(selectedEnv, selectedAccount, networkSettings, deployedContract.contractName, data, deployedContract.address, value);
                    } else {
                        if (!selectedAccount.walletName || !selectedAccount.address) {
                            return of(outputLogActions.addRows([{ msg: 'WalletName and address property should be set on the account', channel: 2 }]));
                        }
                        const key = walletService.getKey(selectedAccount.walletName, selectedAccount.address);
                        return sendToBrowser$(selectedEnv, selectedAccount.address, networkSettings, key, data, deployedContract.address, value).pipe(
                            mergeMap(output => {
                                if (output.msg) { // intermediate messages coming
                                    return of(outputLogActions.addRows([ output ]));
                                } else if (output.hash && output.tx) { // result
                                    return of(
                                        interactActions.sendTransactionSuccess(output.hash),
                                        transactionsActions.addTransaction(TransactionType.Interact, output.hash, undefined, undefined, deployedContract.contractName, undefined, args, rawAbiDefinitionName),
                                        transactionsActions.checkSentTransactions(selectedEnv.endpoint, deployedContract.contractName));
                                } else { // unexpected error
                                    return of(outputLogActions.addRows([{ msg: 'Unexpected error occurred. Please try again!', channel: 3 }]));
                                }
                            }),
                            catchError((e) => [ outputLogActions.addRows([e]), deployerActions.deployFail()])
                        );
                    }
                }),
                catchError(e => [ outputLogActions.addRows([ { msg: e, channel: 2 } ]), deployerActions.deployFail() ])
            );
    })
);
