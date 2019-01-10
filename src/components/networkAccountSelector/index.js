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
import AccountSelector from './account/accountSelector';
import NetworkSelector from './network/networkSelector';
import PropTypes from 'prop-types';
import {
    IconDeployGreen,
} from '../icons';

class NetworkDropdown extends Component {
    render() {
        var networks;
        const project = this.props.router.control.getActiveProject();
        if (!project) {
            // Setup default stub network just for show. This is due to the fact that atm networks are
            // actually dependent on the project.
            networks = [
                {
                    getName: () => 'browser',
                },
            ];
        } else {
            const environmentsItem = project.getHiddenItem('environments');
            networks = environmentsItem.getChildren();
        }

        const renderedNetworks = networks.map(network => {
            const cls = {};
            cls[style.networkLink] = true;
            cls[style.capitalize] = true;
            if (network.getName() == this.props.networkSelected)
                cls[style.networkLinkChosen] = true;
            return (
                <div
                    key={network.getName()}
                    onClick={e => {
                        e.preventDefault();
                        this.props.onNetworkSelected(network.getName());
                    }}
                    className={classnames(cls)}
                >
                    {network.getName()}
                </div>
            );
        });
        return (
            <div className={style.networks}>
                <div className={style.title}>Select a Network</div>
                {renderedNetworks}
            </div>
        );
    }
}

NetworkDropdown.propTypes = {
    networkSelected: PropTypes.string.isRequired,
    onNetworkSelected: PropTypes.func.isRequired,
};

class AccountDropdown extends Component {
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
            if (account.getName() == chosenAccount)
                cls[style.accountLinkChosen] = true;

            var deleteButton;
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

            return (
                <div key={index}>
                    <div
                        className={classnames(cls)}
                        onClick={e => {
                            e.preventDefault();
                            this.props.onAccountChosen(account.getName());
                        }}
                    >
                        <div>{account.getName()}</div>
                        <div style={{marginLeft: 'auto'}}>
                            <button
                                className="btnNoBg"
                                onClick={e => {
                                    this.props.onAccountEdit(e, index);
                                }}
                            >
                                <Tooltip title="Edit Account">
                                    <IconEdit />
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

AccountDropdown.propTypes = {
    onAccountChosen: PropTypes.func.isRequired,
    onAccountEdit: PropTypes.func.isRequired,
    onAccountDelete: PropTypes.func.isRequired,
    onNewAccountClicked: PropTypes.func.isRequired,
};

export default class NetworkAcccountSelector extends Component {
    render() {
        let { ...props } = this.props;
        return (
            <div className={style.container}>
                <IconDeployGreen />
                <NetworkSelector {...props} />
                <div className={style.separator} />
                <AccountSelector {...props} />
            </div>
        );
    }
}
