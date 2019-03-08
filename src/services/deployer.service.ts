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

import { IProjectItem } from '../models';
import { Observable, throwError, of, from, Observer, timer } from 'rxjs';
import { catchError, map, switchMap, retryWhen, retry, tap } from 'rxjs/operators';
import { getWeb3 } from './utils';
import Tx from 'ethereumjs-tx';
import Buffer from 'buffer';

let currWeb3: any = null;

function getFileCode(files: IProjectItem[], ext: string) {
    const file = files.find(f => f.name.toLowerCase().endsWith(ext));
    if (!file) {
        return '';
    }
    return file.code as string;
}

function createDeployFile(buildFiles: IProjectItem[], contractArgs: any[]): string {
    let parsedABI;
    try {
        // TODO: think of passing contract name!
        parsedABI = JSON.parse(getFileCode(buildFiles, '.abi'));
    } catch {
        throw new Error('Cannot parse .abi file');
    }

    const binFileCode = getFileCode(buildFiles, '.bin');

    const contract = window.web3.eth.contract(parsedABI);
    const args = contractArgs.concat([{ data: binFileCode }]);

    let deployFileCode = null;
    let error;

    try {
        deployFileCode = contract.new.getData.apply(contract, args);
    } catch (e) {
        error = e.toString();
    }

    if (deployFileCode == null || (deployFileCode === binFileCode && contractArgs.length > 0)) {
        // Error
        throw new Error('Constructor arguments given are not valid. Too many/few or wrong types. ' + error);
    }

    return deployFileCode;
}

function getInputByTx(txhash: string) {
    // TODO: check web3
    return new Promise((resolve, reject) => {
        currWeb3.eth.getTransaction(txhash, (err: any, res: any) => {
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

interface ICheckDeployResult {
    message?: string;
    deployFile?: string;
}

export const deployerService = {
    init(accountType: string, endpoint: string) {
        currWeb3 = accountType === 'metamask' ? window.web3 : getWeb3(endpoint);
    },

    checkDeploy(buildFiles: IProjectItem[], contractArgs: any[], environment: string): Observable<ICheckDeployResult> {
        // 1. create ".deploy" file
        let deployFile: string;
        try {
            deployFile = createDeployFile(buildFiles, contractArgs);
        } catch (e) {
            return throwError(e.message);
        }

        // 2. check will old deploy files
        const txhash = getFileCode(buildFiles, environment + '.tx');
        const existingDeployFile = getFileCode(buildFiles, environment + '.deploy');

        if (txhash && existingDeployFile) {
            if (existingDeployFile === deployFile) {
                return from(getInputByTx(txhash)).pipe(
                    map((input) => (input === deployFile)
                        ? { message: 'Contract on chain is the same, not redeploying.\nDone.' }
                        : { message:  'Contract on chain is different, redeploying.', deployFile }
                    ),
                    catchError(() => of({ message: 'Contract not found at address, redeploying..', deployFile }))
                );
            } else {
                return of({ message: 'Contract on chain is different, redeploying.', deployFile });
            }
        } else {
            return of({ deployFile });
        }
    },

    sendExternalTransaction(params: any) {
        return from(new Promise((resolve, reject) => {
            currWeb3.eth.sendTransaction(params, (err: any, res: any) => {
                // this.closeExternalProviderModal();
                if (err) {
                    console.error(res);
                    // reject('Could not deploy contract using external provider.');
                    reject();
                    return;
                }
                // this._stdout('Got receipt: ' + res);
                // const args = (obj.contract.getArgs() || []).slice(0); // We MUST copy the array since we are shifting out the elements.
                // add transaction log
                // this.item.getProject().getTxLog().addTx({
                //     deployArgs: args,
                //     contract: this.props.item
                //         .getParent()
                //         .getName(),
                //     hash: res,
                //     context: 'Contract deployment using external provider',
                //     network: obj.network,
                // });
                resolve(res);
            });
        }));
    },

    getNonce(address: string) {
        return from(new Promise((resolve, reject) => {
            currWeb3.eth.getTransactionCount(address, (err: any, res: any) => {
                if (err == null) {
                    resolve(res);
                } else {
                    reject();
                }
            });
        }));
    },

    signTransaction(address: string, nonce: any, gasSettings: any, key: string, deployFile: string) {
        const tx = new Tx({
            from: address,
            to: '',
            // chainId: 333,
            value: '0x0',
            nonce,
            gasPrice: gasSettings.gasPrice,
            gasLimit: gasSettings.gasLimit,
            data: deployFile,
        });
        tx.sign(Buffer.Buffer.from(key, 'hex'));
        return tx;
    },

    sendInteralTransaction(tx: any) {
        return from<string>(new Promise((resolve, reject) => {
            currWeb3.eth.sendRawTransaction(
                '0x' + tx.serialize().toString('hex'),
                (err: string, hash: string) => {
                    if (err == null) {
                        resolve(hash);
                        // const args = (obj.contract.getArgs() || []).slice(0); // We MUST copy the array since we are shifting out the elements.
                        // TODO: add TX to log
                        // this.item
                        //     .getProject()
                        //     .getTxLog()
                        //     .addTx({
                        //         deployArgs: args,
                        //         contract: this.item.getParent().getName(),
                        //         hash: res,
                        //         context: 'Contract deployment',
                        //         network: obj.network,
                        //     });
                        // cb(0);
                    } else {
                        reject(err);
                    }
                }
            );
        }));
    },

    waitForContract(hash: string) {
        return Observable.create((observer: Observer<any>) => {
            const getReceipt = () => currWeb3.eth.getTransactionReceipt(hash, (err: string, receipt: any) => {
                console.log('opaopaopa');
                if (err) {
                    observer.error(err);
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
                const getCode = () => currWeb3.eth.getCode(receipt.contractAddress, 'latest', (err: string, res: any) => {
                    if (err || !res || res.length < 4) {
                        if (counter-- === 0) {
                            observer.next({
                                msg: `Contract code could not be verified on chain. The contract might not have been deployed.
                                This is possibly a mismatch in the number/type of arguments given to the constructor or could
                                also be a temporary issue in reading back the contract code from the chain.`,
                                channel: 3
                            });
                            observer.error(null);
                            return;
                        }
                        setTimeout(getCode, 2000);
                        return;
                    }
                    observer.next({ msg: 'Contract deployed at address ' + receipt.contractAddress + '.\nDone.', channel: 1 });
                    observer.next({ address: receipt.contractAddress });
                    observer.complete();
                });
                getCode();
            }))
        );

        // const getReceipt = () => currWeb3.eth.getTransactionReceipt(receipt, (err: string, res: any) => {

        //     if (res == null || res.blockHash == null) {
        //         setTimeout(() => getReceipt, 1000);
        //     } else {
        //         this._stdout('Transaction mined, verifying code...');
        //         obj.address2 = res.contractAddress;
        //         obj.deployMeta = { gasUsed: res.gasUsed };
        //         var counter = 10;
        //         const waitCode = () => {
        //             obj.web3.eth.getCode(obj.address2, 'latest', (err, res) => {
        //                 if (err || !res || res.length < 4) {
        //                     if (counter-- == 0) {
        //                         // Final timeout
        //                         this._stderr(
        //                             'Contract code could not be verified on chain. The contract might not have been deployed.
        // This is possibly a mismatch in the number/type of arguments given to the constructor or could also be a temporary issue in reading back the contract code from the chain.'
        //                         );
        //                         cb(1);
        //                         return;
        //                     }
        //                     setTimeout(waitCode, 2000);
        //                     return;
        //                 }
        //                 this._stdout('Contract deployed at address ' + obj.address2 + '.');
        //                 this._stdout('Done.');
        //                 cb(0);
        //             });
        //         };

        //         waitCode();
        //     }
        // });
    }
};
