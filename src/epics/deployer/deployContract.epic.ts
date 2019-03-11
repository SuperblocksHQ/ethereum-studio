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
import { switchMap, catchError, map } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { consoleActions, explorerActions } from '../../actions';
import { deployerActions } from '../../actions/deployer.actions';
import { projectSelectors } from '../../selectors';
import { walletService, DeployRunner, IDeployResult } from '../../services';
import { IAccount, IConsoleRow } from '../../models/state';
import * as analytics from '../../utils/analytics';
import { createFile } from '../../reducers/explorerLib';

function finalizeDeploy(deployRunner: DeployRunner, hash: string, outputPath: string[]) {
    return deployRunner.waitForContract(hash).pipe(
        map((o: any) => {
            if (o.msg) {
                return consoleActions.addRows([o]);
            } else {
                const res = <IDeployResult>o;
                analytics.logEvent('CONTRACT_DEPLOYED', res.environment);
                const files = res.files.map(f => createFile(f.name, f.code));
                return explorerActions.createPathWithContent(outputPath, files);
            }
        })
    );
}

function externalDeploy() {
    return empty();
}

function browserDeploy(state: any, deployRunner: DeployRunner) {
    const account: IAccount = projectSelectors.getSelectedAccount(state);
    const networkSettings = state.settings.preferences.network;

    if (!account.walletName || !account.address) {
        return throwError('walletName and address property should be set on the account');
    }
    const key = walletService.getKey(account.walletName, account.address);

    return deployRunner.deployToBrowser(networkSettings, key).pipe(
        switchMap(output => {
            if (output.msg) {
                return of(consoleActions.addRows([ output ]));
            } else if (output.hash) {
                return finalizeDeploy(deployRunner, output.hash, state.deployer.outputPath);
            } else {
                return of(consoleActions.addRows([{ msg: 'Unexpected error occured. Please try again!', channel: 3 }]));
            }
        })
    );
}

export const deployContractEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(deployerActions.DEPLOY_CONTRACT),
    switchMap(() => {
        // prepare params
        const deployerState = state$.value.deployer;
        if (deployerState.needsCompilation) {
            return empty();
        }
        const environment = projectSelectors.getSelectedEnvironment(state$.value);
        const selectedAccount = projectSelectors.getSelectedAccount(state$.value);
        const contractName = deployerState.outputPath[deployerState.outputPath.length - 1]; // TODO: this would be taken from contract settings

        // create deploy runner
        const deployRunner = new DeployRunner(selectedAccount, environment, contractName);

        return deployRunner.checkExistingDeployment(deployerState.buildFiles, deployerState.contractArgs)
            .pipe(
                switchMap(result => {
                    const obs$ = selectedAccount.type === 'metamask' ? externalDeploy() : browserDeploy(state$.value, deployRunner);
                    return concat(
                        result.msg ? of(consoleActions.addRows([ <IConsoleRow>result ])) : empty(),
                        result.canDeploy ? obs$ : empty()
                    );
                }),
                catchError(e => [ consoleActions.addRows([ { channel: 2, msg: e } ]) ])
            );
    })
);
