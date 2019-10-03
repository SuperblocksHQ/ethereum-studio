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

import { switchMap, catchError, withLatestFrom } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { interactActions } from '../../actions';
import { of, from } from 'rxjs';
import { getWeb3 } from '../../services/utils';
import { projectSelectors } from '../../selectors';
import { IDeployedContract, IRawAbiDefinition } from '../../models';

const call$ = (instance: any, name: string) => {
    return from(
        new Promise((resolve, reject) => {
            instance[name]((err: any, result: any) => {
                if (err) {
                    console.log(err);
                    reject(`Problem calling to get the ${name}`);
                }
                resolve(result);
            });
        })
    );
};

const getContractInstance$ = (endpoint: string, deployedContract: IDeployedContract) => {
    const web3 = getWeb3(endpoint);

    // Create the contract interface using the ABI provided in the configuration.
    const contractInterface = web3.eth.contract(deployedContract.abi);

    // Create the contract instance for the specific address provided in the configuration.
    return of(contractInterface.at(deployedContract.address));
};

export const interactWithContractEpic: Epic = (action$, state$) => action$.pipe(
    ofType(interactActions.INTERACT_WITH_CONTRACT),
    withLatestFrom(state$),
    switchMap(([action, state]) => {

        const deployedContract: IDeployedContract = action.data.deployedContract;
        const rawAbiDefinition: IRawAbiDefinition = action.data.rawAbiDefinition;
        const selectedEnv = projectSelectors.getSelectedEnvironment(state);

        return getContractInstance$(selectedEnv.endpoint, deployedContract)
            .pipe(
                switchMap((contractInstance) => call$(contractInstance, rawAbiDefinition.name)),
                switchMap((result) => [interactActions.interactWithContractSuccess(result)]),
                catchError((error) => {
                    console.log('There was an issue interacting with the contract: ' + error);
                    return of(interactActions.interactWithContractFail(error));
                })
            );
    })
);
