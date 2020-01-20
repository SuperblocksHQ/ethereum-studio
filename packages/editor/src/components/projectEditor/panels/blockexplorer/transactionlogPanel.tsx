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

import React, { Component } from 'react';
import style from './style.less';
import { Transaction } from './transaction';

interface IProps {
    transactions: any[];
}

export class TransactionLogPanel extends Component<IProps> {
    render() {
        const { transactions } = this.props;

        if (!transactions.length) {
            return(
                <div className={style.noTransactions}>
                    <p>
                        No transactions found
                    </p>
                </div>
            );
        }

        return (
            <div className={style.transactionlogPanel}>
                <div>
                {
                    transactions.map((transaction) =>
                        <Transaction key={transaction.hash} transaction={transaction} />
                    )
                }
                </div>
            </div>
        );
    }
}
