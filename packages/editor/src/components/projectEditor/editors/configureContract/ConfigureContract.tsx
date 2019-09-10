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

import React, { Component } from 'react';
import style from '../style-editor-contract.less';

import { ConstructorArgumentsList } from './constructorArgumentsList';
import { ConstructorArgumentsHeader } from './constructorArgumentsHeader';
import { ContractArgTypes, IProjectItem, IContractArgData, IContractConfiguration } from '../../../../models';
import { IAccount } from '../../../../models/state';

// function convertArgsToExternalModel(internalArgs) {
//     return internalArgs.map(a => ({ [a.type]: a.value }));
// }

// function convertArgsToInternalModel(externalArgs) {
//     return externalArgs.map(a => {
//         const type = Object.keys(a)[0];
//         return { type, value: a[type] };
//     });
// }

interface IProps {
    file: IProjectItem;
    key: string;
    visible: boolean;
    contractConfiguration: IContractConfiguration;
    accounts: IAccount[];
    saveContractConfig: (contractConfig: IContractConfiguration) => void;
}

interface IState {
    newContractConfig: IContractConfiguration;
    isDirty: boolean;
}

export default class ConfigureContract extends Component<IProps, IState> {

    state = {
        newContractConfig: this.props.contractConfiguration,
        isDirty: false,
    };

    componentDidUpdate() {
        this._updateProps();
    }

    componentDidMount() {
        this._updateProps();
    }

    _updateProps = () => {
        const { file } = this.props;

        // // Only update internal props if we are clean.
        // if (!this.state.isDirty) {
        //     this.setState({
        //         name: file.name, // Get the name of the ContractItem.
        //         args: convertArgsToInternalModel(this.props.item.getParent().getArgs() || []) // Get the args of the ContractItem.
        //     });
        // }
    }

    // canClose = (cb, silent) => {
    //     if (this.state.isDirty && !silent) {
    //         const flag = window.confirm(
    //             'There is unsaved data. Do you want to close the tab and loose the changes?'
    //         );
    //         cb(flag ? 0 : 1);
    //         return;
    //     }
    //     cb(0);
    // }

    save = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { saveContractConfig } = this.props;
        const { newContractConfig } = this.state;

        e.preventDefault();
        saveContractConfig(newContractConfig);
        this.setState({
            isDirty: false
        });
    }

    getOtherContracts = () => {
        return [''];
        // TODO - Get this from state

        // Get all contracts registered in the dappfile.
        // const list = this.props.item
        //     .getProject()
        //     .getHiddenItem('contracts')
        //     .getChildren();
        // const contracts = [];
        // for (let index = 0; index < list.length; index++) {
        //     const contract = list[index];
        //     if (contract.getName() === this.props.item.getParent().getName()) {
        //         continue;
        //     }
        //     contracts.push(contract.getSource());
        // }
        // return contracts;
    }

    onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        this.setState({
            newContractConfig: {
                name: value,
                ...this.state.newContractConfig
            },
            isDirty: true,
        });
    }

    onArgumentChange = (argumentChanged: IContractArgData, index: number) => {
        this.setState((prevState: IState) => {
            return {
                isDirty: true,
                newContractConfig: {
                    ...this.state.newContractConfig,
                    arguments: prevState.newContractConfig.arguments.map((arg, i) => {
                        return (index !== i) ? arg : { ...arg, ...argumentChanged };
                    }),
                },
            };
        });
    }

    addArgument = () => {
        this.setState((prevState: IState) => ({
            isDirty: true,
            newContractConfig: {
                ...this.state.newContractConfig,
                arguments: [...prevState.newContractConfig.arguments, { type: ContractArgTypes.value, value: '' }],

            }
        }));
    }

    removeArgument = (index: number) => {
        if (index > -1) {
            this.setState((prevState: IState) => ({
                isDirty: true,
                newContractConfig: {
                    ...this.state.newContractConfig,
                    arguments: prevState.newContractConfig.arguments.filter((_, i) => i !== index),
                }
            }));
        }
    }

    render() {
        const { file, key, contractConfiguration, accounts } = this.props;
        const { newContractConfig, isDirty } = this.state;

        console.log(newContractConfig);

        // TODO - Instead of checking the file, get the item from the dappfile
        if (!file) {
            return <div>Could not find contract in dappfile.json</div>;
        }

        return (
            <div id={key} className={style.main}>
                <div className='scrollable-y' id={key + '_scrollable'}>
                    <div className={style.inner}>
                        <h1 className={style.title}>Edit Contract {contractConfiguration.path}</h1>
                        <div className={style.form}>
                            <div className='superInputDark'>
                                <label htmlFor='name'>Name</label>
                                <input
                                    id='name'
                                    type='text'
                                    // onKeyUp={this.onNameChange}
                                    value={newContractConfig.name}
                                    onChange={this.onNameChange}
                                />
                            </div>
                            <div className={style.constructorContainer}>
                                <ConstructorArgumentsHeader />
                                <ConstructorArgumentsList
                                    args={newContractConfig.arguments}
                                    accounts={accounts.map(account => account.name)}
                                    otherContracts={this.getOtherContracts()}
                                    onArgChange={this.onArgumentChange}
                                    onArgRemove={this.removeArgument}
                                    onArgAdd={this.addArgument}
                                    />
                            </div>
                            <div>
                                <button className='btn2' disabled={!isDirty} onClick={this.save}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
