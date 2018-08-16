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

export default class TransactionLog extends Component {
    constructor(props) {
        super(props);
        this.id=props.id+"_transaction_log";
        //this.props.parent.childComponent=this;

        this.txlog=props.project.props.state.txlog;

        setInterval(()=>this.setState(),2000);
    }

    _renderTransaction=(tx)=>{
        const format=this._format;
        return (
            <tr>
                <td>{format("origin", tx)}</td>
                <td>{format("network", tx)}</td>
                <td>{format("blocknumber", tx)}</td>
                <td>{format("hash", tx)}</td>
                <td>{format("nonce", tx)}</td>
                <td>{format("gas", tx)}</td>
                <td>{format("gasprice", tx)}</td>
                <td>{format("from", tx)}</td>
                <td>{format("to", tx)}</td>
                <td>{format("value", tx)}</td>
                <td>{format("input", tx)}</td>
                <td>{format("status", tx)}</td>
                <td>{format("gasused", tx)}</td>
                <td>{format("index", tx)}</td>
                <td>{format("contractaddress", tx)}</td>
            </tr>
        );
    };

    _shorten=(s)=>{
        s=s||"";
        if(s.length>3) {
            return (
                <div>
                    <span title={s}>
                        {s.substr(0,5) + "..."}
                    </span>
                </div>
            );
        }
        else {
            return s;
        }
    };

    _format=(t, tx)=>{
        const shorten=this._shorten;
        if(t=="origin") {
            return (
                <span title={tx.context}>
                    {tx.origin}
                </span>
            );
        }
        else if(t=="network") {
            return tx.network;
        }
        else if(t=="blocknumber") {
            if(tx.receipt) {
                return tx.receipt.blockNumber;
            }
        }
        else if(t=="hash") {
            return shorten(tx.hash);
        }
        else if(t=="nonce") {
            if(tx.obj) {
                return tx.obj.nonce;
            }
        }
        else if(t=="gas") {
            if(tx.obj) {
                return tx.obj.gas;
            }
        }
        else if(t=="gasprice") {
            if(tx.obj) {
                return (typeof(tx.obj.gasPrice)=="object"?tx.obj.gasPrice.toNumber():tx.obj.gasPrice);
            }
        }
        else if(t=="from") {
            if(tx.obj) {
                return shorten(tx.obj.from);
            }
        }
        else if(t=="to") {
            if(tx.obj) {
                if(tx.obj.to=="0x"||parseInt(tx.obj.to||"0")==0) {
                    return "Contract deployment";
                }
                else {
                    return shorten(tx.obj.to);
                }
            }
        }
        else if(t=="value") {
            if(tx.obj) {
                return (typeof(tx.obj.value)=="object"?tx.obj.value.toNumber():tx.obj.value);
            }
        }
        else if(t=="input") {
            if(tx.obj) {
                return shorten(tx.obj.input);
            }
        }
        else if(t=="status") {
            if(tx.receipt) {
                if(parseInt(tx.receipt.status)==1) {
                    return "Success";
                }
                else {
                    return "Failure";
                }
            }
            else {
                return "Pending...";
            }
        }
        else if(t=="gasused") {
            if(tx.receipt) {
                return parseInt(tx.receipt.gasUsed);
            }
        }
        else if(t=="index") {
            if(tx.receipt) {
                return parseInt(tx.receipt.transactionIndex);
            }
        }
        else if(t=="contractaddress") {
            if(tx.receipt) {
                if(tx.receipt.contractAddress) {
                    return shorten(tx.receipt.contractAddress);
                }
            }
        }
        return "n/a";
    };

    _renderTransactions=()=>{
        const transactions=this.txlog.transactions().map(transaction=>{
            return this._renderTransaction(transaction);
        });
        return (
            <table>
                <tr>
                    <th>Origin</th>
                    <th>Network</th>
                    <th>Block</th>
                    <th>Tx #</th>
                    <th>Nonce</th>
                    <th>Gas</th>
                    <th>GasPrice</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Value</th>
                    <th>Input</th>

                    <th>Status</th>
                    <th>GasUsed</th>
                    <th>Index</th>
                    <th>Contract address</th>
                </tr>
                {transactions}
            </table>
        );
    };

    render() {
        const transactions=this._renderTransactions();
        return (
            <div id={this.id} class={style.main}>
                <div class="scrollable-y" id={this.id+"_scrollable"}>
                    <div class={style.inner}>
                        <div class={style.transactionlog}>
                            <div class={style.txtable}>
                                {transactions}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
