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

import { h, Component } from 'preact';
import sha256 from 'crypto-js/sha256';
import classnames from 'classnames';
import style from './style-console';
import { iconRun, IconRun } from '../icons';
import Web3 from 'web3';
import Tx from '../../ethereumjs-tx-1.3.3.min.js';
import Modal from '../modal';

export default class Deployer extends Component {
    constructor(props) {
        super(props);
        this.id=props.id+"_deployer";
        this.props.parent.childComponent=this;
        this.consoleRows=[];
        this.dappfile = this.props.project.props.state.data.dappfile;
        this.recompile=this.props.recompile || false;
        this.redeploy=this.props.redeploy || false;
        this.run();
    }

    componentWillUnmount = () => {
    };

    componentWillReceiveProps(props) {
        this.dappfile = props.project.props.state.data.dappfile;
    }

    canClose = (cb) => {
        cb(0);
    };

    focus = (rePerform) => {
        if(rePerform) {
            if(!this.isRunning) {
                this.run();
            }
        }
    };

    _makeFileName=(path, tag, suffix)=>{
        const a = path.match(/^(.*\/)([^/]+)$/);
        const dir=a[1];
        const filename=a[2];
        return dir + "." + filename + "." + tag + "." + suffix;
    };

    _getWeb3=(endpoint)=>{
        var provider;
        if(endpoint.toLowerCase()=="http://superblocks-browser") {
            provider=this.props.functions.EVM.getProvider();
        }
        else {
            var provider=new Web3.providers.HttpProvider(endpoint);
        }
        var web3=new Web3(provider);
        return web3;
    };


    compile = (cb) => {
        const subitem = this.props.item.props._parentItem.getChildren().filter((elm) => {
            return (elm.props.type2=="compile");

        })[0];
        if(subitem) this.props.router.panes.openItem(subitem, this.props.parent.props.parent.props.id, cb);
    };

    callback = (status) => {
        var msg="Chilling down after task well done";
        if(status!=0) {
            msg="Failed in deploying your contract";
        }
        this._stop(msg);
        const callback=this.props.parent.callback;
        delete this.props.parent.callback;
        this.props.router.control._reloadProjects(null, null, true);
        if(callback) callback(status);
    };

    _stderr=(msg)=>{
        this.consoleRows.push({msg:msg,channel:2});
        this.redraw();
    };

    _stdwarn=(msg)=>{
        this.consoleRows.push({msg:msg,channel:3});
        this.redraw();
    };

    _stdout=(msg)=>{
        this.consoleRows.push({msg:msg,channel:1});
        this.redraw();
    };

    _stop=(msg)=>{
        this.isRunning=false;
        if(msg!=null) this.setState({status:msg});
        this.redraw();
    };

    run = (e) => {
        var redeploy=this.redeploy;
        if(e) {
            e.preventDefault();
            e.stopPropagation();  // Don't auto focus on the window.
            redeploy=true;
        }
        if(this.isRunning) return;
        this.isRunning=true;
        this.consoleRows.length=0;
        this.redraw();

        const env=this.props.project.props.state.data.env;
        const contract = this.dappfile.getItem("contracts", [{name: this.props.contract}]);
        const src=contract.get('source');
        const tag=env;
        this.network=env;

        const endpoint=(this.props.functions.networks.endpoints[this.network] || {}).endpoint;
        if(!endpoint) {
            this._stderr("No endpoint matched network " + this.network + ".");
            this.callback(1);
            return;
        }
        const obj={
            web3: this._getWeb3(endpoint),
            endpoint: endpoint,
            network: this.network,
            gasPrice: "0x3B9ACA00", //TODO
            gasLimit: "0x788B60", //TODO
            recompile: this.recompile,
            redeploy: redeploy,
            contract: contract,
            env: env,
            tag: tag,
            src: src,
            abisrc: this._makeFileName(src, tag, "abi"),
            binsrc: this._makeFileName(src, tag, "bin"),
            hashsrc: this._makeFileName(src, tag, "hash"),
            metasrc: this._makeFileName(src, tag, "meta"),
            addresssrc: this._makeFileName(src, tag+"."+this.network, "address"),
            txsrc: this._makeFileName(src, tag+"."+this.network, "tx"),
            deploysrc: this._makeFileName(src, tag, "deploy"),
            contractsjssrc: "/app/contracts/." + this.props.contract + "." + env + ".js",
        };

        this.accountName = this.props.project.props.state.data.account;
        if(!this.accountName || this.accountName == "(locked)") {
            this._stderr("No account chosen. Please choose an account for the network in the left menu.");
            this.callback(1);
            return;
        }
        const account = this.dappfile.getItem("accounts", [{name: this.accountName}]);
        const accountIndex=account.get('index', env);
        const walletName=account.get('wallet', env);
        const wallet = this.dappfile.getItem("wallets", [{name: walletName}]);
        if(!wallet) {
            this._stderr("Can not deploy with chosen account on public network. Choose the first account in the list.");
            this.callback(1);
            return;
        }

        this._buildArgs(obj, (status)=>{
            if(status!=0) {
                this.callback(1);
                return;
            }
            this._checkCompile(obj, (status)=>{
                if(status!=0) {
                    this.callback(1);
                    return;
                }
                this._loadFiles(obj, (status)=>{
                    if(status!=0) {
                        this.callback(1);
                        return;
                    }
                    this._buildBin(obj, (status)=>{
                        if(status!=0) {
                            this.callback(1);
                            return;
                        }
                        const walletType=wallet.get('type');
                        if(walletType=="external") {
                            ///////////////////////////////////////////
                            // SWAP THE WEB3 OBJECT TO THE EXTERNAL ONE.
                            ///////////////////////////////////////////
                            if(window.web3) {
                                this._stdwarn("Switching to external provider, endpoint is now unknown.");
                                obj.internalweb3=obj.web3;
                                obj.web3=window.web3;
                            }
                            else {
                                this._stderr("External provider not found.");
                                this.callback(1);
                                return;
                            }
                        }
                        this._checkDeploy(obj, (status)=>{
                            if(status==1) {
                                // Do not redeploy, all good.
                                this.callback(0);
                                return;
                            }
                            if(status!=0) {
                                this.callback(1);
                                return;
                            }
                            const finalize=(obj)=>{
                                this._stdout("Waiting for contract to be deployed...");
                                this._waitContract(obj, (status)=>{
                                    this._buildJs(obj, (status)=>{
                                        if(status!=0) {
                                            this.callback(1);
                                            return;
                                        }
                                        this._saveFiles(obj, (status)=>{
                                            if(status!=0) {
                                                this.callback(1);
                                                return;
                                            }
                                            this.callback(0);
                                        });
                                    });
                                });
                            };
                            if(walletType=="external") {
                                // Metamask seems to always only provide one (the chosen) account.
                                const extAccounts = window.web3.eth.accounts || [];
                                if(extAccounts.length==0) {
                                    this._stderr("External account not found. Metamask unlocked?");
                                    this.callback(1);
                                    return;
                                }
                                else if(extAccounts.length<accountIndex+1) {
                                    this._stderr("External account not found. Metamask only unlocks one account but your setup is referencing a higher index than 0.");
                                    this.callback(1);
                                    return;
                                }
                                // Check the Metamask network so that it matches
                                const chainId=(this.props.functions.networks.endpoints[this.network] || {}).chainId;
                                if(chainId && window.web3.version.network != chainId) {
                                    this._stderr("The Metamask network does not match the Superblocks Lab network. Check so that you have the same network chosen in Metamask as in Superblocks Lab, then try again.");
                                    this.callback(1);
                                    return;
                                }
                                const params={
                                    from: extAccounts[accountIndex],
                                    to: "",
                                    value: "0x0",
                                    gasPrice: obj.gasPrice,
                                    gasLimit: obj.gasLimit,
                                    data: obj.bin2,
                                };
                                this._stdout("External account detected. Opening external account provider...");
                                const modalData={
                                    title: "WARNING: Invoking external account provider",
                                    body: "Please understand that Superblocks Lab has no power over which network is targeted when using an external provider. It is your responsibility that the network is the same as it is expected to be.",
                                    class: style.externalProviderWarning,
                                };
                                const modal=(<Modal data={modalData} />);
                                this.props.functions.modal.show({cancel: ()=>{return false}, render: () => {return modal;}});
                                obj.web3.eth.sendTransaction(params, (err,res)=>{
                                    this.props.functions.modal.close();
                                    if(err) {
                                        this._stderr("Could not deploy contract using external provider.");
                                        console.error(res);
                                        this.callback(1);
                                        return;
                                    }
                                    this._stdout("Got receipt: " + res);
                                    obj.txhash2=res;
                                    const args=obj.contract.get("args") || [];
                                    this.props.project.props.state.txlog.addTx({deployArgs:args,contract:this.props.contract,hash:res,context:'Contract deployment using external provider',network:obj.network});
                                    finalize(obj);
                                });
                            }
                            else {
                                this._openWallet(obj, this.accountName, (status)=>{
                                    if(status!=0) {
                                        this.callback(1);
                                        return;
                                    }
                                    this._getNonce(obj, (status)=>{
                                        if(status!=0) {
                                            this.callback(1);
                                            return;
                                        }
                                        this._sign(obj, (status)=>{
                                            if(status!=0) {
                                                this.callback(1);
                                                return;
                                            }
                                            this._sendTx(obj, (status)=>{
                                                if(status!=0) {
                                                    this.callback(1);
                                                    return;
                                                }
                                                finalize(obj);
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    });
                });
            });
        });
    };
    _buildArgs2=(obj, args, args2, env, tag, cb)=>{
        if(args.length==0) {cb(0);return;}
        const arg=args.shift();
        if(arg.value !== undefined) {
            args2.push(arg.value);
            cb(0);
            return;
        }
        else if(arg.account) {
            const accountName = arg.account;
            const account = this.dappfile.getItem("accounts", [{name: accountName}]);
            if(!account) {
                this._stderr("Account " + (accountName||"") + " is referred to as constructor argument to the contract, but the account does not exist. Please reconfigure the contract.");
                cb(1);
                return;
            }
            const accountIndex=account.get('index', env);
            const walletName=account.get('wallet', env);
            const wallet = this.dappfile.getItem("wallets", [{name: walletName}]);
            if(!wallet) {
                // We expect a static value to have been set as the account address.
                const accountAddress=account.get('address', env);
                if(!accountAddress) {
                    this._stderr("Wallet/Address not found for account: "+accountName);
                    cb(1);
                }
                else {
                    args2.push(accountAddress);
                    cb(0);
                }
                return;
            }
            const walletType=wallet.get('type');
            if(walletType=="external") {
                if(!window.web3) {
                    this._stderr("External provider not found for passing accounts as constructor arguments. Metamask not installed?");
                    cb(1);
                    return;
                }
                const extAccounts = window.web3.eth.accounts || [];
                if(extAccounts.length==0) {
                    this._stderr("No external accounts found. Metamask unlocked?");
                    cb(1);
                    return;
                }
                else if(extAccounts.length<accountIndex+1) {
                    this._stderr("External account " + accountName + " has too high index, can't provide it as constructor argument (Metamask only unlocks one account).");
                    cb(1);
                    return;
                }
                args2.push(extAccounts[accountIndex]);
                cb(0);
            }
            else {
                const obj2={env:env}
                this._openWallet(obj2, arg.account, (status)=>{
                    if(status==0) {
                        args2.push(obj2.account.address);
                        cb(0);
                        return;
                    }
                    else {
                        cb(1);
                        return;
                    }
                });
            }
        }
        else if(arg.contract) {
            const contract = this.dappfile.getItem("contracts", [{name: arg.contract}]);
            if(!contract) {
                this._stderr("Contract " + arg.contract + " is referenced as argument but doesn't exist.");
                cb(1);
                return;
            }
            var index1=-1,index2=-1;
            this.dappfile.contracts().map((c, index)=>{
                if(c.name==arg.contract) index1=index;
                if(c.name==this.props.contract) index2=index;
            });
            if(index1>index2) {
                this._stderr("Contract " + arg.contract + " is referenced as argument but is below this contract in the order. Readjust order or reconfigure this contract.");
                cb(1);
                return;
            }
            const src=contract.get('source');
            const tag=env;
            const txsrc=this._makeFileName(src, tag+"."+this.network, "tx");
            const deploysrc=this._makeFileName(src, tag, "deploy");
            const addresssrc=this._makeFileName(src, tag+"."+this.network, "address");
            const files=[txsrc, addresssrc, deploysrc];
            this._loadRawFiles(files, (status, bodies)=>{
                if(status>0) {
                    this._stderr("Contract " + arg.contract + " is referenced as argument but is not deployed and therefore has no address. Deploy it prior to deploying this contract.");
                    cb(1);
                    return;
                }
                const txhash=bodies[2];
                const address=bodies[1];
                const code=bodies[0];
                this._verifyContract(obj, address, txhash, code, (status)=>{
                    if(status>0) {
                        this._stderr("Contract " + arg.contract + " is referenced as argument but it needs to be redeployed (on the same network). Redeploy it prior to deploying this contract.");
                        cb(1);
                        return;
                    }
                    args2.push(address);
                    cb(0);
                    return;
                });
            });
        }
        else {
            cb(1);
            return;
        }
    };
    _verifyContract=(obj, address, tx, code, cb)=>{
        this._getInputByTx(obj, tx, (status, input)=>{
            if(status>0) {
                cb(1);
                return;
            }
            if(input==code) {
                cb(0);
                return;
            }
            cb(1);
            return;
        });
    };
    _loadRawFiles=(files, cb)=>{
        const bodies=[];
        var fn;
        fn=((files, bodies, cb2)=>{
            if(files.length==0) {
                cb2(0);
                return;
            }
            const file=files.pop();
            this.props.project.loadFile(file, (body) => {
                if(body.status!=0) {
                    cb(1);
                    return;
                }
                bodies.push(body.contents);
                fn(files, bodies, (status)=>{
                    cb2(status);
                });
            }, true, true);
        });
        fn(files, bodies, (status)=>{
            cb(status, bodies);
        });
    };

    _buildArgs=(obj, cb)=>{
        var fn;
        fn=(args, args2, env, tag, cb2)=>{
            if(args.length==0) {
                cb2(0);
                return
            }
            this._buildArgs2(obj, args, args2, env, tag, (status)=>{
                if(status==0) {
                    fn(args, args2, env, tag, (status)=>{
                        cb2(status);
                    });
                }
                else {
                    cb2(1);
                }
            });
        };
        const args=obj.contract.get("args") || [];
        const args2=[];

        fn(args, args2, obj.env, obj.tag, (status)=>{
            if(status==0) {
                obj.args=args2;
                this._stdout("Arguments parsed successfully: " + args2.join(" "));
                cb(0);
            }
            else {
                this._stderr("Arguments contains incorrect formatted values.");
                cb(1);
                return;
            }
        })
    };
    _checkCompile=(obj, cb)=>{
        this._isCompileFresh(obj, (status)=>{
            if(status!=0 || obj.recompile) {
                this._stdout("Starting contract compiler...");
                this.compile((status)=>{
                    if(status==0) {
                        this._stdout("Contract compiled.");
                        cb(0);
                    }
                    else {
                        this._stderr("The contract could apparently not be compiled.");
                        cb(1);
                    }
                });
            }
            else {
                this._stdout("Contract freshly compiled, not recompiling.");
                cb(0);
            }
        });
    };
    _isCompileFresh=(obj, cb)=>{
        // Check for fresh abi and bin.
        this.props.project.loadFile(obj.src, (srcbody) => {
            if(srcbody.status!=0) {cb(1);return}
            this.props.project.loadFile(obj.abisrc, (abibody) => {
                if(abibody.status!=0) {cb(1);return}
                this.props.project.loadFile(obj.binsrc, (binbody) => {
                    if(binbody.status!=0) {cb(1);return}
                    this.props.project.loadFile(obj.hashsrc, (hashbody) => {
                        if(hashbody.status!=0) {cb(1);return}
                        const hash=sha256(srcbody.contents).toString();
                        if(hash!=hashbody.contents) cb(1);
                        else cb(0);
                    }, true, true);
                }, true, true);
            }, true, true);
        }, true, true);
    };

    _loadFiles=(obj,cb)=>{
        this.props.project.loadFile(obj.src, (srcbody) => {
            if(srcbody.status!=0) {
                this._stderr("Could not load contract source file.");
                cb(1);
                return
            }
            this.props.project.loadFile(obj.abisrc, (abibody) => {
                if(abibody.status!=0) {
                    this._stderr("Could not load contract ABI.");
                    cb(1);
                    return
                }
                this.props.project.loadFile(obj.binsrc, (binbody) => {
                    if(binbody.status!=0) {
                        this._stderr("Could not load contract binary.");
                        cb(1);
                        return
                    }
                    this.props.project.loadFile(obj.metasrc, (metabody) => {
                        if(metabody.status!=0) {
                            this._stderr("Could not load contract meta file.");
                            cb(1);
                            return
                        }
                        this.props.project.loadFile(obj.txsrc, (txbody) => {
                            // Allow non existing
                            this.props.project.loadFile(obj.addresssrc, (addressbody) => {
                                // Allow non existing
                                this.props.project.loadFile(obj.deploysrc, (deploybody) => {
                                    // Allow non existing
                                    this.props.project.loadFile(obj.hashsrc, (hashbody) => {
                                        if(hashbody.status!=0) {
                                            this._stderr("Could not load contract hash.");
                                            cb(1);
                                            return
                                        }
                                        //obj.src=srcbody.contents;
                                        obj.abi=abibody.contents;
                                        obj.bin=binbody.contents;
                                        obj.meta=metabody.contents;
                                        obj.hash=hashbody.contents;
                                        obj.txhash=txbody.contents;
                                        obj.address=addressbody.contents;
                                        obj.deploy=deploybody.contents;
                                        cb(0);
                                    }, true, true);
                                }, true, true);
                            }, true, true);
                        }, true, true);
                    }, true, true);
                }, true, true);
            }, true, true);
        }, true, true);
    };
    _buildBin=(obj, cb)=>{
        var contract=null;
        if(typeof(obj.abi) == "object") {
            contract=obj.web3.eth.contract(obj.abi);
        } else {
            contract=obj.web3.eth.contract(JSON.parse(obj.abi));
        }
        const args=obj.args.concat([{data:obj.bin}]);
        var bin2;
        var err="";
        try {
            bin2=contract.new.getData.apply(contract, args);
        }
        catch(e) {
            err=e.toString();
            bin2=null;
        }
        if(bin2==null || (bin2==obj.bin && obj.args.length>0)) {
            // Error
            this._stderr("Constructor arguments given are not valid. Too many/few or wrong types. " + err);
            cb(1);
            return;
        }
        obj.bin2=bin2;
        cb(0);
    };
    _getInputByTx = (obj, tx, cb)=>{
        obj.web3.eth.getTransaction(tx, (err, res)=>{
            if(err) {
                cb(1);
                return;
            }
            if(res) {
                cb(0, res.input);
                return;
            }
            cb(1);
            return;
        });
    };
    _checkDeploy=(obj, cb)=>{
        if(obj.txhash && obj.deploy) {
            if(obj.deploy == obj.bin2) {
                if(obj.redeploy) {
                    this._stdout("Will redeploy contract.");
                    cb(0);
                    return;
                }
                this._getInputByTx(obj, obj.txhash, (status, input)=>{
                    if(status>0) {
                        this._stdout("Contract not found at address, redeploying..");
                        cb(0);
                        return;
                    }
                    if(input == obj.bin2) {
                        this._stdout("Contract on chain is same, not redeploying.");
                        this._stdout("Done.");
                        cb(1);
                        return;
                    }
                    else {
                        this._stdout("Contract on chain is different, redeploying.");
                        cb(0);
                        return;
                    }
                });
            }
            else {
                this._stdout("Contract has changed, redeploying..");
                cb(0);
                return;
            }
        }
        else {
            cb(0);
        }
    };
    _openWallet=(obj, accountName, cb)=>{
        const account = this.dappfile.getItem("accounts", [{name: accountName}]);

        const walletName=account.get('wallet', obj.env);
        const accountIndex=account.get('index', obj.env);

        const getKey=()=>{
            this.props.functions.wallet.getKey(walletName, accountIndex, (status, key)=>{
                if(status==0) {
                    const address=this.props.functions.wallet.getAddress(walletName, accountIndex);
                    obj.account={
                        address: address,
                        key: key
                    };
                    cb(0);
                    return;
                }
                else {
                    const msg="Could not get key from wallet for address " + address + ".";
                    this._stderr(msg);
                    cb(1);
                    return;
                }
            });
        };

        if(this.props.functions.wallet.isOpen(walletName)) {
            getKey();
        }
        else {
            this.props.functions.wallet.openWallet(walletName, null, (status)=>{
                if(status==0) {
                    getKey();
                }
                else if(status==2) {
                    this._stderr("Bad seed entered.");
                    cb(1);
                    return;
                }
                else {
                    this._stderr("Could not open wallet.");
                    cb(1);
                    return;
                }
            });
        }
    };
    _getNonce=(obj, cb)=>{
        obj.web3.eth.getTransactionCount(obj.account.address, (err, res)=>{
            if(err==null) {
                obj.account.nonce=res;
                this._stdout("Nonce for address " + obj.account.address + " is " + res + ".");
                cb(0);
                return;
            }
            this._stderr("Could not get nonce for address " + obj.account.address + ".");
            cb(1);
        });
    };
    _sign=(obj, cb)=>{
        const tx=new Tx.Tx({
            from: obj.account.address,
            to: "",
            //chainId: 333,
            value: "0x0",
            nonce: obj.account.nonce,
            gasPrice: obj.gasPrice,
            gasLimit: obj.gasLimit,
            data: obj.bin2,
        });
        tx.sign(Tx.Buffer.Buffer.from(obj.account.key, "hex"));
        obj.tx=tx;
        this._stdout("Transaction signed.");
        cb(0);
    };
    _sendTx=(obj, cb)=>{
        this._stdout("Gaslimit="+obj.gasLimit+ ", gasPrice="+obj.gasPrice+".");
        this._stdout("Sending transaction to network " + obj.network + " on endpoint " + obj.endpoint + "...");
        obj.web3.eth.sendRawTransaction("0x"+obj.tx.serialize().toString("hex"), (err, res) =>{
            if(err==null) {
                this._stdout("Got receipt: " + res);
                obj.txhash2=res;
                const args=obj.contract.get("args") || [];
                this.props.project.props.state.txlog.addTx({deployArgs:args,contract:this.props.contract,hash:res,context:'Contract deployment',network:obj.network});
                cb(0);
            }
            else {
                this._stderr("Could not deploy contract: " + err);
                cb(1);
            }
        });
    };
    _waitContract=(obj, cb)=>{
        const receipt=obj.txhash2;
        obj.web3.eth.getTransactionReceipt(receipt, (err, res)=>{
            if(err) {
                this._stderr("Could not deploy contract: " + err);
                cb(1);
                return;
            }
            if(res==null || res.blockHash==null) {
                setTimeout(()=>{this._waitContract(obj, cb)},1000);
            }
            else {
                this._stdout("Transaction mined, verifying code...");
                obj.address2=res.contractAddress;
                obj.deployMeta={gasUsed:res.gasUsed};
                obj.web3.eth.getCode(obj.address2, "latest", (err, res)=>{
                    if(res && res.length>4) {
                        this._stdout("Contract deployed at address " + obj.address2 + ".");
                        this._stdout("Done.");
                        cb(0);
                        return;
                    }
                    else {
                        this._stderr("Contract did not get deployed. Wrong arguments to constructor?");
                        cb(1);
                        return;
                    }
                });
            }
        });
    };
    _buildJs=(obj,cb)=>{
        obj.contractsjs=`/* Autogenerated - do not fiddle */
if(typeof(Contracts)==="undefined") var Contracts={};
(function(module, Contracts) {
    var data={
        address: "`+obj.address2+`",
        network: "`+obj.network+`",
        endpoint: "`+obj.endpoint+`",
        abi: `+obj.abi+`
    };
    Contracts["`+this.props.contract+`"]=data;
    module.exports=data;
})((typeof(module)==="undefined"?{}:module), Contracts);
`;
        cb(0);
    }
    _saveFiles=(obj,cb)=>{
        this.props.project.loadFile(obj.addresssrc, (addressbody) => {
            this.props.project.loadFile(obj.deploysrc, (deploybody) => {
                this.props.project.loadFile(obj.contractsjssrc, (jsbody) => {
                    this.props.project.loadFile(obj.txsrc, (txbody) => {
                        txbody.contents=obj.txhash2;
                        addressbody.contents=obj.address2;
                        deploybody.contents=obj.bin2;
                        jsbody.contents=obj.contractsjs;
                        this.props.project.saveFile(obj.txsrc, (ret) => {
                            this.props.project.saveFile(obj.deploysrc, (ret) => {
                                this.props.project.saveFile(obj.addresssrc, (ret) => {
                                    var fn=this.props.project.saveFile;
                                    if(!jsbody.contents) fn=this.props.project.deleteFile;
                                    fn(obj.contractsjssrc, (ret) => {
                                        this.props.project.closeFile(obj.txsrc);
                                        this.props.project.closeFile(obj.addresssrc);
                                        this.props.project.closeFile(obj.deploysrc);
                                        this.props.project.closeFile(obj.contractsjssrc);
                                        cb(0);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    };

    componentDidMount() {
        this.redraw();
    }

    redraw = () => {
        this.setState();
    };

    renderToolbar = () => {
        const contract = this.dappfile.getItem("contracts", [{name: this.props.contract}]);
        const cls={};
        cls[style.running] = this.isRunning;
        return (
            <div class={style.toolbar} id={this.id+"_header"}>
                <div class={style.buttons}>
                    <a class={classnames(cls)} href="#" title="Redeploy" onClick={this.run}><IconRun /></a>
                </div>
                <div class={style.status}>
                    {this.state.status}
                </div>
                <div class={style.info}>
                    <span>
                        Deploy {this.props.contract}
                    </span>
                </div>
            </div>
        );
    };

    getHeight = () => {
        const a=document.getElementById(this.id);
        const b=document.getElementById(this.id+"_header");
        if(!a) return 99;
        return (a.offsetHeight - b.offsetHeight);
    };

    getWait = () => {
        if(this.consoleRows.length == 0) {
            return <div class={style.loading}>
                    <span>Loading...</span>
                </div>;
        }
    };

    renderContents = () => {
        const waiting=this.getWait();
        const scrollId="scrollBottom_"+this.props.id;
        return (
            <div class={style.console}>
                <div class={style.terminal} id={scrollId}>
                    {waiting}
                    {this.consoleRows.map((row, index) => {
                        return row.msg.split("\n").map(i => {
                            var cl=style.std1;
                            if(row.channel==2)
                                cl=style.std2;
                            else if(row.channel==3)
                                cl=style.std3;
                            return <div class={cl}>{i}</div>;
                        })
                    })}
                </div>
            </div>
        );
    };

    render() {
        const toolbar=this.renderToolbar();
        const contents=this.renderContents();
        const height=this.getHeight();
        const maxHeight = {
            height: height + "px"
        };
        return (
          <div class="full" id={this.id}>
            {toolbar}
            <div id={this.id+"_scrollable"} class="scrollable-y" style={maxHeight}>
                {contents}
            </div>
          </div>
        );
    }
}
