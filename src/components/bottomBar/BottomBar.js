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
import PropTypes from 'prop-types';
import style from './style.less';
import Note from '../note';
import OnlyIf from '../onlyIf';
import { shortenBalance } from '../../utils/accounts';

export default class BottomBar extends Component {

    constructor() {
        super();
        this.web3 = new Web3();
    }

    render() {
        const { networkPreferences, endpoint, selectedAccount, showBottomBarNote } = this.props;
        const gasPrice = this.web3.fromWei(networkPreferences.gasPrice, 'Gwei');
        let accountBalance = 0;
        if(selectedAccount)
            accountBalance = shortenBalance(selectedAccount.balance);

        return (
            <div className={style.bottomStatusBar} id={"bottom_bar"}>
                <OnlyIf test={showBottomBarNote}>
                    <span className={style.left}>
                        <Note
                            title="Note"
                            text="All files are stored in the browser only, download to backup"
                        />
                    </span>
                </OnlyIf>
                <div className={style.right}>
                    <span>Account balance: {accountBalance}</span>
                    <span>Gas Limit: {networkPreferences.gasLimit}</span>
                    <span>Gas Price: {gasPrice} Gwei</span>
                    <span>{endpoint}</span>
                </div>
            </div>
        )
    }
}

BottomBar.propType = {
    gasLimit: PropTypes.number.isRequired,
    gasLimit: PropTypes.number.isRequired,
    endpoint:  PropTypes.string.isRequired,
    selectedAccount: PropTypes.object,
    showBottomBarNote: PropTypes.boolean
}
