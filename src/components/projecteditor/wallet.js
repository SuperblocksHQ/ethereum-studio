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

const walletLight = () => import(/* webpackChunkName: "lightwallet" */ 'eth-lightwallet/dist/lightwallet.min.js');

export class WalletDialog extends Component {
    constructor(props) {
        super(props);
    }
}

export class Wallet {
    constructor(props) {
        this.props = props;
        this.wallets = {};
    }

    static async generateSeed() {
        const asyncWallet = await walletLight();
        const lightwallet = asyncWallet.default;
        return lightwallet.keystore.generateRandomSeed();
    }

    _newWallet = async (name, seed, hdpath, cb) => {
        hdpath = hdpath || "m/44'/60'/0'/0";

        const asyncWallet = await walletLight();
        const lightwallet = asyncWallet.default;

        try {
            const words = seed.split(' ');
            if (
                words.length !== 12 ||
                !lightwallet.keystore.isSeedValid(seed)
            ) {
                cb && cb(2);
                return;
            }
        } catch (err) {
            cb && cb(2);
            return;
        }
        const wallet = {
            name: name,
            secret: {
                seed: seed,
            },
            hdpath: hdpath,
            timeout: 3600,
            opened: Date.now(),
            accessed: Date.now(),
            permissions: this.props.permissions || {
                key: 1,
                seed: 1,
            },
        };
        this.wallets[name] = wallet;

        const password = '';
        const self = this;
        lightwallet.keystore.createVault(
            {
                password: password,
                seedPhrase: seed,
                hdPathString: hdpath,
            },
            function(err, ks) {
                ks.keyFromPassword(password, function(err, pwDerivedKey) {
                    if (err) {
                        cb && cb(3);
                        return;
                    }
                    wallet.secret.ks = ks;
                    wallet.secret.key = pwDerivedKey;
                    ks.generateNewAddress(pwDerivedKey, self.props.length);
                    wallet.addresses = ks.getAddresses();
                    cb && cb(0);
                });
            }
        );
    };

    isOpen = name => {
        return this.wallets[name] && true;
    };

    openWallet = (name, seed, cb) => {
        if (!seed) {
            seed = prompt(
                'Please enter the 12 word seed to unlock the wallet: ' + name
            );
            if (!seed) {
                cb && cb(1);
                return;
            }
        }
        this._newWallet(name, seed, null, cb);
    };

    getAddress = (walletName, index) => {
        const wallet = this.wallets[walletName];
        if (!wallet) return;
        return wallet.addresses[index];
    };

    getKey = (walletName, index, cb) => {
        const wallet = this.wallets[walletName];
        if (!wallet) {
            cb(1);
            return;
        }
        const address = wallet.addresses[index];
        if (!address) {
            cb(1);
            return;
        }
        if (wallet.permissions.key === 1) {
            const key = wallet.secret.ks.exportPrivateKey(
                address,
                wallet.secret.key
            );
            cb(0, key);
            return;
        }
        this._authorize(wallet, 'key', status => {
            if (status === 0) {
                const key = wallet.secret.ks.exportPrivateKey(
                    address,
                    wallet.secret.key
                );
                cb(0, key);
                return;
            }
            cb(status);
        });
    };

    getSeed = (walletName, cb) => {
        const wallet = this.wallets[walletName];
        if (!wallet) {
            cb(1);
            return;
        }
        if (wallet.permissions.seed === 1) {
            cb(0, wallet.secret.seed);
            return;
        }
        this._authorize(wallet, 'seed', status => {
            if (status === 0) {
                cb(0, wallet.secret.seed);
                return;
            }
            cb(status);
        });
    };

    _authorize = (wallet, type, cb) => {
        if (
            window.confirm(
                'Authorize access to ' +
                    type +
                    ' in wallet ' +
                    wallet.name +
                    '?'
            )
        ) {
            cb(0);
        } else {
            cb(1);
        }
    };
}
