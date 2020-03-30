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

import { ITransaction, TransactionType } from '../../models';
import { IAccount } from '../../models/state';
import { projectSelectors } from '../../selectors';

export function formatTransaction(state: any, transactionType: TransactionType, hash?: string, environment?: string, receipt?: any, contractName?: string, tx?: any, contractArgs?: any[], functionName?: string): ITransaction {
    const account: IAccount = projectSelectors.getSelectedAccount(state);
    const networkSettings = state.settings.preferences.network;
    return  {
        hash: hash || '',
        index: receipt ? receipt.transactionIndex : 'n/a',
        type: transactionType,
        contractName: contractName || receipt,
        constructorArgs: contractArgs || [],
        createdAt: Date.now(),
        blockNumber: receipt ? receipt.blockNumber : 'n/a',
        from: account.address,
        to: (receipt && receipt.contractAddress) ? receipt.contractAddress : (tx && tx.to) ? tx.to : '',
        network: environment ? environment : '',
        origin: 'Superblocks',
        value: 0,
        gasUsed: receipt ? receipt.gasUsed : 0,
        status: receipt ? Number(receipt.status) : null,
        gasLimit: networkSettings.gasLimit,
        gasPrice: networkSettings.gasPrice,
        functionName: functionName || ''
    };
}
