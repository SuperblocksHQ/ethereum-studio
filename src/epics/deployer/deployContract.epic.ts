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

import { concat, of, empty, throwError } from 'rxjs';
import { switchMap, catchError, mergeMap, map } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { consoleActions } from '../../actions';
import { deployerActions } from '../../actions/deployer.actions';
import { projectSelectors } from '../../selectors';
import { deployerService, walletService } from '../../services';
import { IAccount } from '../../models/state';
import { convertGas } from '../../services/utils';

function externalDeploy() {
    return empty();
}

function browserDeploy(state: any, deployFile: string) {
    const account: IAccount = projectSelectors.getSelectedAccount(state);
    const environment = projectSelectors.getSelectedEnvironment(state);
    const networkSettings = state.settings.preferences.network;
    const gasSettings = { gasPrice: convertGas(networkSettings.gasPrice), gasLimit: convertGas(networkSettings.gasLimit) };

    if (!account.walletName || !account.address) {
        return throwError('walletName and address property should be set on the account');
    }
    const key = walletService.getKey(account.walletName, account.address);

    // get nonce
    return deployerService.getNonce(account.address).pipe(
        switchMap(nonce => {
            // sign transaction
            const signedTransaction = deployerService.signTransaction(<string>account.address, nonce, gasSettings, key, deployFile);
            return concat(
                of(consoleActions.addRows([
                    { channel: 1, msg: `Nonce for address ${account.address} is ${nonce}.` },
                    { channel: 1, msg: `Transaction signed.` },
                    { channel: 1, msg: `Gaslimit=${gasSettings.gasLimit}, gasPrice=${gasSettings.gasPrice}.` },
                    { channel: 1, msg: `Sending transaction to network ${environment.network} on endpoint ${environment.endpoint}...` }
                ])),
                // send transaction
                deployerService.sendInteralTransaction(signedTransaction).pipe(
                    switchMap(hash => {
                        return concat(
                            of (consoleActions.addRows([{ channel: 1, msg: `Got receipt: ${hash}.` }]) ),
                            // TODO: add transaction to transaction log
                            deployerService.waitForContract(hash).pipe(
                                map((output: any) => {
                                    if (output.msg) {
                                        return consoleActions.addRows([output]);
                                    } else {
                                        return { type: 'DONE' };
                                    }
                                })
                            )
                        );
                    }),
                    catchError(e => [consoleActions.addRows([{ channel: 2, msg: e }])])
                )
            );
        }),
        catchError(() => [ consoleActions.addRows([{ channel: 2, msg: `Could not get nonce for address ${account.address}.` }]) ])
    );
}

export const deployContractEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(deployerActions.DEPLOY_CONTRACT),
    switchMap(() => {
        const deployerState = state$.value.deployer;
        if (deployerState.needsCompilation) {
            return empty();
        }
        const environment = projectSelectors.getSelectedEnvironment(state$.value);

        return deployerService.checkDeploy(deployerState.buildFiles, deployerState.contractArgs, environment.name)
            .pipe(
                switchMap(result => {

                    const selectedAccount = projectSelectors.getSelectedAccount(state$.value);
                    deployerService.init(selectedAccount.type, environment.endpoint);
                    const obs$ = selectedAccount.type === 'metamask' ? externalDeploy() : browserDeploy(state$.value, result.deployFile || '');

                    return concat(
                        result.message
                            ? of(consoleActions.addRows([ { channel: 1, msg: result.message } ]))
                            : empty(),
                        result.deployFile ? of (deployerActions.setDeployFile(result.deployFile)) : empty(),
                        result.deployFile ? obs$ : empty()
                    );

                }),
                catchError(e => [ consoleActions.addRows([ { channel: 2, msg: e } ]) ])
            );
    })
);
