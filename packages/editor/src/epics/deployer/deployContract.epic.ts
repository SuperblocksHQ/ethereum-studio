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
import { switchMap, catchError, filter, mergeMap, withLatestFrom } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { outputLogActions, panelsActions, explorerActions } from '../../actions';
import { deployerActions } from '../../actions/deployer.actions';
import { projectSelectors } from '../../selectors';
import { DeployRunner, CheckDeployResult } from '../../services';
import { IOutputLogRow, Panels } from '../../models/state';
import { tryExternalDeploy, browserDeploy, doDeployExternally } from './deployContract.epicLib';

export let lastDeployRunner: Nullable<DeployRunner> = null;

export const deployContractEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(deployerActions.DEPLOY_CONTRACT),
    filter(() => state$.value.deployer.allowLastDeploy),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        // prepare params
        const deployerState = state$.value.deployer;
        if (deployerState.needsCompilation) {
            const shouldBeDeployed = true;
            return concat(of(explorerActions.compileContract(action.data.item, shouldBeDeployed)));
        }
        const contractArgs = state$.value.deployer.contractArgs;
        const environment = projectSelectors.getSelectedEnvironment(state);
        const selectedAccount = projectSelectors.getSelectedAccount(state);
        const contractTargetName = deployerState.outputPath[deployerState.outputPath.length - 1]; // TODO: this would be taken from contract settings

        // Finally find the contract target name inside the configuration stored in the dappfile.json
        // const contractProjectItem: IProjectItem = action.data;
        // const dappFileData = projectSelectors.getDappFileData(state);

        // let contractTargetName = '';
        // const contractConfig = dappFileData.contracts.find((contract: IContractConfiguration) => contract.name === contractProjectItem.name);
        // if (contractConfig) {
        //     contractTargetName = contractConfig.name;
        // }

        // create deploy runner
        lastDeployRunner = new DeployRunner(selectedAccount, environment, contractTargetName, contractArgs);

        return concat(
            lastDeployRunner.checkExistingDeployment(deployerState.buildFiles, deployerState.contractArgs)
                .pipe(
                    mergeMap(result => {
                        if (!lastDeployRunner) {
                            return throwError('Unexpected error during deployment process. Please try again.');
                        } else if (result.result === CheckDeployResult.AlreadyDeployed) {
                            return concat(
                                result.msg ? of(outputLogActions.addRows([ <IOutputLogRow>result ])) : empty(),
                                result.result === CheckDeployResult.AlreadyDeployed ? of(deployerActions.deploySuccess(null)) : empty()
                            );
                        }

                        const obs$ = selectedAccount.type === 'metamask' ? tryExternalDeploy(state, lastDeployRunner) : browserDeploy(state, lastDeployRunner);
                        return concat(
                            result.msg ? of(outputLogActions.addRows([ <IOutputLogRow>result ])) : empty(),
                            result.result === CheckDeployResult.CanDeploy ? obs$ : empty(),
                        );
                    }),
                    catchError(e => [ outputLogActions.addRows([ e ]), deployerActions.deployFail() ])
                )
        );
    })
);

export const deployToMainnetEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(deployerActions.DEPLOY_TO_MAINNET),
    withLatestFrom(state$),
    switchMap(([, state]) => {
        if (!lastDeployRunner) {
            return of(outputLogActions.addRows([{ msg: 'Something went wrong. Please delete build folder and try again.', channel: 2 }]));
        }

        return doDeployExternally(state, lastDeployRunner);
    })
);
