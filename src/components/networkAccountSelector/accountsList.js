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
import classnames from 'classnames';
import { Tooltip } from '../common';
import style from './style.less';
import copy from 'copy-to-clipboard';
import * as accountUtils from '../../utils/accounts';
import { IconTrash, IconEdit, IconCopy } from '../icons';

export class AccountsList extends Component {
    copyAddress = str => {
        copy(str);
    }
    
    render() {
        var accounts, chosenAccount;
        const project = this.props.router.control.getActiveProject();
        if (!project) {
            // Setup default account just for show.
            accounts = [
                {
                    getName: () => {
                        return 'Default';
                    },
                },
            ];
            chosenAccount = 'Default';
        } else {
            chosenAccount = project.getAccount();
            const accountsItem = project.getHiddenItem('accounts');
            accounts = accountsItem.getChildren();
        }

        const renderedAccounts = accounts.map((account, index) => {
            const cls = {};
            cls[style.accountLink] = true;
            if (account.getName() === chosenAccount) {
                cls[style.accountLinkChosen] = true;
            }

            let address = '';
            if (this.props.functions.EVM.isReady()) {
                const accountInfo = accountUtils.getAccountInfo(
                    this.props.router.control.getActiveProject(),
                    account,
                    this.props.functions.wallet,
                    this.props.environment);
                address = accountInfo.address;
            }

            let deleteButton;
            if (index !== 0) {
                deleteButton = (
                    <button
                        className="btnNoBg"
                        onClick={e => {
                            this.props.onAccountDelete(e, index);
                        }}
                    >
                        <Tooltip title="Delete">
                            <IconTrash />
                        </Tooltip>
                    </button>
                );
            } else {
                deleteButton = (
                    <button className="btnNoBg">
                        <i>&nbsp;&nbsp;&nbsp;&nbsp;</i>
                    </button>
                );
            }

            const formattedAddress = accountUtils.shortenAddres(address);

            return (
                <div key={index}>
                    <div
                        className={classnames(cls)}
                        onClick={e => {
                            e.preventDefault();
                            this.props.onAccountChosen(account.getName());
                        }}
                    >
                        <div className={style.nameContainer}>
                            <div>{account.getName()}</div>
                            <div className={style.address}>{formattedAddress}</div>
                        </div>
                        <div className={style.actionsContainer}>
                            <button
                                className="btnNoBg"
                                onClick={e => {
                                    if (this.props.functions.EVM.isReady()) {
                                        this.props.onAccountEdit(e, index);
                                    } else {
                                        console.log("EVM is not ready!");
                                    }
                                }}
                            >
                                <Tooltip title="Edit Account">
                                    <IconEdit />
                                </Tooltip>
                            </button>
                            <button
                                className="btnNoBg"
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    this.copyAddress(address)
                                }}
                            >
                                <Tooltip title="Copy address">
                                    <IconCopy />
                                </Tooltip>
                            </button>
                            {deleteButton}
                        </div>
                    </div>
                </div>
            );
        });
        return (
            <div className={classnames([style.accounts])}>
                <div className={style.title}>Select an Account</div>
                {renderedAccounts}
                <div className={style.newAccount} onClick={this.props.onNewAccountClicked}>
                    <button className="btnNoBg">
                        + New Account
                    </button>
                </div>
            </div>
        );
    }
}

AccountsList.propTypes = {
    environment: PropTypes.string, 
    functions: PropTypes.object.isRequired,
    onAccountChosen: PropTypes.func.isRequired,
    onAccountEdit: PropTypes.func.isRequired,
    onAccountDelete: PropTypes.func.isRequired,
    onNewAccountClicked: PropTypes.func.isRequired,
};
