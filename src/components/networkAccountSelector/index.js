import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DropdownContainer } from '../dropdown';
import Tooltip from '../tooltip';
import style from './style.less';
import {
    IconDeployGreen,
    IconDropdown,
    IconLock,
    IconLockOpen,
    IconTrash,
    IconEdit,
    IconMetamask,
    IconMetamaskLocked,
    IconPublicAddress,
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

// Note: We display networks, which really are environments, which map to networks.
// This is due to a simplification where we do not show environments, only networks, but technically it's environments which we work with.
//
class NetworkSelector extends Component {
    constructor(props) {
        super(props);
    }

    onNetworkSelectedHandle = network => {
        const project = this.props.router.control.getActiveProject();
        if (project) {
            project.getHiddenItem('environments').setChosen(network);
            this.props.router.main.redraw(true);
        }
    };

    getNetwork = () => {
        var network = 'browser';
        var endpoint = '';
        const project = this.props.router.control.getActiveProject();
        if (project) {
            network = project.getHiddenItem('environments').getChosen() || network;
            endpoint = project.getEndpoint(network);
        }
        return {network, endpoint};
    };

    render() {
        var {network, endpoint} = this.getNetwork();
        return (
            <DropdownContainer
                dropdownContent={
                    <NetworkDropdown
                        router={this.props.router}
                        networkSelected={network}
                        onNetworkSelected={this.onNetworkSelectedHandle}
                    />
                }
            >
                <div className={classnames([style.selector])}>
                    <div className={style.capitalize} title={endpoint}>
                        {network}
                    </div>
                    <div className={style.dropdownIcon}>
                        <IconDropdown />
                    </div>
                </div>
            </DropdownContainer>
        );
    }
}

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

class AccountSelector extends Component {
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
        if (!project) return;
        const accountsItem = project.getHiddenItem('accounts');
        accountsItem.setChosen(account);
        this.props.router.main.redraw(true);
    };

    accountEdit = (e, index) => {
        e.preventDefault();
        e.stopPropagation();

        const project = this.props.router.control.getActiveProject();
        if (!project) return;

        const accountsItem = project.getHiddenItem('accounts');

        const item = accountsItem.getChildren()[index];

        this.props.router.panes.openItem(item);
    };

    accountDelete = (e, index) => {
        e.preventDefault();
        e.stopPropagation();

        const project = this.props.router.control.getActiveProject();
        if (!project) return;

        if (index == 0) {
            alert('You cannot delete the default account.');
            return;
        }

        if (!confirm('Are you sure to delete account?')) return;

        const accountsItem = project.getHiddenItem('accounts');

        const account = accountsItem.getChildren()[index];
        const isCurrent = account.getName() == project.getAccount();

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
        if (!project) return;
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
        if (!project || !accountName) return {};
        const chosenEnv = project.getEnvironment();
        const network = chosenEnv;
        var isLocked = false;
        var walletType = null;
        var address = '';
        var accountType;

        const accountsItem = project.getHiddenItem('accounts');
        const accountItem = accountsItem.getByName(accountName);

        const walletName = accountItem.getWallet(chosenEnv);
        const accountIndex = accountItem.getAccountIndex(chosenEnv);

        var walletItem;
        if (walletName) {
            const walletsItem = project.getHiddenItem('wallets');
            walletItem = walletsItem.getByName(walletName);
        }

        if (walletItem) {
            walletType = walletItem.getWalletType();
            if (walletType == 'external') {
                accountType = 'metamask';
                if (!window.web3) {
                    isLocked = true;
                } else {
                    const extAccounts = window.web3.eth.accounts || [];
                    isLocked = extAccounts.length < 1;
                    address = extAccounts[0];
                }
            } else {
                accountType = 'wallet';
                if (this.props.functions.wallet.isOpen(walletName)) {
                    try {
                        address = this.props.functions.wallet.getAddress(
                            walletName,
                            accountIndex
                        );
                    } catch (ex) {
                        address = '0x0';
                    }
                } else {
                    isLocked = true;
                }
            }
        } else {
            address = accountItem.getAddress(chosenEnv);
            accountType = 'pseudo';
        }

        return { accountType, isLocked, network, address };
    };

    accountBalance = () => {
        // Return cached balance of account
        const { network, address } = this.accountType();
        const balance = ((this.state.balances[network] || {})[address] || '0');
        return balance.substring(0, balance.toString().indexOf(".") + 8) + ' eth';
    };

    getWeb3 = endpoint => {
        var provider;
        if (endpoint.toLowerCase() == 'http://superblocks-browser') {
            provider = this.props.functions.EVM.getProvider();
        } else {
            provider = new Web3.providers.HttpProvider(endpoint);
        }
        var web3 = new Web3(provider);
        return web3;
    };

    updateBalances = () => {
        const project = this.props.router.control.getActiveProject();
        if (!project) return {};

        if (this.updateBalanceBusy) return;
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
                cb('<unknown balance>');
            } else {
                cb(web3.fromWei(res.toNumber()));
            }
        });
    };

    unlockWallet = e => {
        e.preventDefault();

        const project = this.props.router.control.getActiveProject();
        const chosenEnv = project.getEnvironment();
        const accountName = project.getAccount();
        const accountsItem = project.getHiddenItem('accounts');
        const accountItem = accountsItem.getByName(accountName);
        const walletName = accountItem.getWallet(chosenEnv);

        this.props.functions.wallet.openWallet(walletName, null, status => {
            if (status === 0) {
                this.props.router.main.redraw(true);
            }
        });
    };

    render() {
        const project = this.props.router.control.getActiveProject();
        if (!project) return (<div/>);
        const account = project.getAccount();
        const { accountType, isLocked, network, address } = this.accountType();
        if (!network) return (<div/>);
        const accountBalance = this.accountBalance();
        var accountIcon;

        if (accountType == 'metamask') {
            if (isLocked) {
                accountIcon = (
                    <IconMetamaskLocked alt="locked metamask account" />
                );
            } else {
                accountIcon = <IconMetamask alt="available metamask account" />;
            }
        } else if (accountType == 'wallet') {
            if (isLocked) {
                accountIcon = (
                    <IconLock alt="locked wallet account" size="xs" />
                );
            } else {
                accountIcon = (
                    <IconLockOpen alt="open wallet account" size="xs" />
                );
            }
        } else if (accountType == 'pseudo') {
            accountIcon = (
                <IconPublicAddress alt="pseudo account with only a public address" />
            );
        }
        return (
            <DropdownContainer
                dropdownContent={
                    <AccountDropdown
                        router={this.props.router}
                        onAccountChosen={this.accountChosen}
                        onAccountEdit={this.accountEdit}
                        onAccountDelete={this.accountDelete}
                        onNewAccountClicked={this.onNewAccountClickHandle}
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
