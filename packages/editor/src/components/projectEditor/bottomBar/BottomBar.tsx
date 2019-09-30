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
import Web3 from 'web3';
import style from './style.less';
import { shortenBalance } from '../../../utils/accounts';
import { IAccount } from '../../../models/state';

interface IProps {
    endpoint:  string;
    selectedAccount: IAccount;
    networkPreferences: any;
}

export default class BottomBar extends Component<IProps> {
    private readonly web3: any;
    constructor(props: IProps) {
        super(props);
        this.web3 = new Web3();
    }

    render() {
        const { networkPreferences, endpoint, selectedAccount } = this.props;
        const gasPrice = this.web3.fromWei(networkPreferences.gasPrice, 'Gwei');
        let accountBalance = '0';
        if (selectedAccount && selectedAccount.balance !== null) {
            accountBalance = shortenBalance(selectedAccount.balance);
        }
        return (
            <div className={style.bottomStatusBar}>
                <div className={style.left}>
                    <a href='https://superblocks.com' target='_blank' rel='noopener noreferrer'>
                        <img src='/static/img/img-logo.svg' alt='Superblocks' />
                    </a>
                </div>
                <div className={style.right}>
                    <span>Account balance: {accountBalance}</span>
                    <span>Gas Limit: {networkPreferences.gasLimit}</span>
                    <span>Gas Price: {gasPrice} Gwei</span>
                    <span>{endpoint}</span>
                </div>
            </div>
        );
    }
}
