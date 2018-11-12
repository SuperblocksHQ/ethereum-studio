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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import style from './style-editor-contract.less';
import { IconTrash, IconAdd } from '../icons';

class ConstructorArgument extends Component {

    getSelect = (active, options, onChange) => {
        return (
            <select value={active} onChange={onChange}>
                {options.map(option => {
                    return (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    );
                })}
            </select>
        );
    };

    render() {
        const {
            argument,
            accounts,
            otherContracts,
            index,
            onOptionSelected,
            onRemoveArgumentClicked,
            setDirty,
        } = this.props;
        var type = 'value';
        var value;

        if (argument.account != null) {
            type = 'account';
            const options = [];
            accounts.map(account => options.push(account.getName()));
            argument[type] = argument[type] || options[0];

            if (options.indexOf(argument[type]) == -1) {
                // Chosen value does not exist
                setDirty();
                argument[type] = options[0];
            }
            value = this.getSelect(argument[type], options, e => {
                setDirty();
                argument[type] = e.target.value;
            });
        } else if (argument.contract != null) {
            type = 'contract';
            const options = otherContracts;
            argument[type] = argument[type] || options[0];

            if (options.indexOf(argument[type]) == -1) {
                // Chosen value does not exist
                setDirty();
                argument[type] = options[0];
            }

            value = this.getSelect(argument[type], options, e => {
                setDirty();
                argument[type] = e.target.value;
            });
        } else {
            value = (
                <div
                    className={classNames(['superInputDark', style.valueContainer])}
                >
                    <input
                        value={argument[type]}
                        onChange={e => {
                            setDirty();
                            argument[type] = e.target.value;
                        }}
                    />
                </div>
            );
        }
        const select = this.getSelect(
            type,
            ['account', 'contract', 'value'],
            e => {
                setDirty();
                delete argument[type];
                argument[e.target.value] = '';
                onOptionSelected();
            }
        );
        return (
            <div>
                {select}
                {value}
                <button
                    className={classNames(['btnNoBg', style.iconTrash])}
                    onClick={e => onRemoveArgumentClicked(e, index)}
                >
                    <IconTrash />
                </button>
            </div>
        );
    }
}

ConstructorArgument.propTypes = {
    argument: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired,
    otherContracts: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    onOptionSelected: PropTypes.func.isRequired,
    onRemoveArgumentClicked: PropTypes.func.isRequired,
    setDirty: PropTypes.func.isRequired,
};

export default class ContractEditor extends Component {

    state = {
        args: [],
        name: "",
        isDirty: false,
    }

    constructor(props) {
        super(props);
        this.id = props.id + '_editor';
        this.props.parent.childComponent = this;
    }

    componentWillReceiveProps(props) {
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
                args: this.props.item.getParent().getArgs() || [] // Get the args of the ContractItem.
            });
        }
    };

    redraw = () => {
        this.forceUpdate();
    };

    canClose = (cb, silent) => {
        if (this.state.isDirty && !silent) {
            const flag = window.confirm(
                'There is unsaved data. Do you want to close tab and loose the changes?'
            );
            cb(flag ? 0 : 1);
            return;
        }
        cb(0);
    };

    save = e => {
        e.preventDefault();

        if (this.state.name.length == 0) {
            alert('Error: Missing name.');
            return;
        }

        if (!this.state.name.match(/^([a-zA-Z0-9-_]+)$/) || this.state.name.length > 255) {
            alert('Illegal contract name. Only A-Za-z0-9, dash (-) and underscore (_) allowed. Max 255 characters.');
            return;
        }

        // Check all arguments so that they are valid.
        for (let index = 0; index < this.state.args.length; index++) {
            const arg = this.state.args[index];
            if (arg instanceof Object) {
                if (arg.value || arg.value === '' || arg.account) {
                    // All good
                    continue;
                } else if (arg.contract) {
                    // Check so that the contract actually exists.
                    if (this.getOtherContracts().indexOf(arg.contract) == -1) {
                        alert(
                            'Error: Contract arguments are not valid, missing: "' +
                                arg.contract +
                                '".'
                        );
                        return;
                    }
                    continue;
                }
            }
            alert('Error: Constructor arguments are not valid.');
            return;
        }

        // Update dappfile, reset dirty flag and redraw to have everything synked.
        //
        this.props.item.getParent().setName(this.state.name);
        this.props.item.getParent().setArgs(this.state.args);
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
                            this.state.args,
                            () => {
                                this.setState({
                                    isDirty: false,
                                });
                                this.props.router.control.redrawMain(); // It's important we redraw main so that the file items get updated from the dappfile.
                            }
                        );
                }
            );
    };

    onChange = (e, key) => {
        const value = e.target.value;
        if (key == 'name') {
            this.setState({
                name: value,
                isDirty: true,
            });
        }
    };

    getOtherContracts = () => {
        // Get all contracts registered in the dappfile.
        const list = this.props.item
            .getProject()
            .getHiddenItem('contracts')
            .getChildren();
        const contracts = [];
        for (var index = 0; index < list.length; index++) {
            const contract = list[index];
            if (contract.getName() == this.props.item.getParent().getName())
                continue;
            contracts.push(contract.getSource());
        }
        return contracts;
    };

    renderArgs = () => {
        return (
            <div>
                {
                    this.state.args.map((arg, index) => {
                        return (
                            <div key={index} className={style.argumentContainer}>
                                <ConstructorArgument
                                    index={index}
                                    argument={arg}
                                    accounts={this.getAccounts()}
                                    otherContracts={this.getOtherContracts()}
                                    onOptionSelected={this.redraw}
                                    onRemoveArgumentClicked={this.removeArgument}
                                    setDirty={() => {
                                        this.setState({ isDirty: true });
                                    }}
                                />{' '}
                                , <br />
                            </div>
                        )})
                }
            </div>
        )
    }

    getAccounts = () => {
        const ret = [];
        this.props.item
            .getProject()
            .getHiddenItem('accounts')
            .getChildren()
            .map(account => {
                ret.push(account);
            });
        return ret;
    };

    addArgument = e => {
        e.preventDefault();
        this.setState(prevState => ({
            args: [...prevState.args, { value: '' }]
        }));
    };

    removeArgument = (e, index) => {
        e.preventDefault();
        if (index > -1) {
            this.setState(prevState => ({
                args: prevState.args.filter((_, i) => i !== index),
                isDirty: true
            }));
        }
    };

    render() {
        if (!this.props.item) {
            return <div>Could not find contract in dappfile.json</div>;
        }
        const constructorArgument = this.renderArgs();
        const { name, args, isDirty } = this.state;
        return (
            <div id={this.id} className={style.main}>
                <div className="scrollable-y" id={this.id + '_scrollable'}>
                    <div className={style.inner}>
                        <h1 className={style.title}>
                            Edit Contract{' '}
                            {this.props.item.getParent().getSource()}
                        </h1>
                        <div className={style.form}>
                            <form action="">
                                <div className={style.field}>
                                    <div className="superInputDark">
                                        <label htmlFor="name">Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            onKeyUp={e => {
                                                this.onChange(e, 'name');
                                            }}
                                            value={name}
                                            onChange={e => {
                                                this.onChange(e, 'name');
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className={style.constructorContainer}>
                                    <h3>Constructor arguments</h3>
                                    <p>
                                        When deploying your contract, you need
                                        to provide the initial values for the
                                        contract's constructor arguments.
                                        <a
                                            href="https://help.superblocks.com/hc/en-us/articles/360008422373-Working-with-smart-contracts"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {' '}
                                            Learn more
                                        </a>
                                        <br />
                                        <br />
                                        <b>IMPORTANT:</b> The number of
                                        arguments must match the number of
                                        arguments on the contract constructor.
                                    </p>
                                    <div className={style.argumentsContainer}>
                                        <p>
                                            <b>No. args: </b>
                                            {args.length}
                                        </p>
                                        <div className={style.arguments}>
                                            <div>
                                                <b>{name} (</b>
                                                {args.length
                                                    ? constructorArgument
                                                    : null}
                                                <button
                                                    className={classNames([
                                                        'btnNoBg',
                                                        style.iconAdd,
                                                    ])}
                                                    onClick={this.addArgument}
                                                >
                                                    <IconAdd />
                                                </button>
                                                <b>)</b>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        href="#"
                                        className="btn2"
                                        disabled={!isDirty}
                                        onClick={this.save}
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
