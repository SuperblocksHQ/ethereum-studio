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

import { h, Component } from 'preact';
import classnames from 'classnames';
import Web3 from 'web3';
import style from './style-editor-account';

export default class AccountEditor extends Component {
    constructor(props) {
        super(props);
        this.id=props.id+"_editor";;
        this.props.parent.childComponent=this;
        this.dappfile = this.props.project.props.state.data.dappfile;
        this.account = this.dappfile.getItem("accounts", [{name: props.account}]);
        this.accountName=this.props.account;
        this.setEnv("browser");
    }

    componentWillReceiveProps(props) {
        this.dappfile = props.project.props.state.data.dappfile;
    }

    componentDidMount() {
        this.redraw();
    }

    redraw = () => {
        this.setState();
    };

    setEnv=(env)=>{
        // Set all initial values of the account.
        var isLocked=false;
        var walletType=null;
        var address;
        var wallet=null;
        const walletName=this.account.get('wallet', env);
        const accountIndex=this.account.get('index', env);
        if(walletName) {
            wallet = this.dappfile.getItem("wallets", [{name: walletName}]);
        }
        if(wallet) {
            walletType=wallet.get('type');
            if(walletType=="external") {
                if(!window.web3) {
                    if(this.props.functions.wallet.isOpen(walletName)) {
                        address=this.props.functions.wallet.getAddress(walletName, accountIndex);
                    }
                    else {
                        isLocked=true;
                    }

                }
                else {
                    const extAccounts = window.web3.eth.accounts || [];
                    isLocked = extAccounts.length<1;
                    address=extAccounts[0];
                }
            }
            else {
                // Local wallet
                if(this.props.functions.wallet.isOpen(walletName)) {
                    address=this.props.functions.wallet.getAddress(walletName, accountIndex);
                }
                else {
                    isLocked=true;
                }
            }
        }
        else {
            address=this.account.get('address', env);
        }

        const network=env;
        // Initial (editable) values
        this.form={
            env: env,
            name: this.accountName,
            walletName: walletName,
            wallet: wallet,
            walletType: walletType,
            address: address,
            balance: 0,
            balanceFormatted: "0",
            balanceError: "",
            isLocked: isLocked,
            web3: this._getWeb3((this.props.functions.networks.endpoints[network] || {}).endpoint),
        };
        this._fetchBalance(address);
        this.redraw();
    };

    _getWeb3=(endpoint)=>{
        var provider;
        if(endpoint.toLowerCase()=="http://superblocks-browser") {
            provider=this.props.functions.EVM.getProvider();
        }
        else {
            provider=new Web3.providers.HttpProvider(endpoint);
        }
        var web3=new Web3(provider);
        return web3;
    };

    _fetchBalance=(address)=>{
        // Get balance and update this.form.balance
        if(!address || address.length<5) {
            // a 0x00 address...
            return;
        }
        const form=this.form;  // Grab the reference so we avoid race conditions updating the same object when changing environments.

        this.form.web3.eth.getBalance(address,(err,res)=>{
            if(err) {
                this.form.balance=0;
                this.form.balanceError="<could not get balance>";
            }
            else {
                this.form.balance=res.toNumber();
                this.form.balanceOriginal=this.form.balance;
                this.form.balanceFormatted=this.form.web3.fromWei(this.form.balance);
                this.form.balanceError="";
            }
            this.redraw();
        });
    };

    _save = (cb) => {
        if(this.account.obj.name != this.accountName) {
            // Name is changing, check for clash.
            if(this.dappfile.getItem("accounts", [{name: this.account.obj.name}])) {
                alert('Error: An account with that name already exists.');
                cb(1);
                return;
            }
        }

        if(!this.dappfile.setItem("accounts", [{name: this.accountName}], this.account)) {
            alert('Cannot save, project updated. You need to reload Superblocks Lab.');
            cb(1);
            return;
        }

        this.props.project.save(cb);
    };

    onEnvChange = (e, value) => {
        e.preventDefault();
        this.setEnv(value);
    };

    unlockWallet = (name) => {
        this.props.functions.wallet.openWallet(name, null, (status)=>{
            if(status===0) {
                // Reload data (for the same env)
                this.setEnv(this.form.env);
            }
            else if(status===1) {
                // Cancelled
                return;
            }
            else {
                alert("Computer says no. The seed entered is not a valid 12 word seed.");
            }
        });
    };

    onNameChange=(e)=>{
        var value=e.target.value;
        this.form.name=value;
        this.setState({accountNameDirty:true});
    };

    _nameSave=(e)=> {
        e.preventDefault();

        if(!this.form.name.match(/^([a-zA-Z0-9-_]+)$/)) {
            alert('Illegal account name. Only A-Za-z0-9, dash (-) and underscore (_) allowed.');
            return;
        }

        this.account.set("name", this.form.name);

        if(this._save((status)=>{
            if(status==0) {
                this.accountName=this.form.name;
                this.setState({accountNameDirty:false});
                // Close tab, because the item has changed, this is the easiest way out.
                // To keep the tab open we need to sync the tab item with the updated menu item.
                this.props.parent.close();
            }
            else {
                // Restore state
                this.account.set("name", this.accountName);
            }
        }));
    };

    onAddressChange=(e)=>{
        var value=e.target.value;
        this.form.address=value;
        this.setState({accountAddressDirty:true});
    };

    _staticAddressSave=(e)=>{
        e.preventDefault();

        if(! (this.form.address.match(/^0x([a-fA-F0-9]){40}$/) || this.form.address=="0x0") ) {
            alert('Illegal Ethereum account address. Must be on format: 0xabcdef0123456789, 42 characters in total or 0x0.');
            return;
        }

        const currentAddress=this.account.get("address", this.form.env);
        this.account.set("address", this.form.address, this.form.env);

        if(this._save((status)=>{
            if(status==0) {
                this.accountName=this.form.name;
                this.setState({accountAddressDirty:false});
            }
            else {
                // Restore state
                this.account.set("address", currentAddress, this.form.env);
            }
        }));
    };

    onBalanceChange=(e)=>{
        var value=e.target.value;
        this.form.balance=value;
        this.form.balanceFormatted=this.form.web3.fromWei(this.form.balance);
        this.setState({accountBalanceDirty:true});
    };

    _balanceSave=(e)=>{
        e.preventDefault();

        if(!this.form.balance.match(/^([0-9]+)$/) || !isNaN(parseInt(this.form.balance))) {
            alert('Bad integer format.');
            return;
        }

        // TODO burn/fund account...
    };

    _renderAccountContent = () => {
        if (this.form.wallet == null) {
            // Static address
            return (
                <div>
                    <div class="superInputDarkInline">
                        <label for="address">Address</label>
                        <input type="text"
                                id="address"
                                onKeyUp={(e)=>{this.onAddressChange(e)}}
                                onChange={(e)=>{this.onAddressChange(e)}}
                                value={this.form.address} />

                        <button class="btn2" disabled={!this.state.accountAddressDirty} onClick={this._staticAddressSave}>Save</button>
                    </div>
                    <p>
                        <b>NOTE:</b> This account only has a public address which you need to set yourself.
                        This means that the account cannot be used for any transactions.
                        The reason for this feature is that this account can be passed as argument to contract constructors.
                    </p>
                </div>
            );
        }
        else {
            // Check for external web3 provider
            if (this.form.walletTyp == "external") {
                if (this.form.isLocked) {
                    return (
                        <p>
                            Metamask is locked. Unlock Metamask to see address and balance of this account.
                        </p>
                    );
                }
                else {
                    return (
                        <div>
                            <h3>
                                Metamask account
                            </h3>
                            <p>
                                <b>Address:</b> {this.form.address}
                            </p>
                            <p>
                                <b>Balance:</b> {this.form.balance} wei ({this.form.balanceFormatted} Ether) {this.form.balanceError}
                            </p>
                        </div>
                    );
                }
            }
            else {
                // Regular wallet
                if (this.form.isLocked) {
                    return (
                        <div>
                            <p>
                                This wallet is locked. Unlock the wallet to show the address and the balance.
                            </p>
                            <button class="btn2" onClick={(e)=>{e.preventDefault(); this.unlockWallet(this.form.walletName); }}>
                                Unlock
                            </button>
                        </div>
                    );
                } else {
                    var unlockDifferentAccountButton;
                    if(this.form.walletName === "private" || (this.form.walletName === "external" && !window.web3) ) {
                        unlockDifferentAccountButton = (
                            <button class="btn2" onClick={(e)=>{e.preventDefault(); this.unlockWallet(this.form.walletName); }}>
                                Unlock a different account
                            </button>);
                    }

                    return (
                        <div>
                            <p>
                                <b>Address:</b> {this.form.address}
                            </p>
                            <p>
                                <b>Balance:</b> {this.form.balance} wei ({this.form.balanceFormatted} Ether) {this.form.balanceError}
                            </p>
                            { unlockDifferentAccountButton }
                        </div>
                    );
                }
            }
        }
    };

    render() {
        const accountContent=this._renderAccountContent();
        return (<div id={this.id} class={style.main}>
            <div class="scrollable-y" id={this.id+"_scrollable"}>
                <div class={style.inner}>
                    <h1 class={style.title}>
                        Edit Account
                    </h1>
                    <div class={style.form}>
                        <form action="">
                            <div class={style.field}>
                                <div class="superInputDarkInline">
                                    <label for="name">Name</label>
                                    <input type="text"
                                            id="name"
                                            value={this.form.name}
                                            onKeyUp={(e)=>{this.onNameChange(e)}}
                                            onChange={(e)=>{this.onNameChange(e)}} />
                    
                                    <button class="btn2" disabled={!this.state.accountNameDirty} onClick={this._nameSave}>Save name</button>
                                </div>
                                <div class={style.networkContainer}>
                                    <div class={style.networkHeader}>
                                        <div class={style.titleContainer}>
                                            <h3 class={style.title}>Configure the account for each network</h3>
                                        </div>
                                        <div class={style.subtitle}>
                                            Each account must be configured for each of the networks available.
                                            <a href="#" target="_blank" rel="noopener noreferrer"> Click here</a> to access our Help Center and find more information about this.
                                        </div>
                                    </div>
                                    <div class={style.networkSelector}>
                                        <div class={style.networks}>
                                            <ul>
                                                {
                                                    this.dappfile.environments().map((env) => {
                                                        const cls={};
                                                        if (env.name == this.form.env) {
                                                            cls[style.active] = true;
                                                        }
                                                        return (
                                                            <li className={classnames([cls])}>
                                                                <div class={style.networkName} onClick={(e)=>{this.onEnvChange(e, env.name)}}>{env.name}</div>
                                                            </li>);
                                                })}
                                            </ul>
                                        </div>
                                        <div class={style.networkInfo}>
                                            {accountContent}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>);
    }
}
