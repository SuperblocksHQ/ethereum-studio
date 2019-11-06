// Copyright 2019 Superblocks AB

// This file is part of Superblocks Lab.

// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.

// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import { IContractArgData, ContractArgTypes } from '../../models';
import { IAccount } from '../../models/state';

/**
 * Function to normalize and compile the contract arguments defined by the user to something web3 can use to configure the
 * deployment.
 *
 * @param contractArgs Contract arguments setup by the user in the Contract Configuration screen
 */
export function normalizeContractArgs(contractArgs: IContractArgData[], accounts: IAccount[]) {
    const normalizedContractArgs: any[] = [];
    for (const argument of contractArgs) {
        switch (argument.type) {
            case ContractArgTypes.value:
                normalizedContractArgs.push(argument.value);
                break;
            case ContractArgTypes.array:
                normalizedContractArgs.push(argument.value.split(','));
                break;
            case ContractArgTypes.account:
                const account = accounts.find(({name}) => name === argument.value);
                normalizedContractArgs.push(account && account.address);
                break;
            default:
                break;
        }
    }

    return normalizedContractArgs;
}
