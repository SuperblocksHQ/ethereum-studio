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
import style from './style-appview.less';
import { IconRun } from '../icons';

var Generator = require('../contractinteraction');
import SuperProvider from '../superprovider';
import Web3 from 'web3';

export default class ContractInteraction extends Component {
    constructor(props) {
        super(props);
        this.id = props.id + '_contractinteraction';
        this.props.parent.childComponent = this;
        this.provider = new SuperProvider(this.id, this.props.item.getProject(), this.notifyTx.bind(this));
        this.contract_address = '';
        this.contract_balance = '? eth';
        this.contract_balance_wei = '';
    }

    componentDidMount() {}

    notifyTx = (hash, endpoint) => {
        var network;
        Object.keys(this.props.functions.networks.endpoints).map(key => {
            const obj = this.props.functions.networks.endpoints[key];
            if (obj.endpoint === endpoint) { network = key; }
        });
        this.props.item
            .getProject()
            .getTxLog()
            .addTx({
                hash: hash,
                context: 'Contract interaction',
                network: network,
            });
    };

    redraw = props => {
        if ((props || {}).all) this.lastContent = null; // To force a render.
        this.forceUpdate();
        this.render2();
    };

    componentWillReceiveProps(props) {}

    writeContent = (status, content) => {
        if (!this.iframeDiv) return;
        content = content || this.lastContent || 'No content';
        if (status > 0) {
            // Add surrounding html
            content =
                `<html><head><style>body {background-color: #fff; color: #333;text-align:center;}</style></head><body><h1>` +
                content +
                `</h1></body></html>`;
        }
        if (content == this.lastContent) return;
        this.lastContent = content;
        while (this.iframeDiv.firstChild) {
            this.iframeDiv.removeChild(this.iframeDiv.firstChild);
        }
        const iframe = document.createElement('iframe');
        iframe.sandbox = 'allow-scripts allow-modals allow-forms';
        iframe.srcdoc = content;
        this.iframeDiv.appendChild(iframe);
        this.iframe = iframe;
        this.provider.initIframe(iframe);
        this.forceUpdate(); // To update data outside of iframe.
    };

    _makeFileName = (path, tag, suffix) => {
        const a = path.match(/^(.*\/)([^/]+)$/);
        const dir = a[1];
        const filename = a[2];
        const a2 = filename.match(/^(.+)[.][Ss][Oo][Ll]$/);
        const contractName = a2[1];
        if (tag) {
            return (
                '/build' +
                dir +
                contractName +
                '/' +
                contractName +
                '.' +
                tag +
                '.' +
                suffix
            );
        }
        return (
            '/build' + dir + contractName + '/' + contractName + '.' + suffix
        );
    };

    render2 = () => {
        const project = this.props.item.getProject();
        const env = project.getEnvironment();
        const contract = this.props.item.getParent();

        if (!contract) return; // This gets called twice, with the previous contract name, after renaming a contract.
        const src = contract.getSource();
        //const network=this.state.network;
        const network = env;
        const endpoint = (
            this.props.functions.networks.endpoints[network] || {}
        ).endpoint;
        const tag = env;
        const srcabi = this._makeFileName(src, '', 'abi');
        const addresssrc = this._makeFileName(src, network, 'address');
        const txsrc = this._makeFileName(src, network, 'tx');
        const deploysrc = this._makeFileName(src, network, 'deploy');
        const jssrc = this._makeFileName(src, network, 'js');
        project.loadFile(
            addresssrc,
            body => {
                if (body.status != 0) {
                    this.writeContent(
                        1,
                        'Missing file(s), contract not deployed?'
                    );
                    return;
                }
                this.contract_address = body.contents;
                this._verifyContract(txsrc, deploysrc, endpoint, status => {
                    if (status != 0) {
                        this.writeContent(
                            1,
                            'Contract does not exist. When running the in-browser blockchain it gets wiped on every refresh.'
                        );
                        return;
                    }
                    project.loadFile(
                        srcabi,
                        body => {
                            if (body.status != 0) {
                                this.writeContent(1, 'Missing file(s)');
                                return;
                            }
                            var abi = body.contents;
                            if (typeof body.contents != 'object') {
                                abi = JSON.parse(body.contents);
                            }
                            this._loadJsFiles(
                                jssrc,
                                env,
                                (status, jsbodies) => {
                                    if (status != 0) {
                                        this.writeContent(
                                            1,
                                            'Missing contract javascript file, have you deployed all contracts?'
                                        );
                                        return;
                                    }
                                    const rendered = Generator.render(
                                        abi,
                                        contract.getName()
                                    );
                                    const content = this.getOuterContent(
                                        rendered.html,
                                        jsbodies.join('\n') + rendered.js,
                                        endpoint,
                                        this._getAccountAddress()
                                    );
                                    this.writeContent(0, content);
                                }
                            );
                        },
                        true,
                        true
                    );
                });
            },
            true,
            true
        );
    };

    _getAccount = () => {
        const project = this.props.item.getProject();
        const accountName = project.getAccount();
        return accountName;
    };

    _getAccountAddress = () => {
        // Check given account, try to open and get address, else return [].
        const accountName = this._getAccount();
        if (!accountName) return [];

        //const env=this.state.network;
        const env = this.props.item.getProject().getEnvironment();
        //const account = this.dappfile.getItem("accounts", [{name: accountName}]);
        //const accountIndex=account.get('index', env);
        //const walletName=account.get('wallet', env);
        //const wallet = this.dappfile.getItem("wallets", [{name: walletName}]);

        const accounts = this.props.item.getProject().getHiddenItem('accounts');
        const account = accounts.getByName(accountName);
        const accountIndex = account.getAccountIndex(env);
        const walletName = account.getWallet(env);
        const wallets = this.props.item.getProject().getHiddenItem('wallets');
        const wallet = wallets.getByName(walletName);

        if (!wallet) {
            return [];
        }
        const walletType = wallet.getWalletType();

        if (walletType == 'external') {
            // Metamask seems to always only provide one (the chosen) account.
            var extAccounts = [];
            if (window.web3 && window.web3.eth)
                extAccounts = window.web3.eth.accounts || [];
            if (extAccounts.length < accountIndex + 1) {
                // Account not matched
                return [];
            }
            return [extAccounts[accountIndex]];
        }

        if (this.props.functions.wallet.isOpen(walletName)) {
            const address = this.props.functions.wallet.getAddress(
                walletName,
                accountIndex
            );
            return [address];
        }

        return [];
    };

    _getWeb3 = endpoint => {
        var provider;
        if (endpoint.toLowerCase() == 'http://superblocks-browser') {
            provider = this.props.functions.EVM.getProvider();
        } else {
            var provider = new Web3.providers.HttpProvider(endpoint);
        }
        var web3 = new Web3(provider);
        return web3;
    };

    _getInputByTx = (tx, endpoint, cb) => {
        const web3 = this._getWeb3(endpoint);
        web3.eth.getTransaction(tx, (err, res) => {
            if (err) {
                cb(1);
                return;
            }
            if (res) {
                cb(0, res.input);
                return;
            }
            cb(1);
            return;
        });
    };

    _verifyContract = (txsrc, deploysrc, endpoint, cb) => {
        this._loadFiles([txsrc, deploysrc], (status, bodies) => {
            if (status > 0) {
                cb(status);
                return;
            }
            const tx = bodies[0];
            const code = bodies[1];
            if (this._codecache == null) this._codecache = {};
            if (this._codecache[endpoint] == null)
                this._codecache[endpoint] = {};
            if (this._codecache[endpoint][tx] == code) {
                cb(0);
                return;
            }
            this._getInputByTx(tx, endpoint, (status, input) => {
                if (status > 0) {
                    cb(1);
                    return;
                }
                if (input == code) {
                    this._codecache[endpoint][tx] = code;
                    cb(0);
                    return;
                }
                cb(1);
                return;
            });
        });
    };

    _loadFiles = (files, cb) => {
        const bodies = [];
        var fn;
        fn = (files, bodies, cb2) => {
            if (files.length == 0) {
                cb2(0);
                return;
            }
            const file = files.shift();
            this.props.item.getProject().loadFile(
                file,
                body => {
                    if (body.status != 0) {
                        cb(1);
                        return;
                    }
                    bodies.push(body.contents);
                    fn(files, bodies, status => {
                        cb2(status);
                    });
                },
                true,
                true
            );
        };
        fn(files, bodies, status => {
            cb(status, bodies);
        });
    };

    _loadJsFiles = (jssrc, network, cb) => {
        const files = [jssrc];
        const bodies = [];
        var fn;
        fn = (files, bodies, cb2) => {
            if (files.length == 0) {
                cb2(0);
                return;
            }
            const file = files.shift();
            this.props.item.getProject().loadFile(
                file,
                body => {
                    bodies.push(body.contents);
                    fn(files, bodies, status => {
                        cb2(status);
                    });
                },
                true,
                true
            );
        };
        fn(files, bodies, status => {
            cb(status, bodies);
        });
    };

    _getProvider = (endpoint, accounts) => {
        var ts = this.props.functions.session.start_time();
        const js =
            `<script type="text/javascript" src="/static/js/web3provider.js?ts=` +
            ts +
            `">
    </script>
    <script type="text/javascript">
        window.web3={currentProvider:new DevKitProvider.provider("` +
            endpoint +
            `"),eth:{accounts:` +
            JSON.stringify(accounts) +
            `}};
        console.log("Using Superblocks web3 provider.");
    </script>
`;
        return js;
    };

    getOuterContent = (html, js, endpoint, accounts) => {
        const html2 =
            `<!DOCTYPE html>
<html lang="en">
    <head>
        <script type="text/javascript" src="https://unpkg.com/web3@0.20.5/dist/web3.min.js"></script>
        ` +
            (endpoint != null ? this._getProvider(endpoint, accounts) : '') +
            `
    </head>
    <style>
            html, body {
                width: 100%;
                padding: 0;
                margin: 0;
                background-color: #1e1e1e;
                color: #fff;
                font-family: 'Untitled Sans';
                font-weight: 400;
                font-size: 15px;
            }
            html {
                ::-webkit-scrollbar {
                    width: 7px;
                }

                ::-webkit-scrollbar-track {
                    background: transparent;
                }

                ::-webkit-scrollbar-thumb {
                    border-radius: 4px;
                    background-color: rgba(0,0,0,.5);
                    -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
                    box-shadow: 0 0 1px rgba(255,255,255,.5);
                }
            }
            h1 {
                font-size: 1.33em;
            }
            h2 {
                font-size: 1.2em;
            }
            h3 {
                font-size: 1.0em;
            }
            input, input:focus {
                background-color: #3A3A3A;
                color: #FFF;
                border: none;
                border-radius: 4px;
                padding: 8px 16px;
                margin: 5px;
            }
            .intro {
            }
            .item {
                padding: 20px;
                padding-top: 0;
                margin-bottom: 10px;
                border-bottom: 1px solid #3c3c3c;
            }
            .constant {
            }
            .regular {
            }
            .payable {
            }
            .inputs {
            }
            .gas {
            }
            .value {
            }
            .constant .functionName {
                background-color: #008000;
            }
            .regular .functionName {
                background-color: #f5a623;
            }
            .payable .functionName {
                background-color: #ff3939;
            }
            .function .functionName {
                display: block;
                margin-top: 5px;
                border-radius: 4px;
                -webkit-border-radius: 4;
                -moz-border-radius: 4;
                color: #fff;
                padding: 7px 20px;
                text-decoration: none;
                font-weight: 600;
                border: none;
                user-select: none;
                outline: none;
            }
            .function .functionName:hover {
                opacity: 0.8;
            }
            .function .functionName.nohover:hover {
                opacity: 1.0;
            }
            .function span {
            }
            .arguments {
                display: inline;
            }
            .argument {
                display: block;
                margin-left: 60px;
            }
            .argument span {
                display: inline-block;
                overflow: hidden;
                width: 150px;
            }
            .argument input {
                overflow: hidden;
                width: 150px;
            }
            .call {
                display: inline;
            }
            .call button {
                margin-left: 10px;
            }
            button {
                cursor: pointer;
            }
            .returns {
                margin-top: 10px;
            }
            .txhash {
                dispay: block;
            }
            .btn2 {
                display: inline-block;
                border-radius: 4px;
                -webkit-border-radius: 4;
                -moz-border-radius: 4;
                color: #fff;
                padding: 7px 20px;
                text-decoration: none;
                font-weight: 600;
                border: none;
                user-select: none;
                outline: none;
            }
    </style>
    <script type="text/javascript">
        ` +
            js +
            `
    </script>
    <body>
        ` +
            html +
            `
    </body>
</html>
`;
        return html2;
    };

    run = e => {
        e.preventDefault();
        e.stopPropagation(); // Don't auto focus on the window.
        this.lastContent = null; // To force a render.
        this.render2();
    };

    renderToolbar = () => {
        return (
            <div className={style.toolbar} id={this.id + '_header'}>
                <div className={style.buttons}>
                    <a href="#" title="Refresh" onClick={this.run}>
                        <IconRun />
                    </a>
                </div>
                <div className={style.info}>
                    <span>
                        Contract address: {this.contract_address}
                        &nbsp;
                    </span>
                    <span title={this.contract_balance_wei}>
                        Balance: {this.contract_balance}
                        &nbsp;
                    </span>
                </div>
            </div>
        );
    };

    updateBalance = () => {
        if (this.updateBalanceBusy) return;
        this.updateBalanceBusy = true;
        const env = this.props.item.getProject().getEnvironment();
        const network = env;
        const endpoint = (
            this.props.functions.networks.endpoints[network] || {}
        ).endpoint;
        const web3 = this._getWeb3(endpoint);
        if (this.contract_address.length < 5) {
            this.updateBalanceBusy = false;
            this.contract_balance = '? eth';
            this.contract_balance_wei = '';
            this.forceUpdate();
            return;
        }
        web3.eth.getBalance(this.contract_address, (err, res) => {
            this.updateBalanceBusy = false;
            if (err) {
                this.contract_balance = '? eth';
                this.contract_balance_wei = '';
            } else {
                this.contract_balance_wei = res.toNumber() + ' wei';
                this.contract_balance = web3.fromWei(res.toNumber()) + ' eth';
                this.forceUpdate();
            }
        });
    };

    getHeight = () => {
        const a = document.getElementById(this.id);
        const b = document.getElementById(this.id + '_header');
        if (!a) return 99;
        return a.offsetHeight - b.offsetHeight;
    };

    updateAccount = () => {
        if (window.web3) {
            const currentAccount = window.web3.eth.accounts[0];
            if (this.lastAccountRead !== currentAccount) {
                this.lastAccountRead = currentAccount;
                this.lastContent = null; // To force a render.
                this.render2();
            }
        }
    };

    componentDidMount() {
        if (window.web3) {
            this.lastAccountRead = window.web3.eth.accounts[0];
        }

        this.accountTimer = setInterval(this.updateAccount, 3000);
        this.timer = setInterval(this.updateBalance, 3000);
        this.provider._attachListener();
        // We need to do a first redraw to get the height right, since toolbar didn't exist in the first sweep.
        this.redraw();
    }

    componentWillUnmount() {
        this.provider._detachListener();
        clearInterval(this.timer);
        clearInterval(this.accountTimer);
    }

    _firstRender = ref => {
        this.iframeDiv = ref;
        this.render2();
    };

    render() {
        const toolbar = this.renderToolbar();
        const maxHeight = {
            height: this.getHeight() + 'px',
        };
        return (
            <div id={this.id} key={this.id} className={style.appview}>
                {toolbar}
                <div
                    className="full"
                    style={maxHeight}
                    id={this.id + '_iframe'}
                    key={this.id + '_iframe'}
                    ref={this._firstRender}
                />
            </div>
        );
    }
}
