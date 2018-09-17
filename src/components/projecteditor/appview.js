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
import style from './style-appview';
import { IconRun } from '../icons';
import SuperProvider from '../superprovider';
import Web3 from 'web3';
import Modal from '../modal';

export default class AppView extends Component {
    constructor(props) {
        super(props);
        this.id=props.id+"_appview";;
        this.props.parent.childComponent=this;
        this.dappfile = this.props.project.props.state.data.dappfile;
        this.provider=new SuperProvider({that:this});
        this._getEnv();
    }

    _getEnv=()=>{
        // Update the chosen network and account
        const accountName = this.props.project.props.state.data.account;
        const env=this.props.project.props.state.data.env;
        this.setState({account:accountName, network:env, env:env});
    };

    notifyTx=(hash, endpoint)=>{
        var network;
        Object.keys(this.props.functions.networks.endpoints).map((key)=>{
            const obj=this.props.functions.networks.endpoints[key];
            if(obj.endpoint==endpoint) network=key;
        });
        this.props.project.props.state.txlog.addTx({hash:hash,origin:'DApp',context:'DApp initiated transaction',network:network});
    };

    redraw = (props) => {
         this._getEnv();
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
            content=`<html><head><style type="text/css">body {background-color: #fff; color: #333;text-align:center;}</style></head><body><h1>`+content+`</h1></body></html>`;
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

    render2 = (cb) => {
        var js,css,html,contractjs;
        this.exportableContent = null;
        this.props.project.loadFile("/app/app.html", (body) => {
            if(body.status!=0) {
            this.writeContent(1, "Missing file(s)");
                return;
            }
            html=body.contents;
            this.props.project.loadFile("/app/app.js", (body) => {
                if(body.status!=0) {
                    this.writeContent(1, "Missing file(s)");
                    return;
                }
                js=body.contents;
                this.props.project.loadFile("/app/app.css", (body) => {
                    if(body.status!=0) {
                        this.writeContent(1, "Missing file(s)");
                        return;
                    }
                    css=body.contents;
                    const contracts=[];
                    this.dappfile.contracts().map((item)=>{
                        contracts.push(item.name);
                    });
                    const env=this.state.env;

                    const contracts2=[];
                    const tag=env;
                    var endpoint;
                    for(var index=0;index<contracts.length;index++) {
                        const contract = this.dappfile.getItem("contracts", [{name: contracts[index]}]);
                        const src=contract.get('source');
                        const network=this.state.network;
                        endpoint=(this.props.functions.networks.endpoints[network] || {}).endpoint;
                        const txsrc=this._makeFileName(src, tag+"."+network, "tx");
                        const deploysrc=this._makeFileName(src, tag, "deploy");
                        contracts2.push([txsrc, deploysrc, endpoint]);
                    }

                    const files=[];
                    for(var index=0;index<contracts.length;index++) {
                        files.push("/app/contracts/."+contracts[index]+"."+env+".js");
                    }
                    this._loadFiles(files, (status, bodies)=>{
                        if(status!=0) {
                            this.writeContent(1, "Missing contract javascript file, have you deployed all contracts?");
                            return;
                        }
                        this._checkContracts(contracts2, (status)=>{
                            if(status!=0) {
                                this.writeContent(1, "Contract(s) does not exist. When running the in-browser blockchain contracts get wiped on every refresh.");
                                return;
                            }
                            contractjs=bodies.join("\n");
                            html=this.props.project.constantsReplace(html);
                            css=this.props.project.constantsReplace(css);
                            js=this.props.project.constantsReplace(js);
                            contractjs=this.props.project.constantsReplace(contractjs);
                            var content=this.getInnerContent(html, css, contractjs+"\n"+js, endpoint, this._getAccountAddress());
                            // Save the exportable version.
                            this.exportableContent=this.getInnerContent(html, css, contractjs+"\n"+js);

                            this.writeContent(0, content);
                        });
                    });
                }, true, true);
            }, true, true);
        }, true);
    };

    download = (e) => {
        e.preventDefault();

        if (!this.exportableContent) {
            alert('Error: Cannot download DApp. The DApp contracts are not deployed yet.');
            return;
        }

        if(this.state.network=="browser") {
            const body=(
                <div>
                    <p>Computer says no.</p>
                    <p>
                        When you download your creation, it is configured for the specific network you have chosen (up to the far left).
                        Right now you have chosen the Browser network, which only exists in your browser when using Superblocks Lab, so downloading your DApp
                        makes no sense until you choose any other network than Browser.
                    </p>
                    <div style="margin-top: 54px;">
                        <a class="btn2" onClick={this.props.functions.modal.cancel}>Thanks, but I already knew that</a>
                    </div>
                </div>
            );
            const modalData={
                title: "Cannot export DApp for the Browser network",
                body: body,
                style: {"text-align":"center",height:"263px"},
            };
            const modal=(<Modal data={modalData} />);
            this.props.functions.modal.show({render: () => {return modal;}});
            return;
        }

        const fn = (e) => {
            e.preventDefault();
            this.props.functions.modal.cancel();
            const exportName = "superblocks_dapp_" + this.props.project.props.state.data.dir + ".html";
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(this.exportableContent);
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href",     dataStr);
            downloadAnchorNode.setAttribute("download", exportName);
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        };

        const body=(
            <div>
                <p>You are downloading this DApp preconfigured for the {this.state.network} network.</p>
                <p>The HTML file you are about to download contains everything which the DApp needs, such as HTML, CSS, Javascript, contract data and network configurations.</p>
                <p>After download you can upload the DApp HTML file to any (decentralized) web host of choice.</p>
                <div style="margin-top: 49px;">
                    <a class="btn2" style="margin-right: 30px;" onClick={this.props.functions.modal.cancel}>Cancel</a>
                    <a class="btn2 filled" onClick={fn}>Download</a>
                </div>
            </div>
        );
        const modalData={
            title: "Download DApp for the " + this.state.network + " network",
            body: body,
            style: {"text-align":"center",height:"280px"},
        };
        const modal=(<Modal data={modalData} />);
        this.props.functions.modal.show({render: () => {return modal;}});
    };

    _getAccount=()=>{
        return this.state.disableAccounts=="on" ? "(no provider)" : this.state.account;
    };

    _getAccountAddress=()=>{
        // Check given account, try to open and get address, else return [].
        const accountName=this._getAccount();
        if(accountName=="(no provider)") return null;
        if(accountName=="(locked)") return [];
        if(!accountName) return [];

        const env=this.state.env;
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
            if(!window.web3) return [];
            const extAccounts = window.web3.eth.accounts || [];
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
    _verifyContract=(tx, code, endpoint, cb)=>{
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
    };

    _checkContracts=(contracts, cb)=>{
        const files=[];
        for(var index=0;index<contracts.length;index++) {
            files.push(contracts[index][0]);
            files.push(contracts[index][1]);
        }
        this._loadFiles(files, (status, bodies)=>{
            if(status>0) {
                cb(status);
                return;
            }
            // Switch filesrc for their contents
            for(var index=0;index<contracts.length;index++) {
                contracts[index][0]=bodies[index*2];
                contracts[index][1]=bodies[index*2+1];
            }
            this._checkContracts2(contracts, cb);
        });
    };

    _checkContracts2=(contracts, cb)=>{
        const fn=(contracts, cb)=>{
            if(contracts.length==0) {
                cb(0);
                return;
            }
            const contract=contracts.pop();
            this._verifyContract(contract[0], contract[1], contract[2], (status)=>{
                if(status>0) {
                    cb(status);
                    return;
                }
                fn(contracts,(status)=>{
                    cb(status);
                });
            });
        };
        fn(contracts, (status)=>{
            cb(status);
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

    _getProvider=(endpoint, accounts)=>{
        var ts=this.props.functions.session.start_time();
        const js=`<script type="text/javascript" src="/static/js/web3provider.js?ts=`+ts+`">
    </script>
    <script type="text/javascript">
        window.web3={currentProvider:new DevKitProvider.provider("`+endpoint+`"),eth:{accounts:`+JSON.stringify(accounts)+`}};
        console.log("Using Superblocks web3 provider for endpoint: `+endpoint+`");
    </script>
`;
        return js;
    };

    getInnerContent = (html, style, js, endpoint, accounts) => {
        const js2=(endpoint!=null&&accounts!=null?this._getProvider(endpoint, accounts):"")+`
<script type="text/javascript">
`+js+`
</script>

`;
        const style2=`<style type="text/css">
`+style+`
</style>
`;
        html=html.replace("<!-- TITLE -->", this._getTitle());
        html=html.replace("<!-- STYLE -->", style2);
        html=html.replace("<!-- JAVASCRIPT -->", js2);
        return html;
    };

    _getTitle=()=>{
        return "<title>"+(((this.dappfile.getObj().project ||{}).info||{}).title || "")+"</title>";
    };

    run = (e) => {
        e.preventDefault();
        e.stopPropagation();  // Don't auto focus on the window.
        this.lastContent=null;  // To force a render.
        this.render2();
    };

    getAccounts = (useDefault) => {
        var index=0;
        const ret=[{name:"(no provider)",value:index++},{name:"(locked)",value:index++}];
        this.dappfile.accounts().map((account) => {
            ret.push({name:account.name,value:index++});
        })
        return ret;
    };

    renderToolbar = () => {
        const accounts=this.getAccounts();
        var accountsNotice="";
        if(this.state.disableAccounts=="on") {
            if(this.state.network=="browser") {
                accountsNotice="Warning: the dapp cannot communicate to the Browser blockchain when accounts are disabled.";
            }
            else {
                accountsNotice="Accounts are not injected into the dapp simulating when Metamask is not active.";
            }
        }
        return (
            <div class={style.toolbar} id={this.id+"_header"}>
                <div class={style.buttons}>
                    <a href="#" title="Refresh" onClick={this.run}><IconRun /></a>
                    <a href="#" title="Download DApp" onClick={this.download}>Download DApp</a>
                </div>
                <div class={style.accounts}>
                    <span><input checked={this.state.disableAccounts=="on"} onChange={(e)=>{this.setState({disableAccounts:(e.target.checked?"on":"off")});this.redraw();}} type="checkbox" />&nbsp;Disable accounts&nbsp;</span>
                    <span>{accountsNotice}</span>
                </div>
            </div>
        );
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
