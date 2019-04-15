// Copyright 2019 Superblocks AB
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

import walletLight from 'eth-lightwallet/dist/lightwallet.min.js';
import { from, Observable } from 'rxjs';
import { getWeb3 } from './utils';

interface IEthWallet {
    name: string;
    secret: { seed: string, key: Uint8Array };
    hdpath: string;
    timeout: number;
    opened: number;
    accessed: number;
    permissions: { key: number, seed: number };
    addresses: string[];
}

const openWallets: { wallet: IEthWallet, keyStore: any }[] = [];

export const walletService = {

    openWallet(name: string, seed: string, hdpathParam: Nullable<string>) {
        const hdpath = hdpathParam || "m/44'/60'/0'/0";

        const words = seed.split(' ');
        if (words.length !== 12 || !walletLight.keystore.isSeedValid(seed)) {
            throw new Error('Seed should contain 12 word!');
        }

        return new Promise((resolve, reject) => {
            const password = '';
            walletLight.keystore.createVault(
                {
                    password,
                    seedPhrase: seed,
                    hdPathString: hdpath,
                },
                (_err: any, keyStore: any) => {
                    keyStore.keyFromPassword(password, (error: any, pwDerivedKey: Uint8Array) => {
                        if (error) {
                            reject(error);
                            return;
                        }

                        keyStore.generateNewAddress(pwDerivedKey, 30);

                        const wallet: IEthWallet = {
                            name,
                            secret: { seed, key: pwDerivedKey },
                            hdpath,
                            timeout: 3600,
                            opened: Date.now(),
                            accessed: Date.now(),
                            permissions: { key: 1, seed: 1 },
                            addresses: keyStore.getAddresses()
                        };

                        openWallets.push({ wallet, keyStore });
                        resolve(wallet.addresses);
                    });
                }
            );
        });
    },

    fetchBalance(endpoint: string, address: string): Observable<string> {
        return from(new Promise((resolve, reject) => {
            const web3 = getWeb3(endpoint);
            web3.eth.getBalance(address, (err: any, res: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(web3.fromWei(res.toNumber()));
                }
            });
        }));
    },

    getKey(walletName: string, address: string) {
        const openWalletPair = openWallets.find(w => w.wallet.name === walletName);
        if (!openWalletPair) {
            throw new Error(`Wallet ${walletName} is not open`);
        }

        if (!openWalletPair.wallet.addresses.some(a => a === address)) {
            throw new Error(`Current account address is not found in ${walletName} wallet`);
        }

        // rigt now other permission level does not happen
        // if (wallet.permissions.key === 1) {
        const key = openWalletPair.keyStore.exportPrivateKey(
            address,
            openWalletPair.wallet.secret.key
        );
        // }

        return key;
    }

};
