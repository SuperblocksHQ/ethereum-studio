import { h, Component } from 'preact';
import classnames from 'classnames';
import style from "./style";
import {
    IconDeployGreen,
    IconDropdown,
    IconLock,
    IconLockOpen,
    IconTrash,
    IconEdit
} from '../icons';

// Note: We display networks, which really are environments, which map to networks.
// This is due to a simplification where we do not show environments, only networks, but technically it's environments which we work with.
//
class NetworkSelector extends Component {
    constructor(props) {
        super(props);
        var network,dappfile,defaultEnv="browser";
        const project = this.props.router.control.getActiveProject();
        if(project) {
            dappfile=project.props.state.data.dappfile;
            dappfile.environments().map((env) => {
                if(env.name==project.props.state.data.env) network=project.props.state.data.env;
            });
            defaultEnv=dappfile.environments()[0].name;
        };

        this.setState({
            dappfile: dappfile,
            network: network || defaultEnv,
            showNetworkMenu: false,
            project: project,
        }, ()=> {
            this.pushSettings();
        });
    }

    networkClick=(e)=>{
        e.preventDefault();
        e.stopPropagation();
        if(this.state.showNetworkMenu) {
            this.closeNetworkMenu();
        }
        else {
            // Only show if there's an open project.
            if(!this.state.project) return;
            this.setState({ showNetworkMenu: true }, () => {
                document.addEventListener('click', this.closeNetworkMenu);
            });
        }
    };

    networkChosen=(network)=>{
        this.setState({
            network: network,
        });
        this.pushSettings();
        this.props.router.main.redraw(true);
    };

    pushSettings=()=>{
        if(this.state.project) this.state.project.props.state.data.env=this.state.network;
    };

    closeNetworkMenu=(e)=>{
        this.setState({ showNetworkMenu: false }, () => {
            document.removeEventListener('click', this.closeNetworkMenu);
        });
    };

    networkDropdown=(e)=>{
        if(!this.state.showNetworkMenu) return;
        const networks = this.state.dappfile.environments().map((env) => {
            const cls={};
            cls[style.networkLink]=true;
            cls[style.capitalize]=true;
            if(env.name==this.state.network) cls[style.networkLinkChosen]=true;
            return (<a href="#" onClick={(e)=>{e.preventDefault();this.networkChosen(env.name)}} className={classnames(cls)}>{env.name}</a>);
        });
        return (
            <div class={style.networks}>
                <div class={style.title}>
                    Select a Network
                </div>
                {networks}
            </div>
        );
    };

    render() {
        const droppedDown=this.networkDropdown();
        const endpoint=(this.props.functions.networks.endpoints[this.state.network] || {}).endpoint;
        return (
            <div>
                <a class={classnames([style.selector])} href="#" onClick={this.networkClick}>
                    <div class={style.capitalize} title={endpoint}>
                        {this.state.network}
                    </div>
                    <div class={ style.dropdownIcon }>
                        <IconDropdown />
                    </div>
                </a>
                {droppedDown}
            </div>
        )
    }
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
            showAccountMenu: false,
            project: project,
            balances: {},
        }, ()=> {
            this.pushSettings();
        });
    }

    componentDidMount() {
        this.timer=setInterval(this.updateBalances, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    accountClick=(e)=>{
        e.preventDefault();
        e.stopPropagation();
        if(this.state.showAccountMenu) {
            this.closeAccountMenu();
        }
        else {
            // Only show if there's an open project.
            if(!this.state.project) return;
            this.setState({ showAccountMenu: true }, () => {
                document.addEventListener('click', this.closeAccountMenu);
            });
        }
    };

    accountChosen=(account)=>{
        this.setState({
            account: account,
        });
        this.pushSettings();
        this.props.router.main.redraw(true);
    };

    accountEdit=(e, index)=>{
        // Pass on to control.js
        e.preventDefault();
        if(this.state.project) this.props.router.control._clickEditAccount (e, this.state.project, index);
    };

    accountDelete=(e, index)=>{
        // Pass on to control.js
        e.preventDefault();
        if(this.state.project) this.props.router.control._clickDeleteAccount (e, this.state.project, index);
    };

    accountNew=(e)=>{
        // Pass on to control.js
        e.preventDefault();
        if(this.state.project) this.props.router.control._clickNewAccount(e, this.state.project);
    };

    pushSettings=()=>{
        if(this.state.project) this.state.project.props.state.data.account=this.state.account;
    };

    closeAccountMenu=(e)=>{
        this.setState({ showAccountMenu: false }, () => {
            document.removeEventListener('click', this.closeAccountMenu);
        });
    };

    accountDropdown = (e) => {
        if (!this.state.showAccountMenu) return;
        const accounts = this.state.dappfile.accounts().map((account, index) => {
            const cls={};
            cls[style.accountLink]=true;
            if (account.name==this.state.account) cls[style.accountLinkChosen]=true;
            return (
                <div>
                    <div className={classnames(cls)} onClick={(e)=>{e.preventDefault(); this.accountChosen(account.name)}}>
                        <div>{account.name}</div>
                        <div style="margin-left: auto;">
                            <button class="btnNoBg" onClick={(e)=>{e.preventDefault(); this.accountEdit(e, index)}}>
                                <IconEdit />
                            </button>
                            <button class="btnNoBg" onClick={(e)=>{e.preventDefault(); this.accountDelete(e, index)}}>
                                <IconTrash />
                            </button>
                        </div>
                    </div>
                </div>
            );
        });
        return (
            <div class={classnames([style.accounts], {[style.show]: this.state.showAccountMenu })}>
                <div class={style.title}>
                    Select an Account
                </div>
                {accounts}
                <div class={style.newAccount}>
                    <button class="btnNoBg" onClick={this.accountNew}>+ New Account</button>
                </div>
            </div>
        );
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
        const droppedDown=this.accountDropdown();
        const {accountType, isLocked, network, address}=this.accountType();
        const accountBalance=this.accountBalance(network, address);
        var accountIcon;

        // TODO: @Javier plz put icon/imgs here.
        if (accountType=="metamask") {
            if(isLocked) {
                accountIcon=(<img src="" alt="locked metamask account" />);
            }
            else {
                accountIcon=(<img src="" alt="available metamask account" />);
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
            <div>
                <a class={classnames([style.selector, style.account])} href="#" onClick={this.accountClick} >
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
                </a>
                {droppedDown}
            </div>
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
