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
import Item from './item';
import FileItem from './fileItem';
import DappfileItem from './dappfileItem';
import AccountsItem from './accountsItem';
import AccountItem from './accountItem';
import ContractsItem from './contractsItem';
import ContractItem from './contractItem';
import WalletsItem from './walletsItem';
import WalletItem from './walletItem';
import EnvironmentsItem from './environmentsItem';
import EnvironmentItem from './environmentItem';
import { IconConfigure } from '../../../icons';

import Backend from '../backend';
import TransactionLogData from '../../sidePanels/blockexplorer/transactionlogdata';

export default class ProjectItem extends Item {
    constructor(props, router, functions) {
        props.state = props.state || {};
        props.type = props.type || 'project';
        props.classes = props.classes || ['project'];
        super(props, router, functions);
        this.props.state.project = this;
        this.props.state.toggable = false;
        this.props.state.open = true;
        this.backend = new Backend();
        this.props.state.txLog = new TransactionLogData({
            functions: functions,
            project: this,
        });
    }

    getTxLog = () => {
        return this.props.state.txLog;
    };

    getInode = () => {
        return this.props.inode;
    };

    getTitle = () => {
        const dappfile = this._getDappfile();
        if (dappfile) {
            return dappfile.getTitle();
        }
        return this.props.state.title || '';
    };

    getHeaderTitle = () => {
        return 'Project Settings';
    }

    getIcon = () => {
        return <IconConfigure />;
    };

    getName = () => {
        const dappfile = this._getDappfile();
        if (dappfile) {
            return dappfile.getName();
        }
        return this.props.state.name || '';
    };

    getAccount = () => {
        const accountsItem = this.getHiddenItem('accounts');
        const firstAccount = accountsItem.getChildren()[0];
        const defaultAccount = firstAccount
            ? firstAccount.getName()
            : 'Default';
        const chosen = accountsItem.getChosen() || defaultAccount;
        return chosen;
    };

    /**
     * Get the ContractItem by source,
     * create it if not existing.
     *
     */
    getContract = source => {
        const contractsItem = this.getHiddenItem('contracts');
        var contractItem = contractsItem.getBySource(source);
        if (!contractItem) {
            // Let's create this item
            const a = source.match('^(.*)/([^/]+)([.][Ss][Oo][Ll])$');
            if (a) {
                const name = a[2];
                const file = name + a[3];
                const args = [];
                contractItem = new ContractItem(
                    {
                        state: {
                            key: file,
                            source: source,
                            file: file,
                            title: file,
                            name: name,
                            args: args,
                            toggable: true,
                            project: this,
                        },
                        // This is to handle a special case when a non .sol file is renamed into a .sol file.
                        // Since the file item already exsts and it's props will overwrite these new props.
                        _preserveProps: ['source', 'name', 'args', 'toggable', 'children'],
                        renameFile: this.props.renameFile
                    },
                    this.router
                );
                // Update dappfile.
                this.addContract(name, source, args);

                contractsItem.props.state._children.push(contractItem);
            }
        }
        return contractItem;
    };

    getEndpoint = network => {
        const endpoint = (this.functions.networks.endpoints[network] || {})
            .endpoint;
        return endpoint;
    };

    delete = cb => {
        this.backend.deleteProject(this.getInode(), cb);
    };

    /**
     * Check if all files in the project are in a saved state.
     **/
    isSaved = () => {
        // TODO: traverse all cached children and check the files if they are not saved.
        return true;
    };

    /**
     * Prepare the project for being used by
     * loading the dappfile into cache and initializing the filesystem.
     *
     */
    load = cb => {
        const finalize = () => {
            const fileItem = new FileItem(
                {
                    type: 'folder',
                    lazy: true,
                    classes: ['files'],
                    state: {
                        key: '',
                        open: true,
                        title: 'Files',
                        file: '',
                        project: this,
                    },
                    renameFile: this.props.renameFile
                },
                this.router,
                this.functions
            );
            this.setChildren([fileItem]);

            const accountsItem = this._getAccountsItem();
            this.setHiddenItem('accounts', accountsItem);

            const environmentsItem = this._getEnvironmentsItem();
            this.setHiddenItem('environments', environmentsItem);

            const walletsItem = this._getWalletsItem();
            this.setHiddenItem('wallets', walletsItem);

            const contractsItem = this._getContractsItem();
            this.setHiddenItem('contracts', contractsItem);

            // Traverse the file structure to get `/dappfile.json`, this will prepare the file tree
            // so that the file `/dappfile.json` will get represented by the DappfileItem item created prior.
            this.getItemByPath(['', 'dappfile.json'], this)
                .then(item => {
                    cb(0);
                })
                .catch((e) => {
                    console.log(e);
                    alert('Error: Could not load dappfile.json.');
                });
        };

        const dappfileItem = new DappfileItem(
            {
                state: {
                    key: 'dappfile.json',
                    title: 'dappfile.json',
                    file: 'dappfile.json',
                    project: this,
                },
            },
            this.router
        );

        // Create the Dappfile item directly, so we make sure that the dappfile.json does exist.
        dappfileItem
            .load()
            .then(ret => {
                // Save it as a hidden item to be used later as a visible item.
                this.setHiddenItem('dappfile', dappfileItem);
                finalize();
            })
            .catch(err => {
                console.error('Dappfile not accessible.', err);
                cb(1);
            });
    };

    /**
     * Return the dappfile item.
     *
     */
    _getDappfile = () => {
        const dappfileItem = this.getHiddenItem('dappfile');
        if (dappfileItem) {
            return dappfileItem.getDappfile();
        }
    };

    /**
     * Save the dappfile to storage.
     * This should be called after updating the dappfile.
     *
     */
    saveDappfile = () => {
        return this.getHiddenItem('dappfile').save();
    };

    /**
     * List files below path.
     *
     */
    listFiles = (path, cb) => {
        this.backend.listFiles(this.getInode(), path, cb);
    };

    /**
     * Find item by it's file path.
     * Will load and wait for children as necessary.
     * @param path: array of dirs/filename to get to from given item.
     * @param item: current item who's children we are traversing.
     *
     */
    getItemByPath = (path, item) => {
        return new Promise((resolve, reject) => {
            const filename = path.shift();

            item.getChildren(true, () => {
                const children = item.getChildren();
                for (let index = 0; index < children.length; index++) {
                    const child = children[index];
                    if (child.getFile() == filename) {
                        if (path.length == 0) {
                            resolve(child);
                        } else {
                            this.getItemByPath(path, child)
                                .then(item => {
                                    resolve(item);
                                })
                                .catch(() => {
                                    reject("Path not found");
                                });
                        }
                        return;
                    }
                }
                reject("Path not found");
            });
        });
    };

    /**
     * Create and return the EnvironmentsItem.
     */
    _getEnvironmentsItem = () => {
        var environmentsItem;
        const environmentsChildren = () => {
            // Newly generated children, which we copy state over to.
            const children = [];
            const environments = this._getDappfile().environments();
            for (let index = 0; index < environments.length; index++) {
                var environment = environments[index];
                var childItem = new EnvironmentItem({
                    state: {
                        key: environment.name,
                        title: environment.name,
                        name: environment.name,
                        project: this,
                    },
                });
                children.push(childItem);
            }
            // Copy over the state from cached children to new children, so they appear to be the same (but the objects are new).
            environmentsItem._copyState(
                children,
                environmentsItem.props.state._children || []
            );

            // Save cache generated.
            environmentsItem.props.state._children = children;
            return children;
        };

        environmentsItem = new EnvironmentsItem({
            state: {
                project: this,
                children: environmentsChildren,
            },
        });

        return environmentsItem;
    };

    /**
     * Create and return the ContractsItem.
     */
    _getContractsItem = () => {
        var contractsItem;
        const contractsChildren = () => {
            // Newly generated children, which we copy state over to.
            const children = [];
            const contracts = this._getDappfile().contracts();
            for (let index = 0; index < contracts.length; index++) {
                var contract = contracts[index];
                const file = contract.source.match('^.*/([^/]+)$')[1];
                var childItem = new ContractItem(
                    {
                        state: {
                            key: file,
                            source: contract.source,
                            file: file,
                            title: file,
                            name: contract.name,
                            args: contract.args,
                            project: this,
                        },
                        renameFile: this.props.renameFile
                    },
                    this.router
                );
                children.push(childItem);
            }
            // Copy over the state from cached children to new children, so they appear to be the same (but the objects are new).
            // NOTE: we are using the key 'source' for comparing these items with eachother because this is a flat list
            // and the actually file structure is an hierarchical tree where key is just the filename, but since we have
            // a flat list here we need to key of the full path.
            contractsItem._copyState(
                children,
                contractsItem.props.state._children || [],
                'source'
            );

            // Save cache generated.
            contractsItem.props.state._children = children;
            return children;
        };

        contractsItem = new ContractsItem({
            state: {
                project: this,
                children: contractsChildren,
            },
        });

        return contractsItem;
    };

    /**
     * Create and return the WalletsItem.
     */
    _getWalletsItem = () => {
        var walletsItem;
        const walletsChildren = () => {
            // Newly generated children, which we copy state over to.
            const children = [];
            const wallets = this._getDappfile().wallets();
            for (let index = 0; index < wallets.length; index++) {
                var wallet = wallets[index];
                var childItem = new WalletItem({
                    state: {
                        key: wallet.name,
                        walletType: wallet.type,
                        title: wallet.name,
                        name: wallet.name,
                        desc: wallet.desc,
                        project: this,
                    },
                });
                children.push(childItem);
            }
            // Copy over the state from cached children to new children, so they appear to be the same (but the objects are new).
            walletsItem._copyState(
                children,
                walletsItem.props.state._children || []
            );

            // Save cache generated.
            walletsItem.props.state._children = children;
            return children;
        };

        walletsItem = new WalletsItem({
            state: {
                project: this,
                children: walletsChildren,
            },
        });

        return walletsItem;
    };

    /**
     * Create and return the AccountsItem.
     */
    _getAccountsItem = () => {
        var accountsItem;
        const accountsChildren = () => {
            // Newly generated children, which we copy state over to.
            const children = [];
            const accounts = this._getDappfile().accounts();
            for (let index = 0; index < accounts.length; index++) {
                var account = accounts[index];
                var childItem = new AccountItem({
                    state: {
                        key: account.name,
                        _environments: account._environments,
                        title: account.name,
                        name: account.name,
                        project: this,
                    },
                });
                children.push(childItem);
            }
            // Copy over the state from cached children to new children, so they appear to be the same (but the objects are new).
            accountsItem._copyState(
                children,
                accountsItem.props.state._children || []
            );

            // Save cache generated.
            accountsItem.props.state._children = children;
            return children;
        };

        accountsItem = new AccountsItem({
            state: {
                project: this,
                children: accountsChildren,
            },
        });

        return accountsItem;
    };

    newFile = (path, file, cb) => {
        this.backend.newFile(this.getInode(), path, file, cb);
    };

    newFolder = (path, file, cb) => {
        this.backend.newFolder(this.getInode(), path, file, cb);
    };

    moveFile = (sourcePath, targetPath, cb) => {
        this.backend.moveFile(this.getInode(), sourcePath, targetPath, cb);
    };

    deleteFile = (fullpath, cb) => {
        this.backend.deleteFile(this.getInode(), fullpath, cb);
    };

    loadFile = (file, cb) => {
        this.backend.loadFile(this.getInode(), file, cb);
    };

    saveFile = (path, contents, cb) => {
        this.backend.saveFile(
            this.getInode(),
            { contents: contents, path: path },
            cb
        );
    };

    /************************** Dappfile operations ***************************/
    /** Only use these functions to alter the dappfile **/

    /**
     * Set the name of the dapp.
     */
    setName = (name, cb) => {
        const dappfile = this._getDappfile();
        dappfile.setName(name);

        this.saveDappfile()
            .then(() => {
                if (cb) cb(0);
            })
            .catch(() => {
                alert('Could not save dappfile.');
                if (cb) cb(1);
            });
    };

    /**
     * Set the title of the dapp.
     */
    setTitle = (title, cb) => {
        const dappfile = this._getDappfile();
        dappfile.setTitle(title);

        this.saveDappfile()
            .then(() => {
                if (cb) cb(0);
            })
            .catch(() => {
                alert('Could not save dappfile.');
                if (cb) cb(1);
            });
    };

    /**
     * Add a new account to the dappfile.
     *
     */
    addAccount = cb => {
        const dappfile = this._getDappfile();
        var name;
        for (var index = 1; index < 100000; index++) {
            name = 'Account' + index;
            if (
                dappfile.accounts().filter(c => {
                    return c.name == name;
                }).length == 0
            ) {
                break;
            }
        }

        var browserIndex = 0;
        var customIndex = 0;
        var dirty;
        do {
            dirty = false;
            dappfile.accounts().map(item => {
                const account = dappfile.getItem('accounts', [
                    { name: item.name },
                ]);
                var index = parseInt(account.get('index', 'browser'));
                if (!isNaN(index) && index == browserIndex) {
                    browserIndex = index + 1;
                    dirty = true;
                }
                var index = parseInt(account.get('index', 'custom'));
                if (!isNaN(index) && index == customIndex) {
                    customIndex = index + 1;
                    dirty = true;
                }
            });
        } while (dirty);

        dappfile.accounts().push({
            name: name,
            address: '0x0',
        });
        const account = dappfile.getItem('accounts', [{ name: name }]);
        account.set('wallet', 'development', 'browser');
        account.set('index', browserIndex, 'browser');
        account.set('wallet', 'private', 'custom');
        account.set('index', browserIndex, 'custom');

        this.saveDappfile()
            .then(() => {
                if (cb) cb(0);
            })
            .catch(() => {
                alert('Could not save dappfile.');
                if (cb) cb(1);
            });
    };

    /**
     * Delete an account from the dappfile.
     */
    deleteAccount = (index, cb) => {
        const dappfile = this._getDappfile();
        const account = dappfile.accounts().splice(index, 1)[0];

        // Go through all contracts arguments and replace account argument with "0x0".
        const contracts = dappfile.contracts();
        contracts.map(contract => {
            const args = contract.args || [];
            args.map(arg => {
                if (arg.account && arg.account == account.name) {
                    delete arg.account;
                    arg.value = '0x0';
                }
            });
            // NOTE: We do this synchronously now since we know we are dealing with localStorage.
            this.setContractArgs(contract.source, args);
        });

        this.saveDappfile()
            .then(() => {
                if (cb) cb(0);
            })
            .catch(() => {
                alert('Could not save dappfile.');
                if (cb) cb(1);
            });
    };

    setAccountName = (oldname, newname, cb) => {
        const dappfile = this._getDappfile();
        dappfile.accounts().map(account => {
            if (account.name == oldname) {
                account.name = newname;
            }
        });

        // Go through all contracts arguments and replace old account name with new name.
        const contracts = dappfile.contracts();
        contracts.map( (contract) => {
            const args = contract.args || [];
            args.map( (arg) => {
                if (arg.account && arg.account == oldname) {
                    arg.account = newname;
                }
            });
            // NOTE: We do this synchronously now since we know we are dealing with localStorage.
            this.setContractArgs(contract.source, args);
        });

        this.saveDappfile()
            .then(() => {
                if (cb) cb(0);
            })
            .catch((e) => {
                alert('Could not save dappfile (account).');
                if (cb) cb(1);
            });
    };

    setAccountAddress = (name, address, env, cb) => {
        const dappfile = this._getDappfile();
        const account = dappfile.getItem('accounts', [{ name: name }]);
        account.set('address', address, env);

        this.saveDappfile()
            .then(() => {
                if (cb) cb(0);
            })
            .catch(() => {
                alert('Could not save dappfile.');
                if (cb) cb(1);
            });
    };

    /**
     * Add a new contract to the dappfile.
     */
    addContract = (name, source, args, cb) => {
        const dappfile = this._getDappfile();

        dappfile.contracts().push({
            source: source,
            name: name,
            args: args,
        });

        this.saveDappfile()
            .then(() => {
                if (cb) cb(0);
            })
            .catch(() => {
                alert('Could not save dappfile.');
                if (cb) cb(1);
            });
    };

    /**
     * Delete a contract from the dappfile.
     */
    deleteContract = (source, cb) => {
        const dappfile = this._getDappfile();

        var index = -1,
            counter = 0;
        dappfile.contracts().map(contract => {
            if (contract.source == source) {
                index = counter;
            }
            counter++;
        });
        if (index > -1) {
            dappfile.contracts().splice(index, 1);
        }

        // Go through all contracts arguments and replace contract source with value 0x0
        const contracts = dappfile.contracts();
        contracts.map( (contract) => {
            const args = contract.args || [];
            args.map( (arg) => {
                if (arg.contract && arg.contract == source) {
                    delete arg.contract;
                    arg.value = "0x0";
                }
            });

            // NOTE: We do this synchronously now since we know we are dealing with localStorage.
            this.setContractArgs(contract.source, args);
        });

        this.saveDappfile()
            .then(() => {
                if (cb) cb(0);
            })
            .catch(() => {
                alert('Could not save dappfile.');
                if (cb) cb(1);
            });
    };

    moveContract = (source, newSource, cb) => {
        const dappfile = this._getDappfile();
        const contract = dappfile.getItem('contracts', [{ source: source }]);
        contract.set('source', newSource);

        // Go through all contracts arguments and replace contract source with new value.
        const contracts = dappfile.contracts();
        contracts.map( (contract) => {
            const args = contract.args || [];
            args.map( (arg) => {
                if (arg.contract && arg.contract == source) {
                    arg.contract = newSource;
                }
            });
            // NOTE: We do this synchronously now since we know we are dealing with localStorage.
            this.setContractArgs(contract.source, args);
        });

        this.saveDappfile()
            .then(() => {
                if (cb) cb(0);
            })
            .catch(() => {
                alert('Could not save dappfile.');
                if (cb) cb(1);
            });
    };

    setContractName = (source, newName, cb) => {
        const dappfile = this._getDappfile();
        const contract = dappfile.getItem('contracts', [{ source: source }]);
        contract.set('name', newName);

        this.saveDappfile().then( () => {
            if (cb) cb (0);
        }).catch( () => {
            alert('Could not save dappfile (contract name).');
            if (cb) cb (1);
        });
    };

    setContractArgs = (source, args, cb) => {
        const dappfile = this._getDappfile();
        const contract = dappfile.getItem('contracts', [{ source: source }]);
        contract.set('args', args);

        this.saveDappfile().then( () => {
            if (cb) cb (0);
        }).catch( () => {
            alert('Could not save dappfile (contract args).');
            if (cb) cb (1);
        });
    };

    /**************************************************************************/
}
