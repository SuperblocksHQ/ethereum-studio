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

import FileItem from './fileItem';
import Dappfile from '../dappfile';

export default class DappfileItem extends FileItem {
    constructor(props, router) {
        props.type2 = props.type2 || 'dappfile';
        props.state.file = props.state.file || 'dappfile.json';
        props.state.title = props.state.title || 'dappfile.json';
        super(props, router);

        this.props.state.contents = '{}';
        this.setReadOnly(true);

        // NOTE (FIXME): this is how I shadow parent functions. simply `super.load()` didn't work for me.
        this._load = this.load;
        this.load = this.__load;
        delete this.__load;
        this._save = this.save;
        this.save = this.__save;
        delete this.__save;
        this._setContents = this.setContents;
        this.setContents = this.__setContents;
        delete this.__setContents;
    }

    /**
     * Load the Dappfile.json contents from storage.
     * Note: This actually shadows super.load.
     *
     */
    __load = () => {
        return new Promise((resolve, reject) => {
            this._load()
                .then(() => {
                    // Decode JSON
                    try {
                        const dappfileObj = JSON.parse(this.getContents());
                        if (!Dappfile.validateDappfile(dappfileObj)) {
                            throw 'Invalid dappfile.json.';
                        }
                        this.props.state.dappfile = new Dappfile(dappfileObj);
                    } catch (e) {
                        console.error(e);
                        this.props.state.dappfile = new Dappfile();
                    }
                    resolve();
                })
                .catch(() => {
                    this.props.state.dappfile = new Dappfile(
                        DappfileItem.getDefaultDappfile()
                    );
                    this.save()
                        .then(() => {
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
        });
    };

    /**
     * Save the Dappfile.json contents to storage.
     * Note: This actually shadows super.save.
     *
     */
    __save = () => {
        this._setContents(this.getDappfile().dump());
        return this._save();
    };

    /**
     * Note: This actually shadows super.setContents.
     */
    __setContents = (contents) => {
        try {
            const obj = JSON.parse(contents);
            if (DappfileItem.validateDappfile(obj)) {
                this.props.state.dappfile = new Dappfile(obj);
                this._setContents(JSON.stringify(obj, null, 4));
                return;
            }
        }
        catch(e) {
        }
        console.error('Dappfile data invalid.');
    };

    getDappfile = () => {
        return this.props.state.dappfile;
    };

    static validateDappfile = (dappfile) => {
        const defDappfile = DappfileItem.getDefaultDappfile();

        if (!dappfile.project) {
            dappfile.project = defDappfile.project;
        }

        if (!dappfile.environments) {
            dappfile.environments = defDappfile.environments;
        }

        if (!dappfile.wallets) {
            dappfile.wallets = defDappfile.wallets;
        }

        if (!dappfile.accounts) {
            dappfile.accounts = defDappfile.accounts;
        }

        return true;
    };

    static getDefaultDappfile = () => {
        const obj = {
            project: {
                info: {},
            },
            environments: [
                {
                    name: 'browser',
                },
                {
                    name: 'custom',
                },
                {
                    name: 'rinkeby',
                },
                {
                    name: 'ropsten',
                },
                {
                    name: 'kovan',
                },
                {
                    name: 'infuranet',
                },
                {
                    name: 'mainnet',
                },
            ],
            contracts: [],
            wallets: [
                {
                    desc: 'This is a wallet for local development',
                    name: 'development',
                },
                {
                    desc: 'A private wallet',
                    name: 'private',
                },
                {
                    desc:
                        'External wallet integrating with Metamask and other compatible wallets',
                    name: 'external',
                    type: 'external',
                },
            ],
            accounts: [
                {
                    name: 'Default',
                    _environments: [
                        {
                            name: 'browser',
                            data: {
                                wallet: 'development',
                                index: 0,
                            },
                        },
                        {
                            name: 'custom',
                            data: {
                                wallet: 'private',
                                index: 0,
                            },
                        },
                        {
                            name: 'rinkeby',
                            data: {
                                wallet: 'external',
                                index: 0,
                            },
                        },
                        {
                            name: 'ropsten',
                            data: {
                                wallet: 'external',
                                index: 0,
                            },
                        },
                        {
                            name: 'kovan',
                            data: {
                                wallet: 'external',
                                index: 0,
                            },
                        },
                        {
                            name: 'infuranet',
                            data: {
                                wallet: 'external',
                                index: 0,
                            },
                        },
                        {
                            name: 'mainnet',
                            data: {
                                wallet: 'external',
                                index: 0,
                            },
                        },
                    ],
                },
            ],
        };
        return obj;
    };
}
