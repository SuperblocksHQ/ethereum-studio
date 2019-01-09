import React from 'react';
import classNames from 'classnames';
import styleNormal from './style-normal.less';
import styleSmall from './style-small.less';
import Web3 from 'web3';
import { IconRun } from '../../../icons';

export default class RenderTransactions {
    constructor(txlog, renderSmall, redrawFn) {
        this.txlog = txlog;
        this.style = renderSmall ? styleSmall : styleNormal;
        this.web3 = new Web3();
        this.redraw = redrawFn; // We use this to trigger a redraw of the parent component.
        this.bottomVisible = {};
    }

    renderTransactions = network => {
        const transactions = this.txlog
            .transactions(network)
            .map(transaction => {
                return this._renderTransaction(transaction, network);
            });

        return <div className={this.style.inner}>{transactions}</div>;
    };

    renderTransactionsFloat = (network, maxCount, maxAge) => {
        // Max count of txs to render (in rev. order), 0 = all.
        // We can set a max age of tx to show, in seconds.
        const classes = {}; // We pass on some css classes for fade in/out.
        var count = 0;
        const transactions = this.txlog
            .transactions(network)
            .map(transaction => {
                if (transaction.state.hidden) return;
                if (count++ >= maxCount) return; // maxCount = 0 means take all.
                if (maxAge > 0) {
                    // Check timestamp
                    if (Date.now() - transaction.ts > maxAge * 1000) {
                        transaction.state.hidden = true;
                        classes[this.style.fadeout] = true;
                    }
                }
                classes[this.style.fadein] = !transaction.state.hasBeenRendered; // Fade in if first time rendered.
                transaction.state.hasBeenRendered = true;
                return this._renderTransaction(transaction, network, classes);
            });

        return <div className={this.style.inner}>{transactions}</div>;
    };

    _renderTransaction = (tx, network, classes) => {
        if (!tx.obj) {
            // Waiting for tx to be propagated around network.
            return (
                <div className={this.style.txbox}>Waiting for tx to propagate</div>
            );
        } else {
            if (tx.contract) {
                // contract deployment
                return this._renderBox(tx, 'deployment', network, classes);
            } else {
                // Transaction to account/contract
                return this._renderBox(tx, 'transaction', network, classes);
            }
        }
    };

    _renderStatus = tx => {
        if (!tx.receipt) {
            return (
                <div
                    className={classNames([
                        this.style.status, 
                        this.style.pending,
                    ])}
                >
                    <div className={this.style.running}>
                        <IconRun className={this.style.running} />
                    </div>
                </div>
            );
        } else {
            if (parseInt(tx.receipt.status) == 1) {
                return (
                    <div
                        className={classNames([
                            this.style.status,
                            this.style.success,
                        ])}
                    />
                );
            } else {
                return (
                    <div
                        className={classNames([
                            this.style.status,
                            this.style.failure,
                        ])}
                    />
                );
            }
        }
    };

    _mapAddress = (address, network) => {
        const contracts = this.txlog.contracts(network);
        const accounts = this.txlog.accounts(network);
        if (contracts[address]) {
            return (
                <span title={address} className={this.style.contractAddress}>
                    this.contracts[address]
                </span>
            );
        } else if (accounts[address]) {
            return (
                <span title={address} className={this.style.accountAddress}>
                    this.accounts[address]
                </span>
            );
        }
        return address;
    };

    _renderAddress = (address, network) => {
        const mappedAddress = this._mapAddress(address, network);
        return <div className={this.style.address}>{mappedAddress}</div>;
    };

    _formatAge = ts => {
        var seconds = parseInt((Date.now() - ts) / 1000);
        var minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
        const hours = Math.floor(minutes / 60);
        minutes -= hours * 60;
        var ret = '';
        if (hours > 0) {
            ret += hours + ' h ';
        }
        if (minutes > 0) {
            ret += minutes + ' min ';
        } else if (hours == 0) {
            ret += seconds + ' sec';
        }
        return ret;
    };

    _renderAge = tx => {
        const age = this._formatAge(tx.ts);
        return (
            <div>
                <b>Age:</b> {age}
            </div>
        );
    };

    _renderOrigin = tx => {
        return (
            <div>
                <b>Origin:</b> {tx.origin}
            </div>
        );
    };

    _renderBlockNr = tx => {
        var blockNr = 'n/a';
        var index = 'n/a';
        if (tx.receipt) {
            blockNr = tx.receipt.blockNumber;
            index = tx.receipt.transactionIndex;
        }
        return (
            <div>
                <b>Block</b> #{blockNr}{' '}
                <span title="Order of this transaction inside the block">
                    (Index {index})
                </span>
            </div>
        );
    };

    _renderDeployArguments = tx => {
        // The deploy arguments are provided as is and do not have to be decoded.
        // TODO: these args need decoding from names to addresses... possibly.
        const args2 = [];
        tx.deployArgs.map(arg => {
            if (arg.value !== undefined) args2.push(arg.value);
            else if (arg.account !== undefined) args2.push(arg.account);
            else if (arg.contract !== undefined) args2.push(arg.contract);
        });
        return (
            <div>
                <b>Constructor arguments:</b> {args2.join(', ')}
            </div>
        );
    };

    _renderHeader = (tx, type) => {
        if (type == 'deployment') {
            return (
                <div className={this.style.header}>
                    <div className={this.style.title}>Deploy {tx.contract}</div>
                    {this._renderStatus(tx)}
                </div>
            );
        } else {
            return (
                <div className={this.style.header}>
                    <div className={this.style.title}>Transaction</div>
                    {this._renderStatus(tx)}
                </div>
            );
        }
    };

    _renderLeft = (tx, type, network) => {
        if (type == 'deployment') {
            return (
                <div className={this.style.left}>
                    <div className={this.style.row}>
                        <b>Creator:</b>{' '}
                        {this._renderAddress(tx.obj.from, network)}
                    </div>
                    <div className={this.style.row}>
                        <b>Contract address:</b>{' '}
                        {this._renderAddress(
                            (tx.receipt || {}).contractAddress
                        )}
                    </div>
                </div>
            );
        } else {
            const value =
                typeof tx.obj.value == 'object'
                    ? tx.obj.value.toNumber()
                    : tx.obj.value;
            const valueFormatted = this.web3.fromWei(value);
            return (
                <div className={this.style.left}>
                    <div className={this.style.row}>
                        <b>From:</b> {this._renderAddress(tx.obj.from)}
                    </div>
                    <div className={this.style.row}>
                        <b>To:</b> {this._renderAddress(tx.obj.to)}
                    </div>
                    <div className={this.style.row}>
                        <b>Value:</b>{' '}
                        <span title="{value} wei">{valueFormatted} ether</span>
                    </div>
                </div>
            );
        }
    };

    _renderTransactionData = tx => {
        return <div>&nbsp;</div>;
    };

    _renderBottomContentLeft = (tx, type) => {
        if (type == 'deployment') {
            return (
                <div className={this.style.left}>
                    <div className={this.style.row}>
                        <div className={this.style.deployArgs}>
                            {this._renderDeployArguments(tx)}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={this.style.left}>
                    <div className={this.style.row}>
                        <div className={this.style.deployArgs}>
                            {this._renderTransactionData(tx)}
                        </div>
                    </div>
                </div>
            );
        }
    };

    _renderBox = (tx, type, network, classes) => {
        classes = classes || {};
        const gasUsed = (tx.receipt || {}).gasUsed || 0;
        const gasPrice =
            typeof tx.obj.gasPrice == 'object'
                ? tx.obj.gasPrice.toNumber()
                : tx.obj.gasPrice;
        const gasCost = gasUsed * gasPrice;
        const gasPriceFormatted = this.web3.fromWei(gasPrice, 'gwei');
        const gasCostFormatted = this.web3.fromWei(gasCost, 'ether');
        classes[this.style.txbox] = true;
        return (
            <div key={tx.hash} className={classNames(classes)}>
                {this._renderHeader(tx, type)}
                <div className={this.style.infoContainer}>
                    {this._renderLeft(tx, type, network)}
                    <div className={this.style.right}>
                        <div className={this.style.row}>{this._renderAge(tx)}</div>
                        <div className={this.style.row}>
                            {this._renderOrigin(tx)}
                        </div>
                        <div className={this.style.row}>
                            {this._renderBlockNr(tx)}
                        </div>
                        <div className={this.style.row}>
                            <b>Gas used:</b> {gasUsed}
                        </div>
                    </div>
                    <div className={this.style.bottom}>
                        <div className={this.style.bottomButton}>
                            <button
                                className="btnNoBg"
                                onClick={e => {
                                    this._toggleBottom(tx);
                                    e.preventDefault();
                                }}
                            >
                                {this.bottomVisible[tx.hash] ? (
                                    <b>Hide more</b>
                                ) : (
                                    <b>Show more</b>
                                )}
                            </button>
                        </div>
                        {this.bottomVisible[tx.hash] && (
                            <div className={this.style.bottomContent}>
                                {this._renderBottomContentLeft(tx, type)}
                                <div className={this.style.right}>
                                    <div className={this.style.row}>
                                        <b>Gas Limit:</b> {tx.obj.gas}
                                    </div>
                                    <div className={this.style.row}>
                                        <b>Gas Price:</b> {gasPriceFormatted}{' '}
                                        GWei
                                    </div>
                                    <div className={this.style.row}>
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
    };

    _toggleBottom = tx => {
        this.bottomVisible[tx.hash] = !this.bottomVisible[tx.hash];
        this.redraw();
    };

    _shorten = s => {
        s = s || '';
        if (s.length > 3) {
            return (
                <div>
                    <span title={s}>{s.substr(0, 5) + '...'}</span>
                </div>
            );
        } else {
            return s;
        }
    };
}
