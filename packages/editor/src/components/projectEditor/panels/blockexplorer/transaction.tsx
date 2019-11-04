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
import style from './style-transaction.less';
import { TransactionType, ITransaction } from '../../../../models';
import { IconRun } from '../../../icons';
import classNames from 'classnames';
import Web3 from 'web3';

interface IProps {
    transaction: ITransaction;
}

interface IState {
    transactionAge: string;
    timer: any;
    isExpanded: boolean;
}

export class Transaction extends Component<IProps, IState> {
    state: IState = {
        transactionAge: '0 sec',
        timer: null,
        isExpanded: false
    };

    private readonly web3: any;

    constructor(props: IProps) {
        super(props);
        this.web3 = new Web3();
    }

    componentDidMount() {
        this.state.timer = setInterval(() => this._updateAge(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    _renderStatus() {
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

    _renderHeader() {
        const { type, contractName } = this.props.transaction;

        if (type === TransactionType.Deploy) {
            return (
                <div className={style.header}>
                    <div className={style.title}>Deploy {contractName}</div>
                    {this._renderStatus()}
                </div>
            );
        } else {
            return (
                <div className={style.header}>
                    <div className={style.title}>{type}</div>
                    {this._renderStatus()}
                </div>
            );
        }
    }

    _renderLeft() {
        const { type, from, to, value } = this.props.transaction;

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
            const valueFormatted = this.web3.fromWei(value);

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
                        <span title='{value} wei'>{valueFormatted} ether</span>
                    </div>
                </div>
            );
        }
    }

    _updateAge() {
        const { createdAt } = this.props.transaction;

        let seconds = Math.floor((Date.now() - createdAt) / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
        const hours = Math.floor(minutes / 60);
        minutes -= hours * 60;
        let result = '';
        if (hours > 0) {
            result += hours + ' h ';
        }
        if (minutes > 0) {
            result += minutes + ' min ';
        } else if (hours === 0) {
            result += seconds + ' sec';
        }
        this.setState({
            transactionAge: result
        });
    }

    _renderBlockNr() {
        const { blockNumber, index } = this.props.transaction;

        return (
            <div>
                <b>Block</b> #{blockNumber}{' '}
                <span title='Order of this transaction inside the block'>
                    (Index {index})
                </span>
            </div>
        );
    }

    _renderBottomContentLeft() {
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

    _toggleBottom() {
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    }

    _renderDeployArguments() {
        const { constructorArgs } = this.props.transaction;

        return (
            <div>
                <b>Constructor arguments:</b> {constructorArgs.join(', ')}
            </div>
        );
    }

    render() {
        const { transaction } = this.props;
        const { transactionAge, isExpanded } = this.state;

        const gasCostFormatted = this.web3.fromWei(transaction.gasUsed, 'gwei');
        const gasPriceFormatted = this.web3.fromWei(transaction.gasPrice, 'gwei');

        return (
            <div key={transaction.hash} className={style.txbox}>
                {this._renderHeader()}
                <div className={style.infoContainer}>
                    {this._renderLeft()}
                    <div className={style.right}>
                        <div className={style.row}>
                            <div>
                                <b>Age:</b> {transactionAge}
                            </div>
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
                                {isExpanded ? (
                                    <b>Hide more</b>
                                ) : (
                                    <b>Show more</b>
                                )}
                            </button>
                        </div>
                        {isExpanded && (
                            <div className={style.bottomContent}>
                                {this._renderBottomContentLeft()}
                                <div className={style.right}>
                                    <div className={style.row}>
                                        <b>Gas Limit:</b> {transaction.gasLimit}
                                    </div>
                                    <div className={style.row}>
                                        <b>Gas Price:</b> {gasPriceFormatted}{' '}
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
}
