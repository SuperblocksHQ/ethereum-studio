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

import { h, Component } from 'preact';
import style from './style';
import RenderTransactions from './rendertransactions';

export default class TransactionLogPanel extends Component {
    constructor(props) {
        super(props);

        setInterval(() => this.setState(),1000);
    }

    _getRender = (txlog) => {
        if (this.renderTransactions) {
            return this.renderTransactions;
        }
        this.renderTransactions = new RenderTransactions(txlog, true, () => {
            this.setState();
        });
        return this.renderTransactions;
    };

    _getTxLog = () => {
        if (!this.props.router.control) return;
        const project=this.props.router.control.getActiveProject();
        if (!project) return;
        return project.props.state.txlog;
    };

    render() {
        const txlog = this._getTxLog();
        if (!txlog) return;
        const env=this.props.router.control.getActiveProject().props.state.data.env;
        const network = env;

        const renderTransactions = this._getRender(txlog);
        const transactions=renderTransactions.renderTransactionsFloat(network, 5, 0);
        return (
            <div class={style.transactionlogPanel}>
                <div onMouseDown={(e)=>this.props.onResize(e,{ resizeTranView: true })} class={style.dragBar}/>
                {transactions}
            </div>
        );
    }
}
