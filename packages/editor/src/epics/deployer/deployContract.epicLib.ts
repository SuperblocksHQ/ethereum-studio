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

import { concat, of, throwError, empty } from 'rxjs';
import { switchMap, catchError, mergeMap } from 'rxjs/operators';
import { outputLogActions, explorerActions, transactionsActions } from '../../actions';
import { deployerActions } from '../../actions/deployer.actions';
import { DeployRunner, IDeployResult, walletService } from '../../services';
import * as analytics from '../../utils/analytics';
import { createFile } from '../../reducers/explorerLib';
import { projectSelectors } from '../../selectors';
import Networks from '../../networks';
import { IAccount } from '../../models/state';
import { TransactionType } from '../../models';

function finalizeDeploy(state: any, deployRunner: DeployRunner, hash: string, outputPath: string[], isNewTransaction: boolean, tx?: any) {
    return deployRunner.waitForContract(hash).pipe(
        mergeMap((o: any) => {
            if (o.msg) {
                return of(outputLogActions.addRows([o]));
            } else {
                const res = <IDeployResult>o;
                analytics.logEvent('CONTRACT_DEPLOYED', { environment: res.environment });
                const files = res.files.map(f => createFile(f.name, f.code));
                return of<any>(
                    explorerActions.createPathWithContent(outputPath, files),
                    deployerActions.deploySuccess(files),
                    isNewTransaction ? transactionsActions.addTransaction(TransactionType.Deploy, hash, res.environment, res.receipt, res.contractName, tx, state.deployer.contractArgs)
                    : transactionsActions.updateTransaction(TransactionType.Deploy, hash, res.environment, res.receipt , res.contractName, tx)
                );
            }
        }),
        catchError(e => [ outputLogActions.addRows([ e ]), deployerActions.deployFail() ])
    );
}

/**
 * Actually does external deployment
 * @param state
 * @param deployRunner
 */
export function doDeployExternally(state: any, deployRunner: DeployRunner) {
    return deployRunner.deployExternally(state.settings.preferences.network, state.deployer.value).pipe(
        switchMap((result: any) =>
            concat(
                of(outputLogActions.addRows([ result ])),
                of(deployerActions.hideExternalProviderInfo()),
                of(transactionsActions.addTransaction(TransactionType.Deploy, result.hash, undefined, result.contractName, undefined, undefined, state.deployer.contractArgs)),
                finalizeDeploy(state, deployRunner, result.hash, state.deployer.outputPath, false)
            )
        ),
        catchError(e => [ outputLogActions.addRows([ e ]), deployerActions.deployFail() ])
    );
}

/**
 * Pre-checks for possible external deployment
 *
 * @param state
 * @param deployRunner
 */
export function tryExternalDeploy(state: any, deployRunner: DeployRunner) {
    const environment = projectSelectors.getSelectedEnvironment(state);

    if (state.projects.selectedAccount.isLocked) {
        return [outputLogActions.addRows([{ channel: 2, msg: 'Your Metamask wallet is currently locked. Please unlock it and try again!' }]), deployerActions.deployFail()];
    }

    const chainId = (Networks[environment.name] || {}).chainId;
    if (chainId && window.web3.version.network !== chainId.toString()) {
        const msg = 'The Metamask network does not match the Ethereum Studio network. Check so that you have the same network chosen in Metamask as in Superblocks Lab, then try again.';
        return throwError({ msg, channel: 2 });
    }

    const isMainnetDeployment = window.web3.version.network === (Networks.mainnet.chainId && Networks.mainnet.chainId.toString());

    return concat(
        of(outputLogActions.addRows([{ channel: 1, msg: 'External account detected. Opening external account provider...' }])),
        of(isMainnetDeployment
            ? deployerActions.showMainNetWarning()
            : deployerActions.showExternalProviderInfo()),
        // here we need to wait for confirmation for mainnet deploy
        isMainnetDeployment ? empty() : doDeployExternally(state, deployRunner)
    );
}

export function browserDeploy(state: any, deployRunner: DeployRunner) {
    const account: IAccount = projectSelectors.getSelectedAccount(state);
    const networkSettings = state.settings.preferences.network;

    if (state.projects.selectedAccount.isLocked) {
        return [outputLogActions.addRows([{ channel: 2, msg: 'The Custom wallet is currently locked. Please unlock it and try again!' }]), deployerActions.deployFail()];
    }

    if (!account.walletName || !account.address) {
        return of(outputLogActions.addRows([{ msg: 'WalletName and address property should be set on the account', channel: 2 }]));
    }
    const key = walletService.getKey(account.walletName, account.address);

    return deployRunner.deployToBrowser(networkSettings, key, state.deployer.value).pipe(
        mergeMap(output => {
            if (output.msg) { // intermediate messages comming
                return of(outputLogActions.addRows([ output ]));
            } else if (output.hash && output.tx) { // result
                return finalizeDeploy(state, deployRunner, output.hash, state.deployer.outputPath, true, output.tx);
            } else { // unexpected error
                return of(outputLogActions.addRows([{ msg: 'Unexpected error occurred. Please try again!', channel: 3 }]));
            }
        }),
        catchError((e) => [ outputLogActions.addRows(e), deployerActions.deployFail()])
    );
}
