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

import React from 'react';
import Web3 from 'web3';
import Tx from '../../ethereumjs-tx-1.3.3.min.js';
import Modal from '../modal/index.js';

export default class SuperProvider {
    constructor(props) {
        // Handle to owner.. Not beautiful but it rocks.
        this.that = props.that;
        this.iframe = null;
        this.iframeStatus = -1;
    }

    _initIframe = () => {
        if (this.iframeStatus == 0) return;
        if (this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage(
                { type: 'init', channel: this.that.id },
                '*'
            );
        }
        setTimeout(this._initIframe, 1000);
    };

    initIframe = iframe => {
        this.iframe = iframe;
        this.iframeStatus = -1;
        this._initIframe();
    };

    _onMessage = event => {
        // There's no point checking origin here since the iframe is running it's own code already,
        // we need to treat it as a suspect.
        //if (event.origin !== "null") {
        //console.log("Origin diff", event.origin);
        //return;
        //}
        const data = event.data;
        if (typeof data != 'object') return;
        if (data.channel != this.that.id) return;
        if (data.type == 'ack') {
            this.iframeStatus = 0;
            return;
        }

        const callback = (err, res) => {
            //console.log(err,res);
            if (
                (payload.method == 'eth_sendTransaction' ||
                    payload.method == 'eth_sendRawTransaction') &&
                !err &&
                res &&
                res.result &&
                this.that.notifyTx
            ) {
                this.that.notifyTx(res.result, data.endpoint);
            }
            try {
                this.iframe.contentWindow.postMessage(
                    {
                        type: 'reply',
                        channel: this.that.id,
                        id: data.id,
                        payload: { err: err, res: res },
                    },
                    '*'
                );
            } catch (e) {}
        };

        const send = (payload, endpoint, callback) => {
            // Send request on given endpoint
            // TODO: possibly set from and gasLimit.
            if (endpoint.toLowerCase() == 'http://superblocks-browser') {
                this.that.props.functions.EVM.getProvider().sendAsync(
                    payload,
                    callback
                );
            } else {
                fetch(endpoint, {
                    body: JSON.stringify(payload),
                    headers: {
                        'content-type': 'application/json',
                    },
                    method: 'POST',
                })
                    .then(response => {
                        if (!response.ok) {
                            if (response.status == 405) {
                                callback(
                                    'Method not supported by remote endpoint.'
                                );
                                return;
                            }
                            callback(
                                'Could not communicate with remote endpoint.'
                            );
                            return;
                        }
                        return response.json();
                    })
                    .catch(error => {
                        callback('Error running method remotely.');
                    })
                    .then(response => {
                        if (response) callback(null, response);
                    });
            }
        };
        const payload = data.payload;
        if (payload.method == 'eth_sendTransaction') {
            // Needs signing
            const accountName = this.that._getAccount();
            if (
                !accountName ||
                accountName == '(absent)' ||
                accountName == '(locked)'
            ) {
                const err = 'No account provided.';
                alert(err);
                callback(err, null);
                return;
            }
            //const account = this.that.dappfile.getItem("accounts", [{name: accountName}]);
            const accounts = this.that.props.item
                .getProject()
                .getHiddenItem('accounts');
            const account = accounts.getByName(accountName);

            //const env=this.that.props.project.props.state.data.env;
            const env = this.that.props.item.getProject().getEnvironment();
            //const walletName=account.get('wallet', env);
            const walletName = account.getWallet(env);
            //const wallet = this.that.dappfile.getItem("wallets", [{name: walletName}]);

            const wallets = this.that.props.item
                .getProject()
                .getHiddenItem('wallets');
            const wallet = wallets.getByName(walletName);

            if (!wallet) {
                const err = 'Wallet not found.';
                alert(err);
                callback(err, null);
                return;
            }
            const walletType = wallet.getWalletType();

            if (walletType == 'external') {
                if (
                    data.endpoint.toLowerCase() == 'http://superblocks-browser'
                ) {
                    const err =
                        'External/Metamask account cannot be used for the in-browser blockchain.';
                    alert(err);
                    callback(err, null);
                    return;
                }
                // Pass to External/Metamask
                if (window.web3.currentProvider) {
                    // TODO is there any way to check what endpoint Metamask is configured for
                    // and verify that it matches out expected endpoint?
                    if ((window.web3.eth.accounts || []).length == 0) {
                        const err =
                            "External/Metamask provider is locked. Can't proceed.";
                        alert(err);
                        callback(err, null);
                        return;
                    }
                    const modalData = {
                        title: 'WARNING: Invoking external account provider',
                        body:
                            'Please understand that Superblocks Lab has no power over which network is targeted when using an external provider. It is your responsibility that the network is the same as it is expected to be.',
                        style: {
                            'backgroundColor': '#cd5c5c',
                            color: '#fef7ff',
                        },
                    };
                    const modal = <Modal data={modalData} />;
                    this.that.props.functions.modal.show({
                        cancel: () => {
                            return false;
                        },
                        render: () => {
                            return modal;
                        },
                    });
                    window.web3.currentProvider.sendAsync(
                        data.payload,
                        (err, res) => {
                            this.that.props.functions.modal.close();
                            callback(err, res);
                        }
                    );
                    return;
                } else {
                    const err =
                        "Metamask plugin is not installed, can't proceed.";
                    alert(err);
                    callback(err, null);
                    return;
                }
                return;
            } else {
                var obj = payload.params[payload.params.length - 1];
                var obj2 = {
                    env: env,
                    endpoint: data.endpoint,
                };
                this._openWallet(obj2, accountName, status => {
                    if (status != 0) {
                        const err = 'Could not open wallet.';
                        callback(err, null);
                        return;
                    }
                    this._getNonce(obj2, status => {
                        if (status != 0) {
                            const err = 'Could not get nonce.';
                            callback(err, null);
                            return;
                        }
                        const tx = new Tx.Tx({
                            from: obj2.account.address,
                            to: obj.to,
                            value: obj.value,
                            nonce: obj2.account.nonce,
                            gasPrice: obj.gasPrice,
                            gasLimit: obj.gas,
                            data: obj.data,
                        });
                        tx.sign(Tx.Buffer.Buffer.from(obj2.account.key, 'hex'));
                        const obj3 = {
                            jsonrpc: '2.0',
                            method: 'eth_sendRawTransaction',
                            params: ['0x' + tx.serialize().toString('hex')],
                            id: payload.id,
                        };
                        send(obj3, data.endpoint, callback);
                    });
                });
                return;
            }
        } else {
            send(data.payload, data.endpoint, callback);
        }
    };

    _getWeb3 = endpoint => {
        var provider;
        if (endpoint.toLowerCase() == 'http://superblocks-browser') {
            provider = this.that.props.functions.EVM.getProvider();
        } else {
            var provider = new Web3.providers.HttpProvider(endpoint);
        }
        var web3 = new Web3(provider);
        return web3;
    };

    _getNonce = (obj, cb) => {
        var web3 = this._getWeb3(obj.endpoint);
        web3.eth.getTransactionCount(obj.account.address, (err, res) => {
            if (err == null) {
                obj.account.nonce = res;
                cb(0);
                return;
            }
            cb(1);
        });
    };

    _openWallet = (obj, accountName, cb) => {
        //const account = this.that.dappfile.getItem("accounts", [{name: accountName}]);

        const accounts = this.that.props.item
            .getProject()
            .getHiddenItem('accounts');
        const account = accounts.getByName(accountName);

        //const walletName=account.get('wallet', obj.env);
        //const accountIndex=account.get('index', obj.env);

        const accountIndex = account.getAccountIndex(obj.env);
        const walletName = account.getWallet(obj.env);

        const getKey = () => {
            this.that.props.functions.wallet.getKey(
                walletName,
                accountIndex,
                (status, key) => {
                    if (status == 0) {
                        const address = this.that.props.functions.wallet.getAddress(
                            walletName,
                            accountIndex
                        );
                        obj.account = {
                            address: address,
                            key: key,
                        };
                        cb(0);
                        return;
                    } else {
                        const msg =
                            'Could not get key from wallet for address ' +
                            address +
                            '.';
                        alert(msg);
                        cb(1);
                        return;
                    }
                }
            );
        };

        if (this.that.props.functions.wallet.isOpen(walletName)) {
            getKey();
        } else {
            this.that.props.functions.wallet.openWallet(
                walletName,
                null,
                status => {
                    if (status == 0) {
                        getKey();
                    } else if (status == 2) {
                        alert('Bad seed entered.');
                        cb(1);
                        return;
                    } else {
                        alert('Could not open wallet.');
                        cb(1);
                        return;
                    }
                }
            );
        }
    };

    _attachListener = () => {
        window.addEventListener('message', this._onMessage);
    };

    _detachListener = () => {
        window.removeEventListener('message', this._onMessage);
    };
}
