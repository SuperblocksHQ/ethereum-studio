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
import { from, empty } from 'rxjs';
import { getWeb3 } from '../../services/utils';
import { projectSelectors, interactSelectors } from '../../selectors';

function checkContractDeployment$(endpoint: string, tx: string, code: string) {
    const web3 = getWeb3(endpoint);
    return from(new Promise((resolve, reject) => {
        web3.eth.getTransaction(tx, (err: any, res: any) => {
            if (err || !res || res.input !== code) {
                reject();
            } else {
                resolve();
            }
        });
    }));
}

export const checkDeployedContractsEpic: Epic = (action$, state$) => action$.pipe(
    ofType(interactActions.TOGGLE_INTERACT_TREE_ITEM),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const deployedContract = interactSelectors.getDeployedItems(state).find(c => c.id === action.data.id);
        if (!deployedContract || !deployedContract.opened) { // in case item was closed - no need to check
            return empty();
        }

        const env = projectSelectors.getSelectedEnvironment(state);
        return checkContractDeployment$(env.endpoint, deployedContract.tx, deployedContract.deploy).pipe(
            map(() => interactActions.setContactDeployed(deployedContract.id, true)),
            catchError(() => [interactActions.setContactDeployed(deployedContract.id, false)])
        );
    })
);
