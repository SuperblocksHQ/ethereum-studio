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
import { switchMap, catchError, map, mergeMap } from 'rxjs/operators';
import { consoleActions, explorerActions } from '../../actions';
import { deployerActions } from '../../actions/deployer.actions';
import { DeployRunner, IDeployResult, walletService } from '../../services';
import * as analytics from '../../utils/analytics';
import { createFile } from '../../reducers/explorerLib';
import { projectSelectors } from '../../selectors';
import Networks from '../../networks';
import { IAccount } from '../../models/state';

function finalizeDeploy(deployRunner: DeployRunner, hash: string, outputPath: string[]) {
    return deployRunner.waitForContract(hash).pipe(
        mergeMap((o: any) => {
            if (o.msg) {
                return of(consoleActions.addRows([o]));
            } else {
                const res = <IDeployResult>o;
                analytics.logEvent('CONTRACT_DEPLOYED', res.environment);
                const files = res.files.map(f => createFile(f.name, f.code));
                return of(explorerActions.createPathWithContent(outputPath, files), deployerActions.deploySuccess());
            }
        }),
        catchError(e => [ consoleActions.addRows([ e ]), deployerActions.deployFail() ])
    );
}

/**
 * Actually does external deployment
 * @param state 
 * @param deployRunner 
 */
export function doDeployExternally(state: any, deployRunner: DeployRunner) {
    return deployRunner.deployExternally(state.settings.preferences.network).pipe(
        switchMap((result: any) => concat(
            of(consoleActions.addRows([ result ])),
            of(deployerActions.hideExternalProviderInfo()),
            finalizeDeploy(deployRunner, result.hash, state.deployer.outputPath)
        )),
        catchError(e => [ consoleActions.addRows([ e ]), deployerActions.deployFail() ])
    );
}

/**
 * Prechecks for possible external deployment
 * @param state 
 * @param deployRunner 
 */
export function tryExternalDeploy(state: any, deployRunner: DeployRunner) {
    const environment = projectSelectors.getSelectedEnvironment(state);
    const chainId = (Networks[environment.name] || {}).chainId;
    if (chainId && window.web3.version.network !== chainId.toString()) {
        return throwError('The Metamask network does not match the Superblocks Lab network. Check so that you have the same network chosen in Metamask as in Superblocks Lab, then try again.');
    }

    const isMainnetDeployment = window.web3.version.network === Networks.mainnet.chainId.toString();

    return concat(
        of(consoleActions.addRows([{ channel: 1, msg: 'External account detected. Opening external account provider...' }])),
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

    if (!account.walletName || !account.address) {
        return throwError('walletName and address property should be set on the account');
    }
    const key = walletService.getKey(account.walletName, account.address);

    return deployRunner.deployToBrowser(networkSettings, key).pipe(
        mergeMap(output => {
            if (output.msg) { // intermediate messages comming
                return of(consoleActions.addRows([ output ]));
            } else if (output.hash) { // result
                return finalizeDeploy(deployRunner, output.hash, state.deployer.outputPath);
            } else { // unexpected error
                return of(consoleActions.addRows([{ msg: 'Unexpected error occured. Please try again!', channel: 3 }]));
            }
        }),
        catchError((e) => [ consoleActions.addRows([e]), deployerActions.deployFail()])
    );
}
