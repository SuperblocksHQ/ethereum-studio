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
import style from './style-appview';
import FaIcon  from '@fortawesome/react-fontawesome';
import iconRun from '@fortawesome/fontawesome-free-solid/faBolt';
var Generator = require('../contractinteraction');
import SuperProvider from '../superprovider';
import Web3 from 'web3';

export default class ContractInteraction extends Component {
    constructor(props) {
        super(props);
        this.id=props.id+"_contractinteraction";
        this.props.parent.childComponent=this;
        this.dappfile = this.props.project.props.state.data.dappfile;
        this.provider=new SuperProvider({that:this});
        this.setState({account:0});
        this.contract_address="";
        this.contract_balance="?";
    }

    notifyTx=(hash, endpoint)=>{
        var network;
        Object.keys(this.props.functions.networks.endpoints).map((key)=>{
            const obj=this.props.functions.networks.endpoints[key];
            if(obj.endpoint==endpoint) network=key;
        });
        this.props.project.props.state.txlog.addTx({hash:hash,context:'Contract interaction',network:network});
    };

    redraw = (props) => {
        if((props||{}).all) this.lastContent=null;  // To force a render.
        this.setState();
        this.render2();
    };

    componentWillReceiveProps(props) {
        this.dappfile = props.project.props.state.data.dappfile;
    }

    writeContent = (status, content) => {
        if(!this.iframeDiv) return;
        content=content||this.lastContent||"No content";
        if(status>0) {
            // Add surrounding html
            content=`<html><head><style>body {background-color: #fff; color: #333;text-align:center;}</style></head><body><h1>`+content+`</h1></body></html>`;
        }
        if(content==this.lastContent) return;
        this.lastContent=content;
        while (this.iframeDiv.firstChild) {
            this.iframeDiv.removeChild(this.iframeDiv.firstChild);
        }
        const iframe = document.createElement("iframe");
        iframe.sandbox="allow-scripts allow-modals allow-forms";
        iframe.srcdoc=content;
        this.iframeDiv.appendChild(iframe);
        this.iframe=iframe;
        this.provider.initIframe(iframe);
        this.setState(); // To update data outside of iframe.
    };

    _makeFileName=(path, tag, suffix)=>{
        const a = path.match(/^(.*\/)([^/]+)$/);
        const dir=a[1];
        const filename=a[2];
        return dir + "." + filename + "." + tag + "." + suffix;
    };

    render2 = () => {
        const env=this.props.project.props.state.data.env;
        const contract = this.dappfile.getItem("contracts", [{name: this.props.contract}]);
        const src=contract.get('source');
        const network=contract.get('network', env);
        const endpoint=(this.props.functions.networks.endpoints[network] || {}).endpoint;
        const tag=env;
        const srcabi=this._makeFileName(src, tag, "abi");
        const addresssrc=this._makeFileName(src, tag+"."+network, "address");
        const txsrc=this._makeFileName(src, tag+"."+network, "tx");
        const deploysrc=this._makeFileName(src, tag, "deploy");
        const contracts=[this.props.contract];
        this.props.project.loadFile(addresssrc, (body) => {
            if(body.status!=0) {
                this.writeContent(1, "Missing file(s), contract not deployed?");
                return;
            }
            this.contract_address=body.contents;
            this._verifyContract(txsrc, deploysrc, endpoint, (status)=>{
                if(status!=0) {
                    this.writeContent(1, "Contract does not exist. When running the in-browser blockchain it gets wiped on every refresh.");
                    return;
                }
                this.props.project.loadFile(srcabi, (body) => {
                    if(body.status!=0) {
                        this.writeContent(1, "Missing file(s)");
                        return;
                    }
                    var abi=body.contents;
                    if(typeof(body.contents) != "object") {
                        abi=JSON.parse(body.contents);
                    }
                    this._loadJsFiles(contracts, env, (status, jsbodies)=>{
                        if(status!=0) {
                            this.writeContent(1, "Missing contract javascript file, have you deployed all contracts?");
                            return;
                        }
                        const rendered=Generator.render(abi, this.props.contract);
                        if(this.state.showSource=="on") {
                            var jscontent=rendered.js.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                            var htmlcontent=rendered.html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                            const content="<html><body style='color: #fff;'>HTML:<br/><pre><code>"+htmlcontent+"</code></pre><br/>JS:<br/><pre><code>"+jscontent+"</code></pre></body></html>";
                            this.writeContent(0, content);
                            return;
                        }
                        const content=this.getOuterContent(rendered.html, jsbodies.join("\n")+rendered.js, endpoint, this._getAccountAddress());
                        this.writeContent(0, content);
                    });
                }, true, true);
            });
        }, true, true);
    };

    _getAccount=()=>{
        const items=this.getAccounts().filter((item)=>{
            return this.state.account==item.value;
        });
        if(items.length>0) return items[0].name;
    };

    _getAccountAddress=()=>{
        // Check given account, try to open and get address, else return [].
        const accountName=this._getAccount();
        if(accountName=="(locked)") return [];
        if(!accountName) return [];

        const env=this.props.project.props.state.data.env;
        const account = this.dappfile.getItem("accounts", [{name: accountName}]);
        const accountIndex=account.get('index', env);
        const walletName=account.get('wallet', env);
        const wallet = this.dappfile.getItem("wallets", [{name: walletName}]);
        if(!wallet) {
            return [];
        }
        const walletType=wallet.get('type');

        if(walletType=="external") {
            // Metamask seems to always only provide one (the chosen) account.
            const extAccounts = web3.eth.accounts || [];
            if(extAccounts.length<accountIndex+1) {
                // Account not matched
                return [];
            }
            return [extAccounts[accountIndex]];
        }

        if(this.props.functions.wallet.isOpen(walletName)) {
            const address=this.props.functions.wallet.getAddress(walletName, accountIndex);
            return [address];
        }

        return [];
    };

    _getWeb3=(endpoint)=>{
        var provider;
        if(endpoint.toLowerCase()=="http://superblocks-browser") {
            provider=this.props.functions.EVM.getProvider();
        }
        else {
            var provider=new Web3.providers.HttpProvider(endpoint);
        }
        var web3=new Web3(provider);
        return web3;
    };

    _getInputByTx = (tx, endpoint, cb)=>{
        const web3=this._getWeb3(endpoint);
        web3.eth.getTransaction(tx, (err, res)=>{
            if(err) {
                cb(1);
                return;
            }
            if(res) {
                cb(0, res.input);
                return;
            }
            cb(1);
            return;
        });
    };

    _verifyContract=(txsrc, deploysrc, endpoint, cb)=>{
        this._loadFiles([txsrc,deploysrc], (status, bodies)=>{
            if(status>0) {
                cb(status);
                return;
            }
            const tx=bodies[0];
            const code=bodies[1];
            if(this._codecache==null) this._codecache={};
            if(this._codecache[endpoint]==null) this._codecache[endpoint]={};
            if(this._codecache[endpoint][tx]==code) {
                cb(0);
                return;
            }
            this._getInputByTx(tx, endpoint, (status, input)=>{
                if(status>0) {
                    cb(1);
                    return;
                }
                if(input==code) {
                    this._codecache[endpoint][tx]=code;
                    cb(0);
                    return;
                }
                cb(1);
                return;
            });
        });
    };

    _loadFiles=(files, cb)=>{
        const bodies=[];
        var fn;
        fn=((files, bodies, cb2)=>{
            if(files.length==0) {
                cb2(0);
                return;
            }
            const file=files.shift();
            this.props.project.loadFile(file, (body) => {
                if(body.status!=0) {
                    cb(1);
                    return;
                }
                bodies.push(body.contents);
                fn(files, bodies, (status)=>{
                    cb2(status);
                });
            }, true, true);
        });
        fn(files, bodies, (status)=>{
            cb(status, bodies);
        });
    };

    _loadJsFiles=(contracts, env, cb)=>{
        const files=[];
        const bodies=[];
        for(var index=0;index<contracts.length;index++) {
            files.push("/app/contracts/."+contracts[index]+"."+env+".js");
        }
        var fn;
        fn=((files, bodies, cb2)=>{
            if(files.length==0) {
                cb2(0);
                return;
            }
            const file=files.shift();
            this.props.project.loadFile(file, (body) => {
                bodies.push(body.contents);
                fn(files, bodies, (status)=>{
                    cb2(status);
                });
            }, true, true);
        });
        fn(files, bodies, (status)=>{
            cb(status, bodies);
        });
    };

    _getProvider=(endpoint, accounts)=>{
        var ts=this.props.functions.session.start_time();
        const js=`<script type="text/javascript" src="/static/js/web3provider.js?ts=`+ts+`">
    </script>
    <script type="text/javascript">
        window.web3={currentProvider:new DevKitProvider.provider("`+endpoint+`"),eth:{accounts:`+JSON.stringify(accounts)+`}};
        console.log("Using Superblocks web3 provider.");
    </script>
`;
        return js;
    };

    getOuterContent = (html, js, endpoint, accounts) => {
        const html2=`<!DOCTYPE html>
<html lang="en">
    <head>
        <script type="text/javascript" src="https://unpkg.com/web3@0.20.5/dist/web3.min.js"></script>
        `+(endpoint!=null?this._getProvider(endpoint, accounts):"")+`
    </head>
    <style>
            body {
                background-color: #333;
                color: #eee;
            }
            div {
                display: block;
            }

            form {
                padding: 10px;
            }
            input[disabled="true"] {
                background-color: #4f7595;
            }
            input[type="submit"] {
                background-color: orange;
            }
            .constant input[type="submit"] {
                background-color: green;
            }
            .payable input[type="submit"] {
                background-color: red;
            }
    </style>
    <script type="text/javascript">
        `+js+`
    </script>
    <body>
        `+html+`
    </body>
</html>
`;
        return html2;
    };

    run = (e) => {
        e.preventDefault();
        e.stopPropagation();  // Don't auto focus on the window.
        this.lastContent=null;  // To force a render.
        this.render2();
    };

    _selectAccount=(e)=>{
        e.preventDefault();
        this.setState({account:e.target.value});
        this.redraw();
    };

    getAccounts = (useDefault) => {
        var index=0;
        const ret=[{name:"(locked)",value:index++}];
        this.dappfile.accounts().map((account) => {
            ret.push({name:account.name,value:index++});
        })
        return ret;
    };

    renderToolbar = () => {
        const accounts=this.getAccounts();
        const contract = this.dappfile.getItem("contracts", [{name: this.props.contract}]);
        const env=this.props.project.props.state.data.env;
        const network=contract.get("network", env);
        const endpoint=(this.props.functions.networks.endpoints[network] || {}).endpoint;
        return (
            <div class={style.toolbar} id={this.id+"_header"}>
                <div class={style.buttons}>
                    <a href="#" title="Recompile" onClick={this.run}><FaIcon icon={iconRun}/></a>
                    <span><input checked={this.state.showSource=="on"} onChange={(e)=>{this.setState({showSource:(e.target.checked?"on":"off")});this.redraw();}} type="checkbox" />&nbsp;Show source</span>
                </div>
                <div class={style.accounts}>
                    Account: <select onChange={this._selectAccount} value={this.state.account}>
                        {accounts.map((account) => {
                            return (<option
                                value={account.value}>{account.name}</option>);
                        })}
                    </select>
                    &nbsp;<a href="#" title="Click to get account balance" onClick={this._getUserBalance}>{this.accountinfo}</a>&nbsp;Balance: {this.account_balance}
                </div>
                <div class={style.info}>
                    <span>
                        Endpoint: {endpoint} Contract: <a href="#" title="Click to get contract balance" onClick={this._getBalance}>{this.contract_address}</a> Balance: {this.contract_balance} wei
                    </span>
                </div>
            </div>
        );
    };

    _getUserBalance=(e)=>{
        e.preventDefault();
        const env=this.props.project.props.state.data.env;
        const contract = this.dappfile.getItem("contracts", [{name: this.props.contract}]);
        const network=contract.get('network', env);
        const endpoint=(this.props.functions.networks.endpoints[network] || {}).endpoint;
        const web3=this._getWeb3(endpoint);
        if(this.account_address.length<5) {
            this.account_balance="?";
            this.setState();
            return;
        }
        web3.eth.getBalance(this.account_address,(err,res)=>{
            if(err) {
                alert("Could not get balance of user.");
            }
            else {
                this.account_balance=res.toNumber();
                this.setState();
            }
        });
    };

    _getBalance=(e)=>{
        e.preventDefault();
        const env=this.props.project.props.state.data.env;
        const contract = this.dappfile.getItem("contracts", [{name: this.props.contract}]);
        const network=contract.get('network', env);
        const endpoint=(this.props.functions.networks.endpoints[network] || {}).endpoint;
        const web3=this._getWeb3(endpoint);
        if(this.contract_address.length<5) {
            this.contract_balance="?";
            this.setState();
            return;
        }
        web3.eth.getBalance(this.contract_address,(err,res)=>{
            if(err) {
                alert("Could not get balance of contract.");
            }
            else {
                this.contract_balance=res.toNumber();
                this.setState();
            }
        });
    };

    getHeight = () => {
        const a=document.getElementById(this.id);
        const b=document.getElementById(this.id+"_header");
        if(!a) return 99;
        return (a.offsetHeight - b.offsetHeight);
    };

    componentDidMount() {
        this.provider._attachListener();
        // We need to do a first redraw to get the height right, since toolbar didn't exist in the first sweep.
        this.redraw();
    }

    componentWillUnmount() {
        this.provider._detachListener();
    }


    _firstRender=(ref)=>{
        this.iframeDiv=ref;
        this.render2();
    };

    render() {
        const addresses=this._getAccountAddress();
        if(addresses.length==0) {
            this.accountinfo="Account not accessible";
            this.account_address="0x0";
            this.account_balance="?";
        }
        else {
            this.accountinfo=addresses[0];
            this.account_address=addresses[0];
        }
        const toolbar=this.renderToolbar();
        const maxHeight = {
            height: this.getHeight() + "px"
        };
        return (<div id={this.id} key={this.id} class={style.appview}>
            {toolbar}
            <div class="full" style={maxHeight} id={this.id+"_iframe"} key={this.id+"_iframe"} ref={this._firstRender}>
            </div>
        </div>);
    }
}
