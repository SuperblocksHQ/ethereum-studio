// Copyright 2018 Superblocks AB
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
import RenderTransactions from './rendertransactions';

export default class TransactionLog extends Component {

    constructor(props) {
        super(props);

        this.id = props.id + '_transaction_log';
    }

    componentDidMount() {
        const txlog = props.project.props.state.txlog;
        this.renderTransactions = new RenderTransactions(txlog, false, () => {
            this.forceUpdate();
        });

        this.timer = setInterval(() => this.forceUpdate(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        const env = this.props.project.props.state.data.env;
        const network = env;
        const transactions = this.renderTransactions.renderTransactions(
            network
        );

        var noTransactionsMessage;
        if (!transactions.children || transactions.children.length < 1) {
            noTransactionsMessage = <div>No transactions to show</div>;
        }

        return (
            <div id={this.id} className={style.main}>
                <div className="scrollable-y" id={this.id + '_scrollable'}>
                    <div className={style.inner}>
                        {noTransactionsMessage}
                        {transactions}
                    </div>
                </div>
            </div>
        );
    }
}
