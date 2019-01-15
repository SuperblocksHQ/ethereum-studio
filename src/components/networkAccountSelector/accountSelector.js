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
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { DropdownContainer } from '../common/dropdown';
import Networks from '../../networks';
import * as accountUtils from '../../utils/accounts';
import style from './style.less';
import { IconDropdown, IconLock, IconLockOpen, IconMetamask, IconMetamaskLocked, IconPublicAddress } from '../icons';
import { AccountsList } from './accountsList';

export class AccountSelector extends Component {
    state = {
        balances: {}
    }

    componentDidMount() {
        this.timer = setInterval(this.updateBalances, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    accountChosen = account => {
        const project = this.props.router.control.getActiveProject();
        if (!project) { return; }
        const accountsItem = project.getHiddenItem('accounts');
        accountsItem.setChosen(account);
        this.props.router.main.redraw(true);
    };

    accountEdit = (e, index) => {
        e.preventDefault();
        e.stopPropagation();

        const project = this.props.router.control.getActiveProject();
        if (!project) { return; }

        const accountsItem = project.getHiddenItem('accounts');

        const item = accountsItem.getChildren()[index];

        this.props.router.panes.openItem(item);
    };

    accountDelete = (e, index) => {
        e.preventDefault();
        e.stopPropagation();

        const project = this.props.router.control.getActiveProject();
        if (!project) { return; }

        if (index === 0) {
            alert('You cannot delete the default account.');
            return;
        }

        if (!confirm('Are you sure to delete account?')) { return; }

        const accountsItem = project.getHiddenItem('accounts');

        const account = accountsItem.getChildren()[index];
        const isCurrent = account.getName() === project.getAccount();

        if (isCurrent) {
            accountsItem.setChosen(null);
        }

        project.deleteAccount(index, () => {
            this.props.router.panes.closeItem(account, null, true);
            this.props.router.main.redraw(true);
        });
    };

    onNewAccountClickHandle = e => {
        e.preventDefault();
        e.stopPropagation();
        const project = this.props.router.control.getActiveProject();
        if (!project) { return; }
        project.addAccount(() => {
            // TODO: how to open new item?
            this.props.router.main.redraw(true);
        });
    };

    /**
     * By the chosen account, return
     * @return {accountType, isLocked, network, address}:
     *     where:
     *      accounType=wallet|pseudo|metamask
     *      isLocked is true if the wallet or metamask is locked
     *      network is the current network
     *      address is the account public address (for the current network)
     */
    accountType = () => {
        const project = this.props.router.control.getActiveProject();
        const accountName = project.getAccount();
        const accountsItem = project.getHiddenItem('accounts');
        const accountItem = accountsItem.getByName(accountName);
        return accountUtils.getAccountInfo(project, accountItem, this.props.functions.wallet, this.props.selectedEnvironment);
    };

    accountBalance = () => {
        // Return cached balance of account
        const { network, address } = this.accountType();
        const balance = ((this.state.balances[network] || {})[address] || '0');
        return balance.substring(0, balance.toString().indexOf(".") + 8) + ' eth';
    };

    getWeb3 = endpoint => {
        var provider;
        if (endpoint.toLowerCase() === Networks.browser.endpoint) {
            if (this.props.functions.EVM.isReady()){
                provider = this.props.functions.EVM.getProvider();
            } else {
                console.log("EVM is not ready!");
            }
        } else {
            provider = new Web3.providers.HttpProvider(endpoint);
        }
        var web3 = new Web3(provider);
        return web3;
    };

    updateBalances = () => {
        const project = this.props.router.control.getActiveProject();
        if (!project) { return {}; }

        if (this.updateBalanceBusy) { return; }
        this.updateBalanceBusy = true;

        const { network, address } = this.accountType();

        if (!address || address.length < 5) {
            // a 0x00 address...
            this.updateBalanceBusy = false;
            return;
        }
        this.fetchBalance(network, address, res => {
            const a = (this.state.balances[network] =
                this.state.balances[network] || {});
            a[address] = res;
            this.forceUpdate();
            this.updateBalanceBusy = false;
        });
    };

    fetchBalance = (network, address, cb) => {
        const project = this.props.router.control.getActiveProject();
        const endpoint = project.getEndpoint(network);
        const web3 = this.getWeb3(endpoint);
        web3.eth.getBalance(address, (err, res) => {
            if (err) {
                cb(0);
            } else {
                cb(web3.fromWei(res.toNumber()));
            }
        });
    };

    unlockWallet = e => {
        e.preventDefault();

        const project = this.props.router.control.getActiveProject();
        const accountName = project.getAccount();
        const accountsItem = project.getHiddenItem('accounts');
        const accountItem = accountsItem.getByName(accountName);
        const walletName = accountItem.getWallet(this.props.selectedEnvironment);

        this.props.functions.wallet.openWallet(walletName, null, status => {
            if (status === 0) {
                this.props.router.main.redraw(true);
            }
        });
    };

    render() {
        const project = this.props.router.control.getActiveProject();
        if (!project) { return (<div/>); }
        const account = project.getAccount();
        const { accountType, isLocked, network, address } = this.accountType();
        if (!network) { return (<div/>); }
        const accountBalance = this.accountBalance();
        var accountIcon;

        if (accountType === 'metamask') {
            if (isLocked) {
                accountIcon = (
                    <IconMetamaskLocked alt="locked metamask account" />
                );
            } else {
                accountIcon = <IconMetamask alt="available metamask account" />;
            }
        } else if (accountType === 'wallet') {
            if (isLocked) {
                accountIcon = (
                    <IconLock alt="locked wallet account" size="xs" />
                );
            } else {
                accountIcon = (
                    <IconLockOpen alt="open wallet account" size="xs" />
                );
            }
        } else if (accountType === 'pseudo') {
            accountIcon = (
                <IconPublicAddress alt="pseudo account with only a public address" />
            );
        }
        return (
            <DropdownContainer
                dropdownContent={
                    <AccountsList
                        environment={this.props.selectedEnvironment}
                        router={this.props.router}
                        onAccountChosen={this.accountChosen}
                        onAccountEdit={this.accountEdit}
                        onAccountDelete={this.accountDelete}
                        onNewAccountClicked={this.onNewAccountClickHandle}
                        functions={this.props.functions}
                    />
                }
            >
                <div className={classnames([style.selector, style.account])}>
                    {accountIcon}
                    <div className={style.accountContainer}>
                        <div title={address} className={style.nameContainer}>
                            {account}
                        </div>
                        <div className={style.dropdownIcon}>
                            <IconDropdown height="8" width="10" />
                        </div>
                    </div>
                </div>
                <span className={style.accountBalance}>{accountBalance}</span>
            </DropdownContainer>
        );
    }
}

AccountSelector.propTypes = {
    router: PropTypes.object.isRequired,
    functions: PropTypes.object.isRequired
}
