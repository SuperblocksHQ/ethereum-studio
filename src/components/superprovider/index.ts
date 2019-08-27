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

import Web3 from 'web3';
import Tx from 'ethereumjs-tx';
import Buffer from 'buffer';
import { evmService } from '../../services';

export default class SuperProvider {
    private readonly channelId: string;
    private readonly notifyTx: (hash: string, endpoint: string) => void;
    private readonly getCurrentEnv: () => void;
    private iframe: any;
    private iframeStatus: number;

    constructor(channelId: string, notifyTx: (hash: string, endpoint: string) => void, getCurrentEnv: () => void) {
        this.channelId = channelId;
        this.notifyTx = notifyTx;
        this.iframe = null;
        this.iframeStatus = -1;
        this.getCurrentEnv = getCurrentEnv;
    }

    initIframe = (iframe: any) => {
        this.iframe = iframe;
        this.iframeStatus = -1;
        this.initializeIFrame();
    }

    attachListener = () => {
        window.addEventListener('message', this.onMessage);
    }

    detachListener = () => {
        window.removeEventListener('message', this.onMessage);
    }

    private onMessage = (event: any) => {
        // There's no point checking origin here since the iframe is running it's own code already,
        // we need to treat it as a suspect.
        // if (event.origin !== "null") {
        // console.log("Origin diff", event.origin);
        // return;
        // }
        const data = event.data;
        if (typeof data !== 'object') { return; }
        if (data.channel !== this.channelId) { return; }
        if (data.type === 'ack') {
            this.iframeStatus = 0;
            return;
        }

        const callback = (err, res) => {
            // console.log(err,res);
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
                        payload: { err, res },
                    },
                    '*'
                );
            } catch (e) {}
        };

        const send = (payload, endpoint, callback) => {
            // Send request on given endpoint
            // TODO: possibly set from and gasLimit.
            if (endpoint.toLowerCase() === 'http://superblocks-browser') {
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
                    // const modalData = {
                    //     title: 'WARNING: Invoking external account provider',
                    //     body:
                    //         'Please understand that Superblocks Lab has no power over which network is targeted when using an external provider. It is your responsibility that the network is the same as it is expected to be.',
                    //     style: {
                    //         backgroundColor: '#cd5c5c',
                    //         color: '#fef7ff',
                    //     },
                    // };
                    // const modal = <Modal data= {modalData}; />;
                    // this.projectItem.functions.modal.show({
                    //     cancel: () => {
                    //         return false;
                    //     },
                    //     render: () => {
                    //         return modal;
                    //     },
                    // });
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
                const obj = payload.params[payload.params.length - 1];
                const obj2 = {
                    env,
                    endpoint: data.endpoint,
                };

                this.openWallet(obj2, accountName, status => {
                    if (status !== 0) {
                        const err = 'Could not open wallet.';
                        callback(err, null);
                        return;
                    }
                    this.getNonce(obj2, async status => {
                        if (status !== 0) {
                            const err = 'Could not get nonce.';
                            callback(err, null);
                            return;
                        }
                        const tx = new Tx({
                            from: obj2.account.address,
                            to: obj.to,
                            value: obj.value,
                            nonce: obj2.account.nonce,
                            gasPrice: obj.gasPrice,
                            gasLimit: obj.gas,
                            data: obj.data,
                        });
                        tx.sign(Buffer.Buffer.from(obj2.account.key, 'hex'));
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
    }

    private getWeb3 = (endpoint: string) => {
        let provider;
        if (endpoint.toLowerCase() === 'http://superblocks-browser') {
            provider = evmService.getProvider();
        } else {
            provider = new Web3.providers.HttpProvider(endpoint);
        }
        return new Web3(provider);
    }

    private getNonce = async (endpoint: string, address: string) => {
        const web3 = this.getWeb3(endpoint);
        return await web3.eth.getTransactionCount(address);
    }

    private openWallet = (obj, accountName) => {
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
                            address,
                            key,
                        };
                        // TODO - Work with a promise - cb(0);
                        return;
                    } else {
                        const msg = 'Could not get key from wallet for address.';
                        alert(msg);
                        // TODO - Work with a promise - cb(1);
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
    }

    private initializeIFrame = () => {
        if (this.iframeStatus === 0) { return; }
        if (this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage(
                { type: 'init', channel: this.channelId },
                '*'
            );
        }
        setTimeout(this.initializeIFrame, 1000);
    }
}
