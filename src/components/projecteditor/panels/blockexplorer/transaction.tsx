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
import style from './style-normal.less';
import { TransactionType, ITransaction } from '../../../../models';
import { IconRun } from '../../../icons';
import classNames from 'classnames';

interface IProps {
    transaction: ITransaction;
}

interface IState {
    transactionAge: string;
    timer: any;
    expanded: boolean;
}

export class Transaction extends Component<IProps, IState> {
    state: IState = {
        transactionAge: '0 sec',
        timer: null,
        expanded: false
    };

    componentDidMount() {
        this.state.timer = setInterval(() => this._updateAge(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    _renderStatus = () => {
        const { status } = this.props.transaction;

        if (!status) {
            return (
                <div
                    className={classNames([
                        style.status,
                        style.pending,
                    ])}
                >
                    <div className={style.running}>
                        <IconRun className={style.running} />
                    </div>
                </div>
            );
        } else {
            if (status === 1) {
                return (
                    <div
                        className={classNames([
                            style.status,
                            style.success,
                        ])}
                    />
                );
            } else {
                return (
                    <div
                        className={classNames([
                            style.status,
                            style.failure,
                        ])}
                    />
                );
            }
        }
    }

    _renderHeader = () => {
        const { transaction } = this.props;

        if (transaction.type === TransactionType.Deploy) {
            return (
                <div className={style.header}>
                    <div className={style.title}>Deploy {transaction.contractName}</div>
                    {this._renderStatus()}
                </div>
            );
        } else {
            return (
                <div className={style.header}>
                    <div className={style.title}>Transaction</div>
                    {this._renderStatus()}
                </div>
            );
        }
    }

    _renderLeft = (/*tx, type, network*/) => {
        const { type, network, from, status, to } = this.props.transaction;

        if (type === TransactionType.Deploy) {
            return (
                <div className={style.left}>
                    <div className={style.row}>
                        <b>Creator:</b>{' '}
                        <div className={style.address}>{from}</div>
                    </div>
                    <div className={style.row}>
                        <b>Contract address:</b>{' '}
                        <div className={style.address}>{to}</div>
                    </div>
                </div>
            );
        } else {
            /*const value =
                typeof tx.obj.value == 'object'
                    ? tx.obj.value.toNumber()
                    : tx.obj.value;
            const valueFormatted = this.web3.fromWei(value);*/
            return (
                <div className={style.left}>
                    <div className={style.row}>
                        <b>From:</b>
                        <div className={style.address}>{from}</div>
                    </div>
                    <div className={style.row}>
                        <b>To:</b>
                        <div className={style.address}>{to}</div>
                    </div>
                    <div className={style.row}>
                        <b>Value:</b>{' '}
                        <span title='{value} wei'>{/*valueFormatted*/} ether</span>
                    </div>
                </div>
            );
        }
    }


    _updateAge = () => {
        const { createdAt } = this.props.transaction;
        // var seconds = parseInt((Date.now() - createdAt) / 1000);
        let seconds = Math.floor((Date.now() - createdAt) / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
        const hours = Math.floor(minutes / 60);
        minutes -= hours * 60;
        let ret = '';
        if (hours > 0) {
            ret += hours + ' h ';
        }
        if (minutes > 0) {
            ret += minutes + ' min ';
        } else if (hours === 0) {
            ret += seconds + ' sec';
        }
        this.setState({
            transactionAge: ret
        });
    }

    _renderOrigin = () => {
        const { origin } = this.props.transaction;

        return (
            <div>
                <b>Origin:</b> {origin}
            </div>
        );
    }

    _renderBlockNr = () => {
        const { blockNumber, index } = this.props.transaction;
        const blockNr: string | number = blockNumber >= 0 ? blockNumber : 'n/a';
        const txIndex: string | number = index >= 0 ? index : 'n/a';
        console.log('WTF', blockNumber, index);
        return (
            <div>
                <b>Block</b> #{blockNr}{' '}
                <span title='Order of this transaction inside the block'>
                    (Index {txIndex})
                </span>
            </div>
        );
    }

    _renderBottomContentLeft = () => {
        const { transaction } = this.props;

        if (transaction.type === TransactionType.Deploy) {
            return (
                <div className={style.left}>
                    <div className={style.row}>
                        <div className={style.deployArgs}>
                            {this._renderDeployArguments()}
                        </div>
                    </div>
                </div>
            );
        }
    }

    _toggleBottom = () => {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    _renderDeployArguments = () => {
        // TODO: Constructor args
        /*
        const args2 = [];
        tx.deployArgs.map(arg => {
            if (arg.value !== undefined) args2.push(arg.value);
            else if (arg.account !== undefined) args2.push(arg.account);
            else if (arg.contract !== undefined) args2.push(arg.contract);
        });*/
        return (
            <div>
                <b>Constructor arguments:</b> {/*args2.join(', ')*/ ' TODO'}
            </div>
        );
    }

    _renderBox = (/*type, network, classes*/) => {
        // classes = classes || {};
        const { transaction } = this.props;
        const classes = {};
        // const gasUsed = (transaction.status || {}).gasUsed || 0;
        /*const gasPrice =
            typeof tx.obj.gasPrice == 'object'
                ? tx.obj.gasPrice.toNumber()
                : tx.obj.gasPrice;
        const gasCost = gasUsed * gasPrice;
        // const gasPriceFormatted = this.web3.fromWei(gasPrice, 'gwei');
        // const gasCostFormatted = this.web3.fromWei(gasCost, 'ether');
        

        classes[style.txbox] = true;*/
        const gasCostFormatted = transaction.gasLimit;
        return (
            <div key={transaction.hash} className={style.txbox}>
                {this._renderHeader()}
                <div className={style.infoContainer}>
                    {this._renderLeft()}
                    <div className={style.right}>
                        <div className={style.row}>
                            <div>
                                <b>Age:</b> {this.state.transactionAge}
                            </div>
                        </div>
                        <div className={style.row}>
                            {this._renderOrigin()}
                        </div>
                        <div className={style.row}>
                            {this._renderBlockNr()}
                        </div>
                        <div className={style.row}>
                            <b>Gas used:</b> {transaction.gasUsed}
                        </div>
                    </div>
                    <div className={style.bottom}>
                        <div className={style.bottomButton}>
                            <button
                                className='btnNoBg'
                                onClick={e => {
                                    this._toggleBottom();
                                    e.preventDefault();
                                }}
                            >
                                {this.state.expanded ? (
                                    <b>Hide more</b>
                                ) : (
                                    <b>Show more</b>
                                )}
                            </button>
                        </div>
                        {this.state.expanded && (
                            <div className={style.bottomContent}>
                                {this._renderBottomContentLeft()}
                                <div className={style.right}>
                                    <div className={style.row}>
                                        <b>Gas Limit:</b> {transaction.gasLimit}
                                    </div>
                                    <div className={style.row}>
                                        <b>Gas Price:</b> {transaction.gasPrice}{' '}
                                        GWei
                                    </div>
                                    <div className={style.row}>
                                        <b>Gas cost:</b> {gasCostFormatted}{' '}
                                        Ether
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }



    render() {
        const { transaction } = this.props;

        return (
            <React.Fragment>
                { this._renderBox() }
            </React.Fragment>
        );
    }
}
