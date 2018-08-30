// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Studio.
//
// Superblocks Studio is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Studio is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Studio.  If not, see <http://www.gnu.org/licenses/>.

import { h, Component } from 'preact';
import classnames from 'classnames';
import style from './style';
import classNames from 'classnames';
import RenderTransactions from './rendertransactions';

export default class TransactionLog extends Component {
    constructor(props) {
        super(props);
        this.id=props.id+"_transaction_log";

        const txlog=props.project.props.state.txlog;
        this.renderTransactions = new RenderTransactions(txlog, false, () => {
            this.setState();
        });

        setInterval(()=>this.setState(), 1000);
    }

    render() {
        const env=this.props.project.props.state.data.env;
        const network = env;
        const transactions=this.renderTransactions.renderTransactions(network);

        var noTransactionsMessage;
        if(!transactions.children || transactions.children.length < 1) {
            noTransactionsMessage = ( <div>No transactions to show</div> );
        }

        return (
            <div id={this.id} class={style.main}>
                <div class="scrollable-y" id={this.id+"_scrollable"}>
                    <div class={style.inner}>
                        {noTransactionsMessage}
                        {transactions}
                    </div>
                </div>
            </div>
        );
    }
}
