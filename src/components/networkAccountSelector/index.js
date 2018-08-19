import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DropdownContainer } from '../dropdown';
import style from "./style";
import {
    IconDeployGreen,
    IconDropdown,
    IconLock,
    IconLockOpen,
    IconTrash,
    IconEdit,
    IconMetamask,
    IconMetamaskLocked
} from '../icons';

class NetworkDropdown extends Component {

    render() {
        const networks = this.props.dappfile.environments().map((env) => {
            const cls={};
            cls[style.networkLink] = true;
            cls[style.capitalize] = true;
            if (env.name==this.props.networkSelected) cls[style.networkLinkChosen] = true;
            return (
                <div onClick={(e)=>{e.preventDefault(); this.props.onNetworkSelected(env.name)}} className={classnames(cls)}>
                    {env.name}
                </div>);
        });
        return (
            <div class={style.networks}>
                <div class={style.title}>
                    Select a Network
                </div>
                {networks}
            </div>
        );
    }
}

NetworkDropdown.propTypes = {
    dappfile: PropTypes.object.isRequired,
    networkSelected: PropTypes.string.isRequired,
    onNetworkSelected: PropTypes.func.isRequired
}

// Note: We display networks, which really are environments, which map to networks.
// This is due to a simplification where we do not show environments, only networks, but technically it's environments which we work with.
//
class NetworkSelector extends Component {
    constructor(props) {
        super(props);
        var network, dappfile, defaultEnv = "browser";
        const project = this.props.router.control.getActiveProject();
        if(project) {
            dappfile = project.props.state.data.dappfile;
            dappfile.environments().map((env) => {
                if(env.name == project.props.state.data.env) network = project.props.state.data.env;
            });
            defaultEnv = dappfile.environments()[0].name;
        };

        this.setState({
            dappfile: dappfile,
            network: network || defaultEnv,
            project: project,
        });
        this.pushSettings();
    }

    onNetworkSelectedHandle=(network)=>{
        this.setState({
            network: network,
        });
        this.pushSettings();
        this.props.router.main.redraw(true);
    };

    pushSettings=()=>{
        if(this.state.project) this.state.project.props.state.data.env = this.state.network;
    };

    render() {
        const endpoint=(this.props.functions.networks.endpoints[this.state.network] || {}).endpoint;
        return (
            <DropdownContainer
                dropdownContent={
                    <NetworkDropdown
                        dappfile={this.state.dappfile}
                        networkSelected={this.state.network}
                        onNetworkSelected={this.onNetworkSelectedHandle}
                        handleClickOutside={this.closeNetworkMenu}
                    />
                }
            >
                <div class={classnames([style.selector])}>
                    <div class={style.capitalize} title={endpoint}>
                        {this.state.network}
                    </div>
                    <div class={ style.dropdownIcon }>
                        <IconDropdown />
                    </div>
                </div>
            </DropdownContainer>
        )
    }
}

class AccountDropdown extends Component {

    render() {
        const accounts = this.props.dappfile.accounts().map((account, index) => {
            const cls={};
            cls[style.accountLink]=true;
            if (account.name == this.props.account) cls[style.accountLinkChosen]=true;
            return (
                <div>
                    <div className={classnames(cls)} onClick={(e)=>{e.preventDefault(); this.props.onAccountChosen(account.name)}}>
                        <div>{account.name}</div>
                        <div style="margin-left: auto;">
                            <button class="btnNoBg" onClick={(e)=>{this.props.onAccountEdit(e, index)}}>
                                <IconEdit />
                            </button>
                            <button class="btnNoBg" onClick={(e)=>{this.props.onAccountDelete(e, index)}}>
                                <IconTrash />
                            </button>
                        </div>
                    </div>
                </div>
            );
        });
        return (
            <div class={classnames([style.accounts])}>
                <div class={style.title}>
                    Select an Account
                </div>
                {accounts}
                <div class={style.newAccount}>
                    <button class="btnNoBg" onClick={this.props.onNewAccountClicked}>+ New Account</button>
                </div>
            </div>
        );
    }
}

AccountDropdown.propTypes = {
    dappfile: PropTypes.object.isRequired,
    account: PropTypes.string.isRequired,
    handleClickOutside: PropTypes.func.isRequired,
    onAccountChosen: PropTypes.func.isRequired,
    onAccountEdit: PropTypes.func.isRequired,
    onAccountDelete: PropTypes.func.isRequired,
    onNewAccountClicked: PropTypes.func.isRequired,
}

class AccountSelector extends Component {
    constructor(props) {
        super(props);
        var account,dappfile, defaultAccount="Default";
        const project = this.props.router.control.getActiveProject();

        if(project) {
            dappfile=project.props.state.data.dappfile;
            dappfile.accounts().map((accountItem) => {
                if(accountItem.name==project.props.state.data.account) account=project.props.state.data.account;
            });
            defaultAccount=dappfile.accounts()[0].name;
        };

        this.setState({
            dappfile: dappfile,
            account: account || defaultAccount,
            project: project,
            balances: {},
        });
        this.pushSettings();
    }

    componentDidMount() {
        this.timer=setInterval(this.updateBalances, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    accountChosen=(account) => {
        this.setState({
            account: account,
        });
        this.pushSettings();
        this.props.router.main.redraw(true);
    };

    accountEdit=(e, index) => {
        if(this.state.project) this.props.router.control._clickEditAccount (e, this.state.project, index);
    };

    accountDelete = (e, index) => {
        if(this.state.project) this.props.router.control._clickDeleteAccount (e, this.state.project, index);
    };

    onNewAccountClickHandle = (e) => {
        if(this.state.project) this.props.router.control._clickNewAccount(e, this.state.project);
    };

    pushSettings = () => {
        if(this.state.project) this.state.project.props.state.data.account=this.state.account;
    };

    accountType = (e) => {
        if(!this.state.dappfile) return {};
        // Figure out what type of account this is and if it is locked or not.
        const env=this.state.project.props.state.data.env;
        var isLocked=false;
        var walletType=null;
        var address="";
        var wallet=null;
        var accountType;
        const account = this.state.dappfile.getItem("accounts", [{name: this.state.account}]);
        const walletName=account.get('wallet', env);
        const accountIndex=account.get('index', env);
        if(walletName) {
            wallet = this.state.dappfile.getItem("wallets", [{name: walletName}]);
        }
        if(wallet) {
            walletType=wallet.get('type');
            if(walletType=="external") {
                accountType="metamask";
                if(!window.web3) {
                    isLocked=true;
                }
                else {
                    const extAccounts = window.web3.eth.accounts || [];
                    isLocked = extAccounts.length<1;
                    address=extAccounts[0];
                }
            }
            else {
                accountType="wallet";
                if(this.props.functions.wallet.isOpen(walletName)) {
                    try {
                        address=this.props.functions.wallet.getAddress(walletName, accountIndex);
                    }
                    catch(ex) {
                        address="0x0";
                    }
                }
                else {
                    isLocked=true;
                }
            }
        }
        else {
            address=account.get('address', env);
            accountType="pseudo";
        }

        const network=env;
        return {accountType, isLocked, network, address};
    };

    accountBalance = () => {
        // Return cached balance of account
        const {accountType, isLocked, network, address}=this.accountType();
        return ((this.state.balances[network] || {})[address] || "0") + " eth";
    };

    getWeb3 = (endpoint) => {
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

    updateBalances = () => {
        if(this.updateBalanceBusy) return;
        this.updateBalanceBusy=true;
        const {accountType, isLocked, network, address}=this.accountType();
        if(!address || address.length<5) {
            // a 0x00 address...
            this.updateBalanceBusy=false;
            return;
        }
        this.fetchBalance(network, address, (res) => {
            const a = this.state.balances[network] = this.state.balances[network] || {};
            a[address]=res;
            this.setState();
            this.updateBalanceBusy=false;
        });
    };

    fetchBalance = (network, address, cb) => {
        const endpoint=(this.props.functions.networks.endpoints[network] || {}).endpoint;
        const web3 = this.getWeb3(endpoint);
        web3.eth.getBalance(address,(err,res)=>{
            if(err) {
                cb("<unknown balance>");
            }
            else {
                cb(web3.fromWei(res.toNumber()));
            }
        });
    };

    unlockWallet = (e) => {
        e.preventDefault();
        const env=this.state.project.props.state.data.env;
        const account = this.state.dappfile.getItem("accounts", [{name: this.state.account}]);
        const walletName=account.get('wallet', env);
        this.props.functions.wallet.openWallet(walletName, null, (status)=>{
            if(status===0) {
                this.props.router.main.redraw(true);
            }
        });
    };

    render() {
        const {accountType, isLocked, network, address}=this.accountType();
        const accountBalance=this.accountBalance(network, address);
        var accountIcon;

        if (accountType == "metamask") {
            if (isLocked) {
                accountIcon=(<IconMetamaskLocked alt="locked metamask account" />);
            }
            else {
                accountIcon=(<IconMetamask alt="available metamask account" />);
            }
        }
        else if (accountType=="wallet") {
            if (isLocked) {
                accountIcon=(
                    <IconLock alt="locked wallet account" size="xs" />
                );
            }
            else {
                accountIcon=(
                    <IconLockOpen alt="open wallet account" size="xs" />
                )
            }
        }
        else if (accountType=="pseudo") {
            accountIcon=(
                <img src="" alt="pseudo account with only a public address" />
            );
        }

        return (
            <DropdownContainer
                dropdownContent={
                    <AccountDropdown
                            dappfile={this.state.dappfile}
                            account={this.state.account}
                            onAccountChosen={this.accountChosen}
                            onAccountEdit={this.accountEdit}
                            onAccountDelete={this.accountDelete}
                            onNewAccountClicked={this.onNewAccountClickHandle}
                        />
                }
            >
                <div class={classnames([style.selector, style.account])}>
                    {accountIcon}
                    <div title={address} class={style.nameContainer}>
                        {this.state.account}<br />
                        <span style="font-size: 0.5em;">
                            {accountBalance}
                        </span>
                    </div>
                    <div class={ style.dropdownIcon }>
                        <IconDropdown height="8" width="10"/>
                    </div>
                </div>
            </DropdownContainer>
        );
    }
}

export default class NetworkAcccountSelector extends Component {
    render () {
        let { ...props } = this.props;
        return (
        <div class={ style.container }>
                <IconDeployGreen />
                <NetworkSelector {...props} />
                <div class={ style.separator } />
                <AccountSelector {...props} />
            </div>
        );
    }
}
