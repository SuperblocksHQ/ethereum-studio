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
import { evmService, walletService } from '../../services';
import { IEnvironment, IAccount } from '../../models/state';
import Networks from '../../networks';

export default class SuperProvider {
    private readonly channelId: string;
    private readonly notifyTx: (hash: string, endpoint: string) => void;
    private selectedAccount: IAccount;
    private selectedEnvironment: IEnvironment;
    private iframe: any;
    private iframeStatus: number;
    private knownWalletSeed: string;

    constructor(channelId: string, environment: IEnvironment, account: IAccount, knownWalletSeed: string, notifyTx: (hash: string, endpoint: string) => void) {
        this.channelId = channelId;
        this.selectedEnvironment = environment;
        this.selectedAccount = account;
        this.notifyTx = notifyTx;
        this.iframe = null;
        this.iframeStatus = -1;
        this.knownWalletSeed = knownWalletSeed;
    }

    initIframe(iframe: any) {
        this.iframe = iframe;
        this.iframeStatus = -1;
        this.initializeIFrame();
    }

    attachListener() {
        window.addEventListener('message', this.onMessage);
    }

    detachListener() {
        window.removeEventListener('message', this.onMessage);
    }

    setEnvironment(environment: IEnvironment) {
        this.selectedEnvironment = environment;
    }

    setAccount(account: IAccount) {
        this.selectedAccount = account;
    }

    private send = (payload: any, endpoint: string) => {
        // Send request on given endpoint
        // TODO: possibly set from and gasLimit.
        return new Promise(async (resolve, reject) => {
            if (endpoint.toLowerCase() === Networks.browser.endpoint) {
                evmService.getProvider().sendAsync(payload, ((err: any, result: any) => {
                    if (err) {
                        console.log(err);
                        reject('Problem calling the provider async call: ' + err);
                    }
                    resolve(result);
                }));
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
                            reject('Method not supported by remote endpoint.');
                        }
                        reject('Could not communicate with remote endpoint.');
                    }
                    resolve(response.json());
                })
                .catch(() => {
                    reject('Error running method remotely.');
                });
            }
        });
    }

    private sendAsyncThroughExternalProvider(data: any) {
        return new Promise((resolve, reject) => {
            window.web3.currentProvider.sendAsync(data.payload, ((err: any, result: any) => {
                if (err) {
                    console.log(err);
                    reject('Problem calling the provider async call');
                }
                resolve(result);
            }));
        });
    }

    private onMessage = async (event: any) => {
        const data = event.data;
        if (typeof data !== 'object') { return; }
        if (data.channel !== this.channelId) { return; }
        if (data.type === 'ack') {
            this.iframeStatus = 0;
            return;
        }

        const sendIframeMessage = (err: any, res: any) => {
            if ((data.payload.method === 'eth_sendTransaction' || data.payload.method === 'eth_sendRawTransaction') &&
                !err &&
                res &&
                res.result
            ) {
                this.notifyTx(res.result, data.endpoint);
            }
            try {
                this.iframe.contentWindow.postMessage({
                    type: 'reply',
                    channel: this.channelId,
                    id: data.id,
                    payload: { err, res },
                }, '*');
            } catch (e) {
                console.log(e);
            }
        };

        const payload = data.payload;
        if (payload.method === 'eth_sendTransaction') {
            // Needs signing
            const accountName = this.selectedAccount.name;
            if (!accountName || accountName === '(absent)' || accountName === '(locked)') {
                const err = 'No account provided.';
                alert(err);
                sendIframeMessage(err, null);
                return;
            }
            if (this.selectedAccount.type === 'metamask') {
                if (data.endpoint.toLowerCase() === Networks.browser.endpoint) {
                    const err = 'External/Metamask account cannot be used for the in-browser blockchain.';
                    alert(err);
                    sendIframeMessage(err, null);
                    return;
                }
                // Pass to External/Metamask
                if (window.web3.currentProvider) {
                    // TODO is there any way to check what endpoint Metamask is configured for
                    // and verify that it matches out expected endpoint?
                    if ((window.web3.eth.accounts || []).length === 0) {
                        const err = 'External/Metamask provider is locked. Cannot proceed.';
                        alert(err);
                        sendIframeMessage(err, null);
                        return;
                    }
                    // TODO - All this SuperProvider could actually be changed to be using Epics instead
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
                    const result = await this.sendAsyncThroughExternalProvider(data);
                    sendIframeMessage(null, result);
                    return;
                } else {
                    const err = "Metamask plugin is not installed, can't proceed.";
                    alert(err);
                    sendIframeMessage(err, null);
                    return;
                }
            } else {
                const obj = payload.params[payload.params.length - 1];

                const wallet = await walletService.openWallet(this.selectedAccount.name, this.knownWalletSeed, null)
                    .catch((err) => console.log(err));
                if (!wallet) {
                    alert('Could not open the wallet.');
                    return;
                }

                const nonce = await this.getNonce(this.selectedEnvironment.endpoint, this.selectedAccount.address)
                    .catch((err) => console.log(err));
                if (nonce == null) {  // Catches both null and undefined but not 0.
                    alert('The nonce could not be fetched');
                    return;
                }

                const tx = new Tx({
                    from: this.selectedAccount.address,
                    to: obj.to,
                    value: obj.value,
                    nonce,
                    gasPrice: obj.gasPrice,
                    gasLimit: obj.gas,
                    data: obj.data,
                });
                if (this.selectedAccount.walletName === null || this.selectedAccount.address === null) {
                    alert('The selected account is not valid');
                    return;
                }
                const key = walletService.getKey(this.selectedAccount.walletName, this.selectedAccount.address);
                tx.sign(Buffer.Buffer.from(key, 'hex'));
                const obj3 = {
                    jsonrpc: '2.0',
                    method: 'eth_sendRawTransaction',
                    params: ['0x' + tx.serialize().toString('hex')],
                    id: payload.id,
                };

                try {
                    const result = await this.send(obj3, data.endpoint);
                    sendIframeMessage(null, result);
                } catch (error) {
                    alert(error);
                    sendIframeMessage(error, null);
                }
            }
        } else if (payload.method === 'eth_accounts') {
            sendIframeMessage(null, {id: payload.id, jsonrpc: '2.0', result: [this.selectedAccount.address]});
        } else {
            try {
                const result = await this.send(data.payload, data.endpoint);
                sendIframeMessage(null, result);
            } catch (error) {
                console.log(error);
                sendIframeMessage(error, null);
            }
        }
    }

    private getWeb3 = (endpoint: string) => {
        let provider;
        if (endpoint.toLowerCase() === Networks.browser.endpoint) {
            provider = evmService.getProvider();
        } else {
            provider = new Web3.providers.HttpProvider(endpoint);
        }
        return new Web3(provider);
    }

    private getNonce = async (endpoint: string, address: Nullable<string>) => {
        return new Promise((resolve, reject) => {
            if (address === null) {
                reject('The address cannot be empty');
                return;
            }
            const web3 = this.getWeb3(endpoint);
            web3.eth.getTransactionCount(address, undefined, ((err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            }));
        });
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
