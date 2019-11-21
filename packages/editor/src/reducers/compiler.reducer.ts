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

import { AnyAction } from 'redux';
import { explorerActions, compilerActions } from '../actions';
import { IExplorerState, ICompilerState } from '../models/state';
import { traverseTree, createFile } from './explorerLib';
import { isSolitidyFile } from './utils';
import sha256 from 'crypto-js/sha256';
import { getContractName, getCompilerOutputPath } from './compilerLib';

const initialState: ICompilerState = {
    input: null,
    files: {},

    consoleRows: [], // console output of the last action

    targetContractPath: [],
    targetContractHash: '',
    outputFiles: [],
    outputFolderPath: []
};

function pathToString(path: string[]) {
    return '/' + path.join('/');
}

function checkForGeneralErrors(compilerOutput: any): any[] {
    const consoleRows: any[] = [];

    if (!compilerOutput) {
        consoleRows.push({
            channel: 3,
            msg: 'Sorry! We hit a compiler internal error. Please report the problem and in the meanwhile try using a different browser.'
        });
    } else {
        (compilerOutput.errors || []).map((row: any) => {
            consoleRows.push({
                channel: row.severity === 'warning' ? 3 : 2,
                msg: row.formattedMessage,
            });
        });

        if (!compilerOutput.contracts || Object.keys(compilerOutput.contracts).length === 0) {
            consoleRows.push({
                channel: 2,
                msg: '[ERROR] Ate bad code and died, compilation aborted.',
            });
        }
    }

    return consoleRows;
}

function checkForTargetContractOutputErrors(targetContractOutput: any, compilerOutput: any, targetContractPathStr: string) {
    const errorRows = [];

    if (targetContractOutput && Object.keys(targetContractOutput.evm.bytecode.linkReferences || {}).length > 0) {
        errorRows.push({
            channel: 2,
            msg: `[ERROR] The contract ${targetContractPathStr} references library contracts. Ethereum Studio does not yet support library contract linking, only contract imports.`,
        });
    } else if (!targetContractOutput || !targetContractOutput.metadata) {
        if (compilerOutput.contracts) {
            errorRows.push({
                channel: 2,
                msg: `[ERROR] The contract ${targetContractPathStr} could not be compiled.
                The contract is not found in the compiled output. Make sure the contract is configured correctly so that the name matches the (main) contract in the source file.`,
            });
        } else {
            errorRows.push({
                channel: 2,
                msg: `[ERROR] The contract ${targetContractPathStr} could not be compiled.`,
            });
        }
    }

    return errorRows;
}

function getTargetContractOutput(compilerOutput: any, targetContractPath: string[]): any {
    let targetContractOutput = null;
    if (compilerOutput.contracts) {
        const contractName = getContractName(targetContractPath);
        targetContractOutput = compilerOutput.contracts[pathToString(targetContractPath)][contractName];
    }
    return targetContractOutput;
}

function getCompilerInputParams(sources: any) {
    return {
        language: 'Solidity',
        sources,
        settings: {
            optimizer: {
                enabled: false,
                runs: 200,
            },
            evmVersion: 'byzantium',
            libraries: {},
            outputSelection: {
                '*': {
                    '*': [
                        'metadata',
                        'evm.bytecode',
                        'evm.gasEstimates',
                    ],
                },
            },
        },
    };
}

export default function compilerReducer(state = initialState, action: AnyAction, { explorer }: { explorer: IExplorerState }) {
    switch (action.type) {
        case compilerActions.INIT_COMPILATION: {
            if (!explorer.tree) {
                return state;
            }

            const sources: any = {};
            const files = initialState.files;
            let targetContractPath = initialState.targetContractPath;

            // find target solidity file and all others
            traverseTree(explorer.tree, (item, path) => {
                if (isSolitidyFile(item)) {
                    if (item.id === action.data.id) {
                        targetContractPath = path();
                        sources[pathToString(targetContractPath)] = { content: item.code };
                    } else {
                        files[pathToString(path())] = item.code;
                    }
                }
            });

            return {
                ...state,
                input: getCompilerInputParams(sources),
                targetContractPath,
                targetContractHash: sha256(action.data.code).toString()
            };
        }

        case compilerActions.COMPILER_READY: {
            return {
                ...state,
                consoleRows: [{ channel: 1, msg: 'Using Solidity compiler version ' + action.data }]
            };
        }

        case compilerActions.HANDLE_COMPILE_OUTPUT: {
            let errorRows = checkForGeneralErrors(action.data);

            if (errorRows.length === 0) {
                const targetContractOutput = getTargetContractOutput(action.data, state.targetContractPath);
                const targetContractPathStr = pathToString(state.targetContractPath);

                const targetContractErrorRows = checkForTargetContractOutputErrors(targetContractOutput, action.data, targetContractPathStr);
                if (targetContractErrorRows.length === 0) {
                    try {
                        const metadata = JSON.parse(targetContractOutput.metadata);
                        const metafileData = {
                            compile: {
                                gasEstimates: targetContractOutput.evm.gasEstimates,
                            },
                        };

                        const contractName = getContractName(state.targetContractPath);
                        const outputFiles = [
                            createFile(contractName + '.abi', JSON.stringify(metadata.output.abi, null, 4)),
                            createFile(contractName + '.meta', JSON.stringify(metafileData, null, 4)),
                            createFile(contractName + '.bin', '0x' + targetContractOutput.evm.bytecode.object),
                            createFile(contractName + '.hash', state.targetContractHash)
                        ];

                        return {
                            ...state,
                            outputFiles,
                            outputFolderPath: getCompilerOutputPath(state.targetContractPath),
                            consoleRows: [{ channel: 4, msg: 'Success in compilation' }]
                        };
                    } catch {
                        console.error('Could not parse compiler output', targetContractOutput);
                        errorRows.push({
                            channel: 2,
                            msg: `[ERROR] The contract ${targetContractPathStr} could not be compiled.`,
                        });
                    }
                } else {
                    errorRows = errorRows.concat(targetContractErrorRows);
                }

            }

            // this means errors occured
            return {
                ...state,
                consoleRows: errorRows
            };
        }

        default:
            return state;
    }
}
