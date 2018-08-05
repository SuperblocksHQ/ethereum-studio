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
        const project = this.props.router.control._getActiveProject();
        if(project) {
            dappfile=project.props.state.data.dappfile;
            dappfile.environments().map((env) => {
                if(env.name==this.props.item.props.state.env) network=this.props.item.props.state.env;
            });
            defaultEnv=dappfile.environments()[0].name;
        };

        this.setState({
            dappfile: dappfile,
            network: network || defaultEnv,
            showNetworkMenu: false,
            project: project,
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
        this.props.item.props.state.env=network;
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
                <a href="#" onClick={this.networkClick}>
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
        console.log(props);
        var account,dappfile, defaultAccount="Default";
        const project = this.props.router.control._getActiveProject();
        if(project) {
            dappfile=project.props.state.data.dappfile;
            dappfile.accounts().map((accountItem) => {
                if(accountItem.name==this.props.item.props.state.account) account=this.props.item.props.state.account;
            });
            defaultAccount=dappfile.accounts()[0].name;
        };

        console.log("account", account);

        this.setState({
            dappfile: dappfile,
            account: account || defaultAccount,
            showAccountMenu: false,
            project: project,
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
        this.props.item.props.state.account=account;
    };

    closeAccountMenu=(e)=>{
        this.setState({ showAccountMenu: false }, () => {
            document.removeEventListener('click', this.closeAccountMenu);
        });
    };

    accountDropdown=(e)=>{
        if(!this.state.showAccountMenu) return;
        const account = this.state.dappfile.accounts().map((account) => {
            const cls={};
            cls[style.accountLink]=true;
            if(account.name==this.state.account) cls[style.accountLinkChosen]=true;
            return (<a href="#" onClick={(e)=>{e.preventDefault();this.accountChosen(account.name)}} className={classnames(cls)}>{account.name}</a>);
        });
        return (
            <div class={style.accounts}>
                {account}
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
        )
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
