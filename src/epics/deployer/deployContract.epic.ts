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
import { switchMap, catchError, filter, mergeMap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { consoleActions, panelsActions } from '../../actions';
import { deployerActions } from '../../actions/deployer.actions';
import { projectSelectors } from '../../selectors';
import { DeployRunner, CheckDeployResult } from '../../services';
import { IConsoleRow, Panels } from '../../models/state';
import { tryExternalDeploy, browserDeploy, doDeployExternally } from './deployContract.epicLib';

export let lastDeployRunner: Nullable<DeployRunner> = null;

export const deployContractEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(deployerActions.DEPLOY_CONTRACT),
    filter(() => state$.value.deployer.allowLastDeploy),
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
        lastDeployRunner = new DeployRunner(selectedAccount, environment, contractName);

        return concat(
            of(panelsActions.openPanel(Panels.CompilerOutput)),
            lastDeployRunner.checkExistingDeployment(deployerState.buildFiles, deployerState.contractArgs)
                .pipe(
                    mergeMap(result => {
                        if (!lastDeployRunner) {
                            return throwError('Unexpected error during deployment process. Please try again.');
                        }

                        const obs$ = selectedAccount.type === 'metamask' ? tryExternalDeploy(state$.value, lastDeployRunner) : browserDeploy(state$.value, lastDeployRunner);
                        return concat(
                            result.msg ? of(consoleActions.addRows([ <IConsoleRow>result ])) : empty(),
                            result.result === CheckDeployResult.CanDeploy ? obs$ : empty(),
                            result.result === CheckDeployResult.AlreadyDeployed ? of(deployerActions.deploySuccess()) : empty()
                        );
                    }),
                    catchError(e => [ consoleActions.addRows([ { channel: 2, msg: e } ]), deployerActions.deployFail() ])
                )
        );
    })
);

export const deployToMainnetEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(deployerActions.DEPLOY_TO_MAINNET),
    switchMap(() => {
        if (!lastDeployRunner) {
            return of(consoleActions.addRows([{ msg: 'Smth went wrong. Please delete build folder and try again.', channel: 2 }]));
        }

        return doDeployExternally(state$.value, lastDeployRunner);
    })
);
