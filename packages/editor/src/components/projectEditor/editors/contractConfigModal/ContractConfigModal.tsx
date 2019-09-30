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
import classNames from 'classnames';
import style from './style.less';
import { ConstructorArgumentsList } from './constructorArgumentsList';
import { ConstructorArgumentsHeader } from './constructorArgumentsHeader';
import { ContractArgTypes, IProjectItem, IContractArgData, IContractConfiguration } from '../../../../models';
import { IAccount } from '../../../../models/state';
import { Modal, ModalHeader } from '../../../common';

interface IProps {
    selectedContract: {
        file: IProjectItem
        config: IContractConfiguration;
    };
    otherContracts: string[];
    accounts: IAccount[];
    saveContractConfig: (contractConfig: IContractConfiguration) => void;
    hideModal: () => void;
}

interface IState {
    newContractConfig: IContractConfiguration;
    isDirty: boolean;
}

export default class ContractConfigModal extends Component<IProps, IState> {

    state = {
        newContractConfig: this.props.selectedContract.config,
        isDirty: false,
    };

    componentDidUpdate() {
        this._updateProps();
    }

    componentDidMount() {
        this._updateProps();
    }

    _updateProps = () => {
        // const { file } = this.props;

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

    onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        this.setState({
            newContractConfig: {
                ...this.state.newContractConfig,
                name: value,
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
                    args: prevState.newContractConfig.args.map((arg, i) => {
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
                args: [...prevState.newContractConfig.args, { type: ContractArgTypes.value, value: '' }],

            }
        }));
    }

    removeArgument = (index: number) => {
        if (index > -1) {
            this.setState((prevState: IState) => ({
                isDirty: true,
                newContractConfig: {
                    ...this.state.newContractConfig,
                    args: prevState.newContractConfig.args.filter((_, i) => i !== index),
                }
            }));
        }
    }

    render() {
        const { selectedContract, accounts, otherContracts, hideModal } = this.props;
        const { newContractConfig, isDirty } = this.state;

        // Make sure the item actually exists in the Dappfile.json
        if (!selectedContract.config) {
            return <div>Could not find contract in dappfile.json</div>;
        }

        return (
            <Modal hideModal={hideModal}>
                <div className={classNames([style.configureContractModal, 'modal'])}>
                    <ModalHeader
                        title='Configure Contract'
                        onCloseClick={hideModal}
                    />
                    <div className={classNames([style.content, 'scrollable-y'])}>
                        <div className={style.inner}>
                            <h3 className={style.title}>Edit Contract {selectedContract.config.source}</h3>
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
                                        args={newContractConfig.args}
                                        accounts={accounts.map(account => account.name)}
                                        otherContracts={otherContracts}
                                        onArgChange={this.onArgumentChange}
                                        onArgRemove={this.removeArgument}
                                        onArgAdd={this.addArgument}
                                        />
                                </div>
                            </div>
                        </div>
                        <div className={style.footer}>
                            <div className={style.cancelBtn} onClick={(hideModal)}>Cancel</div>
                            <button className='btn2' disabled={!isDirty} onClick={this.save}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
