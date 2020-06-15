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

import { ITransaction, TransactionType, IApiError } from '../../models';
import { IAccount } from '../../models/state';
import { projectSelectors } from '../../selectors';
import { IFormatTransactionParams } from '../../models/formatTransaction.model';

export function formatTransaction(
    params: IFormatTransactionParams
    ): ITransaction {
    const account: IAccount = projectSelectors.getSelectedAccount(params.state);
    const networkSettings = params.state.settings.preferences.network;
    return  {
        hash: params.hash || '',
        index: params.receipt ? params.receipt.transactionIndex : 'n/a',
        type: params.transactionType,
        contractName: params.contractName || '',
        constructorArgs: params.contractArgs || [],
        createdAt: Date.now(),
        blockNumber: params.receipt ? params.receipt.blockNumber : 'n/a',
        from: account.address,
        to: (params.receipt && params.receipt.contractAddress) ? params.receipt.contractAddress : (params.tx && params.tx.to) ? params.tx.to : '',
        network: params.environment ? params.environment : '',
        origin: 'Superblocks',
        value: 0,
        gasUsed: params.receipt ? params.receipt.gasUsed : 0,
        status: params.receipt ? Number(params.receipt.status) : null,
        gasLimit: networkSettings.gasLimit,
        gasPrice: networkSettings.gasPrice,
        functionName: params.functionName || '',
        error: params.error || undefined
    };
}
