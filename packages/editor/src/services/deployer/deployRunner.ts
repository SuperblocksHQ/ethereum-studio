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

import { IProjectItem } from '../../models';
import { Observable, throwError, of, from, Observer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { getWeb3, convertGas } from '../utils';
import { IAccount, IEnvironment } from '../../models/state';
import { ICheckDeployResult, IDeployResult, CheckDeployResult } from './deploy.models';
import { createDeployFile, getFileCode, signTransaction } from './deploy.utils';

export class DeployRunner {
    private readonly currWeb3: any;
    private readonly account: IAccount;
    private readonly environment: IEnvironment;
    private readonly contractName: string;
    private readonly contractArgs: any[];
    private deployFile: string = '';
    private abiFile: string = '';

    constructor(account: IAccount, environment: IEnvironment, contractName: string, contractArgs: any[], functionName?: string, ) {
        this.account = account;
        this.environment = environment;
        this.contractName = contractName;
        this.currWeb3 = account.type === 'metamask' ? window.web3 : getWeb3(this.environment.endpoint);
        this.contractArgs = contractArgs;
    }

    checkExistingDeployment(buildFiles: IProjectItem[], contractArgs: any[]): Observable<ICheckDeployResult> {
        if (!this.currWeb3) {
            return throwError({ msg: 'Metamask is not installed.', channel: 2, result: CheckDeployResult.CanNotDeploy });
        }

        // 1. create ".deploy" file
        try {
            this.deployFile = createDeployFile(this.currWeb3, buildFiles, contractArgs);
        } catch (e) {
            return throwError({ msg: e.message, channel: 2, result: CheckDeployResult.CanNotDeploy });
        }

        // 2. check if old deploy files exist
        const txhash = getFileCode(buildFiles, this.environment.name + '.tx');
        const existingDeployFile = getFileCode(buildFiles, this.environment.name + '.deploy');
        this.abiFile = getFileCode(buildFiles, this.contractName + '.abi');
        if (!this.abiFile) {
            return throwError({ msg: 'No abi file exists. Please check compilation results.', channel: 2, result: CheckDeployResult.CanNotDeploy });
        }

        if (txhash && existingDeployFile) {
            if (existingDeployFile === this.deployFile) {
                return from(this.getInputByTx(txhash)).pipe(
                    map((input) => (input === this.deployFile)
                        ? { msg: 'Contract on chain is the same, not redeploying.\nDone.', channel: 3, result: CheckDeployResult.AlreadyDeployed }
                        : { msg:  'Contract on chain is different, redeploying.', channel: 1, result: CheckDeployResult.CanDeploy }
                    ),
                    catchError(() => of({ msg: 'Contract not found at address, redeploying..', result: CheckDeployResult.CanDeploy }))
                );
            } else {
                return of({ msg: 'Contract on chain is different, redeploying.', channel: 1, result: CheckDeployResult.CanDeploy });
            }
        } else {
            return of({ result: CheckDeployResult.CanDeploy });
        }
    }

    deployExternally(gasSettings: any, value: string) {
        gasSettings = { gasPrice: convertGas(gasSettings.gasPrice), gasLimit: convertGas(gasSettings.gasLimit) };
        const valueFormatted = value ? convertGas(value) : value;

        const params = {
            from: this.account.address,
            to: '',
            value: valueFormatted ? valueFormatted : '0x0',
            gasPrice: gasSettings.gasPrice,
            gasLimit: gasSettings.gasLimit,
            data: this.deployFile
        };

        return from(new Promise<any>((resolve, reject) => {
            this.currWeb3.eth.sendTransaction(params, (err: any, hash: string) => {
                if (err) {
                    console.error(hash);
                    reject({ msg: 'Could not deploy contract using external provider.', channel: 2 });
                    return;
                }
                resolve({ msg: 'Got receipt: ' + hash, channel: 4, hash, contractName: this.contractName });
            });
        }));
    }

    deployToBrowser(gasSettings: any, key: string, value: string): Observable<any> {
        gasSettings = { gasPrice: convertGas(gasSettings.gasPrice), gasLimit: convertGas(gasSettings.gasLimit) };
        const valueFormatted = value ? convertGas(value) : value;

        return Observable.create((observer: Observer<any>) => {
            this.getNonce(this.account.address).then(nonce => {
                observer.next({ channel: 1, msg: `Nonce for address ${this.account.address} is ${nonce}.` });
                const tx = signTransaction(this.account.address, nonce, gasSettings, key, this.deployFile, undefined, valueFormatted);
                observer.next({ channel: 1, msg: `Transaction signed.` });
                observer.next({ channel: 1, msg: `Gaslimit=${gasSettings.gasLimit}, gasPrice=${gasSettings.gasPrice}.` });
                observer.next({ channel: 1, msg: `Sending transaction to network ${this.environment.name} on endpoint ${this.environment.endpoint}...` });
                return tx;
            })
            .then(tx => this.sendInternalTransaction(tx))
            .then((result: any) => {
                observer.next({ channel: 4, msg: `Got receipt: ${result.hash}.` });
                observer.next(result);
                observer.complete();
            })
            .catch(err => observer.error({ msg: `${err}\n`, channel: 2 }));
        });
    }

    waitForContract(hash: string) {
        return Observable.create((observer: Observer<any>) => {
            const getReceipt = () => this.currWeb3.eth.getTransactionReceipt(hash, (err: string, receipt: any) => {
                if (err) {
                    observer.error({ msg: err, channel: 2 });
                    return;
                }
                if (receipt == null || receipt.blockHash == null) {
                    setTimeout(getReceipt, 1000);
                } else {
                    observer.next(receipt);
                    observer.complete();
                }
            });

            getReceipt();
        }).pipe(
            switchMap((receipt: any) => Observable.create((observer: Observer<any>) => {
                observer.next({ msg: 'Transaction mined, verifying code...', channel: 1 });

                let counter = 10;
                const getCode = () => this.currWeb3.eth.getCode(receipt.contractAddress, 'latest', (err: string, res: any) => {
                    if (err || !res || res.length < 4) {
                        if (counter-- === 0) {
                            observer.next({
                                msg: `Contract code could not be verified on chain. The contract might not have been deployed.
                                This is possibly a mismatch in the number/type of arguments given to the constructor or could
                                also be a temporary issue in reading back the contract code from the chain.`,
                                channel: 3
                            });
                            observer.error({ msg: '', channel: 2 });
                            return;
                        }
                        setTimeout(getCode, 2000);
                        return;
                    }
                    observer.next({ msg: 'Contract deployed at address ' + receipt.contractAddress + '.\nDone.', channel: 4 });
                    // emit final deployer output
                    const fileName = this.contractName + '.' + this.environment.name;
                    observer.next(<IDeployResult>{
                        files: [
                            { name: `${fileName}.address`, code: receipt.contractAddress },
                            { name: `${fileName}.deploy`, code: this.deployFile },
                            { name: `${fileName}.tx`, code: hash },
                            { name: `${fileName}.js`, code: this.buildContractJs(receipt.contractAddress) }
                        ],
                        environment: this.environment.name,
                        receipt,
                        contractName: this.contractName
                    });
                    observer.complete();
                });
                getCode();
            }))
        );
    }

    private buildContractJs(contractAddress: string) {
        return `/* Autogenerated - do not fiddle */
            if(typeof(Contracts) === "undefined") var Contracts={};
            (function(module, Contracts) {
                var data = {
                    address: "${contractAddress}",
                    network: "${this.environment.name}",
                    endpoint: "${this.environment.endpoint}",
                    abi: ${this.abiFile}
                };
                Contracts["${this.contractName}"] = data;
                console.log(data);
                module.exports = data;
            })((typeof(module) === "undefined" ? {} : module), Contracts);`;
    }

    private getInputByTx(txhash: string) {
        // TODO: check web3
        return new Promise((resolve, reject) => {
            this.currWeb3.eth.getTransaction(txhash, (err: any, res: any) => {
                if (err) {
                    reject();
                } else if (res) {
                    resolve(res.input);
                    return;
                } else {
                    reject();
                }
            });
        });
    }

    private getNonce(address: string) {
        return new Promise((resolve, reject) => {
            this.currWeb3.eth.getTransactionCount(address, (err: any, res: any) => {
                if (err == null) {
                    resolve(res);
                } else {
                    reject(`Could not get nonce for address ${address}.`);
                }
            });
        });
    }

    private sendInternalTransaction(tx: any) {
        return new Promise<any>((resolve, reject) => {
            this.currWeb3.eth.sendRawTransaction(
                '0x' + tx.serialize().toString('hex'),
                (err: string, hash: string) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({hash, tx});
                    }
                }
            );
        });
    }
}
