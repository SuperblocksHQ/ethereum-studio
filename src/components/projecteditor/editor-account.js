// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Studio.
//
// Superblocks Studio is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Studio is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Studio.  If not, see <http://www.gnu.org/licenses/>.

import { h, Component } from 'preact';
import classnames from 'classnames';
import style from './style-editor-account';
import FaIcon  from '@fortawesome/react-fontawesome';
import iconSave from '@fortawesome/fontawesome-free-regular/faSave';
import iconCompile from '@fortawesome/fontawesome-free-solid/faPuzzlePiece';
import iconDeploy from '@fortawesome/fontawesome-free-regular/faPlayCircle';
import iconTest from '@fortawesome/fontawesome-free-solid/faFlask';
import iconDebug from '@fortawesome/fontawesome-free-solid/faBug';

export default class AccountEditor extends Component {
    constructor(props) {
        super(props);
        this.id=props.id+"_editor";;
        this.props.parent.childComponent=this;
        this.dappfile = this.props.project.props.state.data.dappfile;
        this.account = this.dappfile.getItem("accounts", [{name: props.account}]);
        this.form={env:""};
    }

    componentDidMount() {
        this.redraw();
    }

    redraw = () => {
        this.setState();
    };

    save = (e) => {
        e.preventDefault();
        // TODO verify object validity?
        if(!this.account.obj.name.match(/^([a-zA-Z0-9-_]+)$/)) {
            alert('Illegal account name. Only A-Za-z0-9, dash (-) and underscore (_) allowed.');
            return;
        }
        if(!this.dappfile.setItem("accounts", [{name: this.props.account}], this.account)) {
            alert('Dappfile.yaml updated. You need to reload projects before saving.');
            return;
        }
        this.props.project.save((status)=>{
            if(status==0) {
                this.props.parent.close();
            }
        });
    };

    onChange = (e, key) => {
        var value=e.target.value;
        //if(key=="name") 
        if(value=="(default)") value=undefined;
        this.account.set(key, value, (key!="name"?this.form.env:null));
        this.setState();
    };

    renderToolbar = () => {
        return (
            <div class={style.toolbar} id={this.id+"_header"}>
                <div>
                </div>
            </div>
        );
    };
/*                    <a href="#" title="Save" onClick={this.save}><FaIcon icon={iconSave}/></a>*/
                    //<a href="#" title="Compile" onClick={this.compile}><FaIcon icon={iconCompile}/></a>
                    //<a href="#" title="Deploy"><FaIcon icon={iconDeploy}/></a>
                    //<a href="#" title="Test"><FaIcon icon={iconTest}/></a>
                    /*<a href="#" title="Debug in Remix"><FaIcon icon={iconDebug}/></a>*/

    getHeight = () => {
        const a=document.getElementById(this.id);
        const b=document.getElementById(this.id+"_header");
        if(!a) return 99;
        return (a.offsetHeight - b.offsetHeight);
    };

    onEnvChange = (e) => {
        e.preventDefault();
        this.form.env=e.target.value;
        this.setState();
    };

    getWallets = () => {
        const ret=[];
        if(this.form.env) ret.push({name:"(default)"});
        this.dappfile.wallets().map((wallet) => {
            ret.push(wallet)
        })
        return ret;
    };

    unlockWallet = (name) => {
        this.props.functions.wallet.openWallet(name, null, (status)=>{
            if(status===0) this.setState();
        });
    };

    showPrivKey = (name, index) => {
        this.props.functions.wallet.getKey(name, index, (status, key)=>{
            if(status===0) {
                alert(key);
            }
            else {
                console.log("Could not get private key", status);
            }
        });
    };

    getAddress = () => {
        const walletName=this.account.get('wallet', this.form.env);
        const index=this.account.get('index', this.form.env);
        if(this.props.functions.wallet.isOpen(walletName)) {
            const address=this.props.functions.wallet.getAddress(walletName, index);
            if(address) {
                return (
                    <div>
                        <div>{address}</div>
                        <a href="#" onClick={(e)=>{e.preventDefault();this.showPrivKey(walletName, index);}}>Show private key</a>.
                    </div>
                );
            }
            else {
                return (
                    <div>
                        Could not extract address, index too high?
                    </div>
                );
            }
        }
        else {
            return (
                <div>
                    Address not visible since wallet {walletName} is locked.<br/>
                    <a href="#" onClick={(e)=>{e.preventDefault();this.unlockWallet(walletName);}}>Unlock wallet</a> to show address.
                </div>
            );
        }
    };

    render() {
        if(!this.account) {
            return (<div>Could not find account {this.props.account} in Dappfile.yaml</div>);
        }
        const account_info = this.getAddress();
        const indexes=( () => {var ret=[];if(this.form.env) ret.push("(default)");for(var i=0;i<30;i++) ret.push(i);return ret;})();
        const toolbar=this.renderToolbar();
        const wallets=this.getWallets();
        const maxHeight = {
            height: this.getHeight() + "px"
        };
        return (<div id={this.id} class={style.main}>
            {toolbar}
            <div class="scrollable-y" style={maxHeight} id={this.id+"_scrollable"}>
                <h1 class={style.title}>
                    Edit Account {this.props.account}
                </h1>
                <div class={style.form}>
                    <form action="">
                        <div class={style.field}>
                            <p>
                                Environment:
                            </p>
                            <select key="envs" onChange={this.onEnvChange} value={this.form.env}>
                                <option value="">(default)</option>
                                {this.dappfile.environments().map((env) => {
                                    return (<option
                                        value={env.name}>{env.name}</option>);
                                })}
                            </select>
                        </div>
                        <div class={style.field}>
                            <p>Name:</p>
                            <input type="text" onKeyUp={(e)=>{this.onChange(e, 'name')}} value={this.account.get("name")} onChange={(e)=>{this.onChange(e, 'name')}} />
                        </div>
                        <div class={style.field}>
                            <p>
                                Wallet:
                            </p>
                            <select key="wallets" value={(this.account.get('wallet', this.form.env, false) || "(default)")}
                                    onChange={(e)=>{this.onChange(e, 'wallet')}}>
                                {wallets.map((wallet)=>{
                                    return (<option
                                        value={wallet.name}>{wallet.name}</option>);})}
                            </select>
                        </div>
                        <div class={style.field}>
                            <p>
                                Address:
                            </p>
                            <select key="indexes" onChange={(e)=>{this.onChange(e, 'index')}} value={(this.account.get('index', this.form.env, false) || "(default)")}>
                                {indexes.map((index) => {
                                    return (<option
                                        value={index}>{index}</option>);
                                })}
                            </select>
                        </div>
                        <div>
                            {account_info}
                        </div>
                        <div>
                            <a href="#" class="btn2" onClick={this.save}>Save</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>);
    }
}
