import { h, Component } from 'preact';
import { IconDeployGreen, IconDropdown } from '../icons';
import classnames from 'classnames';
import style from "./style";

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
                {networks}
            </div>
        );
    };

    render() {
        const droppedDown=this.networkDropdown();
        return (
            <div class={ style.selector }>
                <a class={style.capitalize} href="#" onClick={this.networkClick}>
                    {this.state.network}
                    <div class={ style.dropdownIcon }>
                        <IconDropdown height="8" width="10"/>
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
        }, ()=> {
            this.pushSettings();
        });
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

    accountDropdown=(e)=>{
        if(!this.state.showAccountMenu) return;
        const accounts = this.state.dappfile.accounts().map((account, index) => {
            const cls={};
            cls[style.accountLink]=true;
            if(account.name==this.state.account) cls[style.accountLinkChosen]=true;
            return (
                <div>
                    <a href="#" onClick={(e)=>{e.preventDefault();this.accountChosen(account.name)}} className={classnames(cls)}>{account.name}</a>
                    <a href="#" onClick={(e)=>{e.preventDefault();this.accountEdit(e, index)}} className={classnames(cls)}>(edit)</a>
                    <a href="#" onClick={(e)=>{e.preventDefault();this.accountDelete(e, index)}} className={classnames(cls)}>(delete)</a>
                </div>
            );
        });
        return (
            <div class={style.accounts}>
                {accounts}
                <a href="#" style="color:#333;" onClick={this.accountNew}>(+ new account)</a>
            </div>
        );
    };

    render() {
        const droppedDown=this.accountDropdown();
        return (
            <div class={ style.selector }>
                <a href="#" onClick={this.accountClick}>
                    {this.state.account}
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
