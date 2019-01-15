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
import Modal from '../modal/index.js';

const TxEth = () => import(/* webpackChunkName: "ethereumjs-tx" */ '../../ethereumjs-tx-1.3.3.min.js');

export default class SuperProvider {
    constructor(channelId, projectItem, notifyTx, getCurrentEnv) {
        this.channelId = channelId;
        this.projectItem = projectItem;
        this.notifyTx = notifyTx;
        this.iframe = null;
        this.iframeStatus = -1;
        this.getCurrentEnv = getCurrentEnv;
    }

    _initIframe = () => {
        if (this.iframeStatus === 0) { return; }
        if (this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage(
                { type: 'init', channel: this.channelId },
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
        if (typeof data !== 'object') { return; }
        if (data.channel !== this.channelId) { return; }
        if (data.type === 'ack') {
            this.iframeStatus = 0;
            return;
        }

        const callback = (err, res) => {
            //console.log(err,res);
            if (
                (payload.method === 'eth_sendTransaction' ||
                    payload.method === 'eth_sendRawTransaction') &&
                !err &&
                res &&
                res.result &&
                this.notifyTx
            ) {
                this.notifyTx(res.result, data.endpoint);
            }
            try {
                this.iframe.contentWindow.postMessage(
                    {
                        type: 'reply',
                        channel: this.channelId,
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
                this.projectItem.functions.EVM.getProvider().sendAsync(
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
                            if (response.status === 405) {
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
                        if (response) { callback(null, response); }
                    });
            }
        };
        const payload = data.payload;
        if (payload.method === 'eth_sendTransaction') {
            // Needs signing
            const accountName = this.projectItem.getAccount();
            if (
                !accountName ||
                accountName === '(absent)' ||
                accountName === '(locked)'
            ) {
                const err = 'No account provided.';
                alert(err);
                callback(err, null);
                return;
            }
            const accounts = this.projectItem.getHiddenItem('accounts');
            const account = accounts.getByName(accountName);

            const env = this.getCurrentEnv();
            const walletName = account.getWallet(env);

            const wallets = this.projectItem.getHiddenItem('wallets');
            const wallet = wallets.getByName(walletName);

            if (!wallet) {
                const err = 'Wallet not found.';
                alert(err);
                callback(err, null);
                return;
            }
            const walletType = wallet.getWalletType();

            if (walletType === 'external') {
                if (
                    data.endpoint.toLowerCase() === 'http://superblocks-browser'
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
                    if ((window.web3.eth.accounts || []).length === 0) {
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
                    this.projectItem.functions.modal.show({
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
                            this.projectItem.functions.modal.close();
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
                    this._getNonce(obj2, async status => {
                        if (status != 0) {
                            const err = 'Could not get nonce.';
                            callback(err, null);
                            return;
                        }
                        const asyncTx = await TxEth();
                        const Tx = asyncTx.default;
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
        if (endpoint.toLowerCase() === 'http://superblocks-browser') {
            provider = this.projectItem.functions.EVM.getProvider();
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
        const accounts = this.projectItem.getHiddenItem('accounts');
        const account = accounts.getByName(accountName);

        const accountIndex = account.getAccountIndex(obj.env);
        const walletName = account.getWallet(obj.env);

        const getKey = () => {
            this.projectItem.functions.wallet.getKey(
                walletName,
                accountIndex,
                (status, key) => {
                    if (status === 0) {
                        const address = this.projectItem.functions.wallet.getAddress(
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
                        const msg = 'Could not get key from wallet for address.';
                        alert(msg);
                        cb(1);
                        return;
                    }
                }
            );
        };

        if (this.projectItem.functions.wallet.isOpen(walletName)) {
            getKey();
        } else {
            this.projectItem.functions.wallet.openWallet(
                walletName,
                null,
                status => {
                    if (status === 0) {
                        getKey();
                    } else if (status === 2) {
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
