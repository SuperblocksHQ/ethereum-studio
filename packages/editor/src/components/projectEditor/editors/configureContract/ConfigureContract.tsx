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
import { ContractArgTypes } from '../../../../models';

function convertArgsToExternalModel(internalArgs) {
    return internalArgs.map(a => ({ [a.type]: a.value }));
}

function convertArgsToInternalModel(externalArgs) {
    return externalArgs.map(a => {
        const type = Object.keys(a)[0];
        return { type, value: a[type] };
    });
}

interface IProps {

}

interface IArg {
    type: ContractArgTypes;
}

interface IState {
    args: [IArg];
    name: string;
    isDirty: boolean;
}

export default class ConfigureContract extends Component {

    state = {
        args: [{
            name: '',
            type: undefined
        }],
        name: '',
        isDirty: false,
    };

    componentDidUpdate() {
        this._updateProps();
    }

    componentDidMount() {
        this._updateProps();
    }

    _updateProps = () => {
        // Only update internal props if we are clean.
        if (!this.state.isDirty) {
            this.setState({
                name: this.props.item.getParent().getName() || '', // Get the name of the ContractItem.
                args: convertArgsToInternalModel(this.props.item.getParent().getArgs() || []) // Get the args of the ContractItem.
            });
        }
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

    save = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (this.state.name.length === 0) {
            alert('Error: Missing name.');
            return;
        }

        if (!this.state.name.match(/^([a-zA-Z0-9-_]+)$/) || this.state.name.length > 255) {
            alert('Illegal contract name. Only A-Za-z0-9, dash (-) and underscore (_) allowed. Max 255 characters.');
            return;
        }

        // Check all arguments so that they are valid.
        for (const arg of this.state.args) {
            if (arg.type === ContractArgTypes.contract) {
                // Check so that the contract actually exists.
                if (this.getOtherContracts().indexOf(arg.value) === -1) {
                    alert(`Error: Contract arguments are not valid, missing: "${arg.value}".`);
                    return;
                }
            }
        }

        // Update dappfile, reset dirty flag and redraw to have everything synced.
        this.props.item.getParent().setName(this.state.name);
        const argsToSave = convertArgsToExternalModel(this.state.args);
        this.props.item.getParent().setArgs(argsToSave);
        this.props.item
            .getProject()
            .setContractName(
                this.props.item.getParent().getSource(),
                this.state.name,
                () => {
                    this.props.item
                        .getProject()
                        .setContractArgs(
                            this.props.item.getParent().getSource(),
                            argsToSave,
                            () => {
                                this.setState({
                                    isDirty: false,
                                });
                                this.props.router.control.redrawMain(); // It's important we redraw main so that the file items get updated from the dappfile.
                            }
                        );
                }
            );
    }

    getOtherContracts = () => {
        // Get all contracts registered in the dappfile.
        const list = this.props.item
            .getProject()
            .getHiddenItem('contracts')
            .getChildren();
        const contracts = [];
        for (let index = 0; index < list.length; index++) {
            const contract = list[index];
            if (contract.getName() === this.props.item.getParent().getName()) {
                continue;
            }
            contracts.push(contract.getSource());
        }
        return contracts;
    }

    getAccounts = () => {
        return this.props.item
            .getProject()
            .getHiddenItem('accounts')
            .getChildren()
            .map(account => account.getName());
    }

    onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        this.setState({
            name: value,
            isDirty: true,
        });
    }

    onArgumentChange = (change, index) => {
        this.setState((prevState: IState) => {
            return {
                isDirty: true,
                args: prevState.args.map((arg, i) => {
                    return (index !== i) ? arg : { ...arg, ...change };
                })
            };
        });
    }

    addArgument = () => {
        this.setState((prevState: IState) => ({
            isDirty: true,
            args: [...prevState.args, { type: ContractArgTypes.value, value: '' }]
        }));
    }

    removeArgument = (index: number) => {
        if (index > -1) {
            this.setState((prevState: IState) => ({
                args: prevState.args.filter((_, i) => i !== index),
                isDirty: true
            }));
        }
    }

    render() {
        if (!this.props.item) {
            return <div>Could not find contract in dappfile.json</div>;
        }
        const { name, args, isDirty } = this.state;
        const contractPath = this.props.item.getParent().getSource();

        return (
            <div id={this.id} className={style.main}>
                <div className='scrollable-y' id={this.id + '_scrollable'}>
                    <div className={style.inner}>
                        <h1 className={style.title}>Edit Contract {contractPath}</h1>
                        <div className={style.form}>
                            <div className='superInputDark'>
                                <label htmlFor='name'>Name</label>
                                <input
                                    id='name'
                                    type='text'
                                    onKeyUp={this.onNameChange}
                                    value={name}
                                    onChange={this.onNameChange}
                                />
                            </div>
                            <div className={style.constructorContainer}>
                                <ConstructorArgumentsHeader />
                                <ConstructorArgumentsList
                                    args={args}
                                    accounts={this.getAccounts()}
                                    otherContracts={this.getOtherContracts()}
                                    onArgChange={this.onArgumentChange}
                                    onArgRemove={this.removeArgument}
                                    onArgAdd={this.addArgument}
                                    />
                            </div>
                            <div>
                                <button href='#' className='btn2' disabled={!isDirty} onClick={this.save}>
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
