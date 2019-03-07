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

import sha256 from 'crypto-js/sha256';
import Networks from '../../networks';
import * as analytics from '../../utils/analytics';
import { getWeb3 } from '../utils';

import Tx from 'ethereumjs-tx';
import Buffer from 'buffer';

export default class DeployerRunner {

    constructor(account,
                showExternalProviderModal,
                closeExternalProviderModal,
                showMainnetWarning,
                networkPreferences,
                item,
                log) {
        this.account = account;
        this.showExternalProviderModal = showExternalProviderModal;
        this.closeExternalProviderModal = closeExternalProviderModal;
        this.showMainnetWarning = showMainnetWarning;
        this.networkPreferences = networkPreferences;
        this.item = item;
        this.log = log;

        this.isRunning = false;
    }

    run(e, selectedEnvironment) {
        const env = selectedEnvironment.name;
        // const contract = this.item.getParent();
        const src = contract.getSource();
        this.network = env;

        const obj = {
            web3: getWeb3(selectedEnvironment.endpoint),
            endpoint: selectedEnvironment.endpoint,
            network: this.network,
            gasPrice: "0x".concat(Number(this.networkPreferences.gasPrice).toString(16)),
            gasLimit: "0x".concat(Number(this.networkPreferences.gasLimit).toString(16)),
            recompile: this.recompile, // ?
            redeploy: false,
            env,
            tag: env,
            src,
            // abisrc: this._makeFileName(src, '', 'abi'),
            // binsrc: this._makeFileName(src, '', 'bin'),
            // hashsrc: this._makeFileName(src, '', 'hash'),
            // metasrc: this._makeFileName(src, '', 'meta'),
            // addresssrc: this._makeFileName(src, this.network, 'address'),
            // txsrc: this._makeFileName(src, this.network, 'tx'),
            // deploysrc: this._makeFileName(src, this.network, 'deploy'),
            // contractsjssrc: this._makeFileName(src, this.network, 'js'),
            args: [] // string array - should be done by reducer
        };

        const walletName = account.getWallet(env);
        const wallets = this.item.getProject().getHiddenItem('wallets');
        const wallet = wallets.getByName(walletName);

        this._buildBin(obj, status => {
            if (status !== 0) {
                this.callback(1);
                return;
            }
            const walletType = wallet.getWalletType();
            if (accountInfo.type === 'metamask') { // walletType == 'external'
                ///////////////////////////////////////////////
                // SWAP THE WEB3 OBJECT FOR THE EXTERNAL ONE //
                ///////////////////////////////////////////////
                if (window.web3) {
                    this._stdwarn(
                        'Switching to external provider, endpoint is now unknown.'
                    );
                    obj.internalweb3 = obj.web3;
                    obj.web3 = window.web3;
                } else {
                    this._stderr('External provider not found.');
                    this.callback(1);
                    return;
                }
            }
            this._checkDeploy(obj, status => {
                // if (status == 1) {
                //     // Do not redeploy, all good.
                //     this.callback(0);
                //     return;
                // }
                // if (status != 0) {
                //     this.callback(1);
                //     return;
                // }
                const finalize = obj => {
                    this._stdout(
                        'Waiting for contract to be deployed...'
                    );
                    this._waitContract(obj, status => {
                        analytics.logEvent('CONTRACT_DEPLOYED', { network: env });
                        this._buildJs(obj, status => {
                            if (status != 0) {
                                this.callback(1);
                                return;
                            }
                            this._saveFiles(obj, status => {
                                if (status != 0) {
                                    this.callback(1);
                                    return;
                                }
                                this.callback(0);
                            });
                        });
                    });
                };
                if (walletType === 'external') {
                    // Check the Metamask network so that it matches
                    const chainId = (Networks[this.network] || {}).chainId;
                    if (chainId && window.web3.version.network !== chainId) {
                        this._stderr("The Metamask network does not match the Superblocks Lab network. Check so that you have the same network chosen in Metamask as in Superblocks Lab, then try again.");
                        this.callback(1);
                        return;
                    }

                    const params={
                        from: this.account.address,
                        to: "",
                        value: "0x0",
                        gasPrice: obj.gasPrice,
                        gasLimit: obj.gasLimit,
                        data: obj.bin2,
                    };
                    this._stdout("External account detected. Opening external account provider...");

                    if (window.web3.version.network === Networks.mainnet.chainId && this.props.functions.networks.endpoints[this.network].chainId === Networks.mainnet.chainId) {
                        console.log("Deploying to Mainnet!");
                        this.showMainnetWarning()
                            .then(() => this._sendExternalTransaction(obj, params, finalize))
                            .catch(() => {
                                this._stderr("Deployment to Mainnet cancelled");
                                this.callback(1);
                            });
                    } else {
                        this._sendExternalTransaction(obj, params, finalize)
                    }
                } else {
                    this._openWallet(
                        obj,
                        this.account.name,
                        status => {
                            if (status != 0) {
                                this.callback(1);
                                return;
                            }
                            this._getNonce(obj, status => {
                                if (status != 0) {
                                    this.callback(1);
                                    return;
                                }
                                this._sign(obj, status => {
                                    if (status != 0) {
                                        this.callback(1);
                                        return;
                                    }
                                    this._sendTx(obj, status => {
                                        if (status != 0) {
                                            this.callback(1);
                                            return;
                                        }
                                        finalize(obj);
                                    });
                                });
                            });
                        }
                    );
                }
            });
        });
    }

    _sendExternalTransaction(obj, params, finalize) {
        this.showExternalProviderModal();

        obj.web3.eth.sendTransaction(params, (err,res) => {
            this.closeExternalProviderModal();
            if (err) {
                this._stderr("Could not deploy contract using external provider.");
                console.error(res);
                this.callback(1);
                return;
            }
            this._stdout("Got receipt: " + res);
            obj.txhash2 = res;
            const args = (obj.contract.getArgs() || []).slice(0); // We MUST copy the array since we are shifting out the elements.
            this.item.getProject().getTxLog().addTx({
                deployArgs: args,
                contract: this.props.item
                    .getParent()
                    .getName(),
                hash: res,
                context: 'Contract deployment using external provider',
                network: obj.network,
            });
            finalize(obj);
        });
    }

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

    _compile = cb => {
        const subitem = this.item
            .getParent()
            .getChildren()
            .filter(elm => {
                return elm.getType2() == 'compile';
            })[0];
        if (subitem)
            this.props.router.panes.openItem(
                subitem,
                this.props.parent.props.parent.props.id,
                cb
            );
    };

    callback = status => {
        this._stop();
        const callback = this.props.parent.callback;
        delete this.props.parent.callback;
        // this.props.router.control.redrawMain(true);
        if (callback) callback(status);
    };

    _stderr(msg) {
        this.log(msg, 2);
    }

    _stdwarn(msg) {
        this.log(msg, 3);
    }

    _stdout(msg) {
        this.log(msg, 1);
    }

    _stop(msg) {
        this.isRunning = false;
        this.updateStatus(msg);
    }

    _buildArgs2 = (obj, args, args2, env, tag, cb) => {
        if (args.length == 0) {
            cb(0);
            return;
        }
        const arg = args.shift();
        if (arg.value !== undefined) {
            args2.push(arg.value);
            cb(0);
            return;
        } else if(arg.array !== undefined) {
            args2.push(arg.array.split(','));
            cb(0);
            return;
        } else if (arg.account) {
            const accountName = arg.account;
            const accounts = this.item
                .getProject()
                .getHiddenItem('accounts');
            const account = accounts.getByName(accountName);
            if (!account) {
                this._stderr(
                    'Account ' +
                        (accountName || '') +
                        ' is referred to as constructor argument to the contract, but the account does not exist. Please reconfigure the contract.'
                );
                cb(1);
                return;
            }
            const accountIndex = account.getAccountIndex(env);
            const walletName = account.getWallet(env);
            const wallets = this.item
                .getProject()
                .getHiddenItem('wallets');
            const wallet = wallets.getByName(walletName);
            if (!wallet) {
                // We expect a static value to have been set as the account address.
                const accountAddress = account.getAddress(env);
                if (!accountAddress) {
                    this._stderr(
                        'Wallet/Address not found for account: ' + accountName
                    );
                    cb(1);
                } else {
                    args2.push(accountAddress);
                    cb(0);
                }
                return;
            }
            const walletType = wallet.getWalletType();
            if (walletType == 'external') {
                if (!window.web3) {
                    this._stderr(
                        'External provider not found for passing accounts as constructor arguments. Metamask not installed?'
                    );
                    cb(1);
                    return;
                }
                const extAccounts = window.web3.eth.accounts || [];
                if (extAccounts.length == 0) {
                    this._stderr(
                        'No external accounts found. Metamask unlocked?'
                    );
                    cb(1);
                    return;
                } else if (extAccounts.length < accountIndex + 1) {
                    this._stderr(
                        'External account ' +
                            accountName +
                            " has too high index, can't provide it as constructor argument (Metamask only unlocks one account)."
                    );
                    cb(1);
                    return;
                }
                args2.push(extAccounts[accountIndex]);
                cb(0);
            } else {
                const obj2 = { env: env };
                this._openWallet(obj2, arg.account, status => {
                    if (status == 0) {
                        args2.push(obj2.account.address);
                        cb(0);
                        return;
                    } else {
                        cb(1);
                        return;
                    }
                });
            }
        } else if (arg.contract) {
            const src = arg.contract;
            const contracts = this.item
                .getProject()
                .getHiddenItem('contracts');
            const contract = contracts.getBySource(arg.contract);
            if (!contract) {
                this._stderr(
                    'Contract ' +
                        arg.contract +
                        " is referenced as argument but doesn't exist."
                );
                cb(1);
                return;
            }

            const txsrc = this._makeFileName(src, this.network, 'tx');
            const deploysrc = this._makeFileName(src, this.network, 'deploy');
            const addresssrc = this._makeFileName(src, this.network, 'address');
            const files = [txsrc, addresssrc, deploysrc];
            this._loadRawFiles(files, (status, bodies) => {
                if (status > 0) {
                    this._stderr(
                        'Contract ' +
                            arg.contract +
                            ' is referenced as argument but is not deployed and therefore has no address. Deploy it prior to deploying this contract.'
                    );
                    cb(1);
                    return;
                }
                const txhash = bodies[2];
                const address = bodies[1];
                const code = bodies[0];
                this._verifyContract(obj, address, txhash, code, status => {
                    if (status > 0) {
                        this._stderr(
                            'Contract ' +
                                arg.contract +
                                ' is referenced as argument but it needs to be redeployed (on the same network). Redeploy it prior to deploying this contract.'
                        );
                        cb(1);
                        return;
                    }
                    args2.push(address);
                    cb(0);
                    return;
                });
            });
        } else {
            cb(1);
            return;
        }
    }

    _verifyContract(obj, address, tx, code, cb) {
        this._getInputByTx(obj, tx, (status, input) => {
            if (status > 0) {
                cb(1);
                return;
            }
            if (input == code) {
                cb(0);
                return;
            }
            cb(1);
            return;
        });
    };

    _loadRawFiles(files, cb) {
        const bodies = [];
        var fn;
        fn = (files, bodies, cb2) => {
            if (files.length == 0) {
                cb2(0);
                return;
            }
            const file = files.pop();
            this.item.getProject().loadFile(
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
    }

    _buildBin(obj, cb) {
        var contract = null;
        var parsedABI;
        try {
            parsedABI = JSON.parse(obj.abi);
        } catch (e) {
            this._stderr(
                'Could not parse ABI file. ' +
                    e.toString()
            );
            cb(1);
            return;
        }
        contract = obj.web3.eth.contract(parsedABI);
        const args = obj.args.concat([{ data: obj.bin }]);
        var bin2;
        var err = '';
        try {
            bin2 = contract.new.getData.apply(contract, args);
        } catch (e) {
            err = e.toString();
            bin2 = null;
        }
        if (bin2 == null || (bin2 == obj.bin && obj.args.length > 0)) {
            // Error
            this._stderr(
                'Constructor arguments given are not valid. Too many/few or wrong types. ' +
                    err
            );
            cb(1);
            return;
        }
        obj.bin2 = bin2;
        cb(0);
    }

    _getInputByTx(obj, tx, cb) {
        obj.web3.eth.getTransaction(tx, (err, res) => {
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
    }

    _checkDeploy(obj, cb) {
        if (obj.txhash && obj.deploy) {
            if (obj.deploy == obj.bin2) {
                this._getInputByTx(obj, obj.txhash, (status, input) => {
                    if (status > 0) {
                        this._stdout(
                            'Contract not found at address, redeploying..'
                        );
                        cb(0);
                        return;
                    }
                    if (input == obj.bin2) {
                        this._stdout(
                            'Contract on chain is the same, not redeploying.'
                        );
                        this._stdout('Done.');
                        cb(1);
                        return;
                    } else {
                        this._stdout(
                            'Contract on chain is different, redeploying.'
                        );
                        cb(0);
                        return;
                    }
                });
            } else {
                this._stdout('Contract has changed, redeploying..');
                cb(0);
                return;
            }
        } else {
            cb(0);
        }
    }

    _openWallet(obj, accountName, cb) {
        const accounts = this.item.getProject().getHiddenItem('accounts');
        const account = accounts.getByName(accountName);
        const accountIndex = account.getAccountIndex(obj.env);
        const walletName = account.getWallet(obj.env);

        const getKey = () => {
            this.props.functions.wallet.getKey(walletName, accountIndex, (status, key) => {
                if (status == 0) {
                    const address = this.props.functions.wallet.getAddress(walletName, accountIndex);
                    obj.account = {
                        address: address,
                        key: key
                    };
                    cb(0);
                    return;
                } else {
                    const msg = "Could not get key from wallet for address " + address + ".";
                    this._stderr(msg);
                    cb(1);
                    return;
                }
            });
        };

        if (this.props.functions.wallet.isOpen(walletName)) {
            getKey();
        } else {
            this.props.functions.wallet.openWallet(walletName, null, (status) => {
                if (status == 0) {
                    getKey();
                } else if (status == 2) {
                    this._stderr("Bad seed entered.");
                    cb(1);
                    return;
                } else {
                    this._stderr("Could not open wallet.");
                    cb(1);
                    return;
                }
            });
        }
    }

    _getNonce(obj, cb) {
        obj.web3.eth.getTransactionCount(obj.account.address, (err, res) => {
            if (err == null) {
                obj.account.nonce = res;
                this._stdout("Nonce for address " + obj.account.address + " is " + res + ".");
                cb(0);
                return;
            }
            this._stderr("Could not get nonce for address " + obj.account.address + ".");
            cb(1);
        });
    }

    async _sign(obj, cb) {
        const tx = new Tx({
            from: obj.account.address,
            to: "",
            //chainId: 333,
            value: "0x0",
            nonce: obj.account.nonce,
            gasPrice: obj.gasPrice,
            gasLimit: obj.gasLimit,
            data: obj.bin2,
        });
        tx.sign(Buffer.Buffer.from(obj.account.key, "hex"));
        obj.tx = tx;
        this._stdout("Transaction signed.");
        cb(0);
    }

    _sendTx(obj, cb) {
        this._stdout('Gaslimit=' + obj.gasLimit + ', gasPrice=' + obj.gasPrice + '.');
        this._stdout('Sending transaction to network ' + obj.network + ' on endpoint ' + obj.endpoint + '...');
        
        obj.web3.eth.sendRawTransaction(
            '0x' + obj.tx.serialize().toString('hex'),
            (err, res) => {
                if (err == null) {
                    this._stdout('Got receipt: ' + res);
                    obj.txhash2 = res;
                    const args = (obj.contract.getArgs() || []).slice(0); // We MUST copy the array since we are shifting out the elements.
                    this.item
                        .getProject()
                        .getTxLog()
                        .addTx({
                            deployArgs: args,
                            contract: this.item.getParent().getName(),
                            hash: res,
                            context: 'Contract deployment',
                            network: obj.network,
                        });
                    cb(0);
                } else {
                    this._stderr('Could not deploy contract: ' + err);
                    cb(1);
                }
            }
        );
    }

    _waitContract(obj, cb) {
        const receipt = obj.txhash2;
        obj.web3.eth.getTransactionReceipt(receipt, (err, res) => {
            if (err) {
                this._stderr('Could not deploy contract: ' + err);
                cb(1);
                return;
            }
            if (res == null || res.blockHash == null) {
                setTimeout(() => {
                    this._waitContract(obj, cb);
                }, 1000);
            } else {
                this._stdout('Transaction mined, verifying code...');
                obj.address2 = res.contractAddress;
                obj.deployMeta = { gasUsed: res.gasUsed };
                var counter = 10;
                const waitCode = () => {
                    obj.web3.eth.getCode(obj.address2, 'latest', (err, res) => {
                        if (err || !res || res.length < 4) {
                            if (counter-- == 0) {
                                // Final timeout
                                this._stderr(
                                    'Contract code could not be verified on chain. The contract might not have been deployed. This is possibly a mismatch in the number/type of arguments given to the constructor or could also be a temporary issue in reading back the contract code from the chain.'
                                );
                                cb(1);
                                return;
                            }
                            setTimeout(waitCode, 2000);
                            return;
                        }
                        this._stdout('Contract deployed at address ' + obj.address2 + '.');
                        this._stdout('Done.');
                        cb(0);
                    });
                };

                waitCode();
            }
        });
    }

    _buildJs(obj,cb) {
        obj.contractsjs =
            `/* Autogenerated - do not fiddle */
            if(typeof(Contracts)==="undefined") var Contracts={};
            (function(module, Contracts) {
                var data={
                    address: "` +
                        obj.address2 +
                    `",
                    network: "` +
                        obj.network +
                    `",
                    endpoint: "` +
                        obj.endpoint +
                    `",
                    abi: ` +
                        obj.abi +
                    `
            };
            Contracts["` + this.props.item.getParent().getName() + `"]=data;
            module.exports=data;
            })((typeof(module)==="undefined"?{}:module), Contracts);
            `;
        cb(0);
    }

    _saveFiles(obj,cb) {
        const project = this.item.getProject();
        const list = [
            {
                fullPath: obj.addresssrc,
                contents: obj.address2,
            },
            {
                fullPath: obj.deploysrc,
                contents: obj.bin2,
            },
            {
                fullPath: obj.contractsjssrc,
                contents: obj.contractsjs,
            },
            {
                fullPath: obj.txsrc,
                contents: obj.txhash2,
            },
        ];

        const fn = list => {
            const o = list.pop();
            if (!o) {
                cb(0);
                return;
            }
            var { fullPath, contents } = o;
            var a = fullPath.match('(.*/)([^/]+)');
            const path = a[1];
            const file = a[2];
            project.newFile(path, file, () => {
                project
                    .getItemByPath(fullPath.split('/'), project)
                    .then(item => {
                        item.setContents(contents);
                        item.save()
                            .then(() => {
                                cb(0);
                            })
                            .catch(cb(1));
                    })
                    .catch(() => {
                        cb(1);
                    });
            });
            fn(list);
        };

        fn(list);
    }
}
