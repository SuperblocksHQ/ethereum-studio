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
import PropTypes from 'prop-types';
import classNames from 'classnames';
import style from './style-editor-contract';
import {
    IconTrash,
    IconAdd
} from '../icons';

class ConstructorArgument extends Component {

    getSelect = (active, options, onChange) => {
        return (<select onChange={onChange}>
            {options.map((option)=>{
                return (<option selected={active==option} value={option}>{option}</option>);
            })}
            </select>);
    };

    render() {
        const { argument, accounts, contractsBefore, index, onOptionSelected, onRemoveArgumentClicked } = this.props;
        var type = "value";
        var value;

        if (argument.account != null) {
            type = "account";
            const options = [];
            accounts.map((account) => options.push(account.name));
            argument[type] = argument[type] || options[0];

            if (options.indexOf(argument[type]) == -1) {
                // Chosen value does not exist
                this.isDirty = true;
                argument[type] = options[0];
            }
            value = this.getSelect(argument[type], options, (e) => {
                this.isDirty = true;
                argument[type] = e.target.value;
            });
        }
        else if (argument.contract != null) {
            type = "contract";
            const options = contractsBefore;
            argument[type] = argument[type] || options[0];

            if (options.indexOf(argument[type]) == -1) {
                // Chosen value does not exist
                this.isDirty = true;
                argument[type] = options[0];
            }

            value = this.getSelect(argument[type], options, (e) => {
                this.isDirty = true;
                argument[type] = e.target.value;
            });
        }
        else {
            value = (
                <div class={classNames(["superInputDark", style.valueContainer])}>
                    <input value={argument[type]} onChange={(e) => {
                        this.isDirty=true;
                        argument[type]=e.target.value;
                    }}/>
                </div>
            );
        }
        const select = this.getSelect(type, ["account","contract","value"], (e) => {
            this.isDirty = true;
            delete argument[type];
            argument[e.target.value] = "";
            onOptionSelected();
        });
        return (
            <div>
                {select}
                {value}
                <button class={classNames(["btnNoBg", style.iconTrash])} onClick={(e) => onRemoveArgumentClicked(e, index)}>
                    <IconTrash />
                </button>
            </div>
        );
    }
}

ConstructorArgument.propTypes = {
    argument: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired,
    contractsBefore: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    onOptionSelected: PropTypes.func.isRequired,
    onRemoveArgumentClicked: PropTypes.func.isRequired
}

export default class ContractEditor extends Component {
    constructor(props) {
        super(props);
        this.id=props.id+"_editor";
        this.props.parent.childComponent=this;
        this.dappfile = this.props.project.props.state.data.dappfile;
        this.contract = this.dappfile.getItem("contracts", [{name: props.contract}]);
        this.contract.obj.args = this.contract.obj.args || [];
        this.contract.obj.network = this.contract.obj.network || "browser";
        this._originalsourcepath=this.contract.get("source");
    }

    componentWillReceiveProps(props) {
        this.dappfile = props.project.props.state.data.dappfile;
    }

    componentDidMount() {
        this.redraw();
    }

    redraw = () => {
        this.setState();
    };

    focus = (rePerform) => {
    };

    canClose = (cb) => {
        if (this.isDirty) {
            const flag = confirm("There is unsaved data. Do you want to close tab and loose the changes?");
            cb(flag ? 0 : 1);
            return;
        }
        cb(0);
    };

    save = (e) => {
        e.preventDefault();
        if((this.contract.obj.name||"").length==0||(this.contract.obj.source||"").length==0) {
            alert('Error: Missing fields.');
            return;
        }
        if(!this.contract.obj.name.match(/^([a-zA-Z0-9-_]+)$/) || this.contract.obj.name.length > 255) {
            alert('Illegal contract name. Only A-Za-z0-9, dash (-) and underscore (_) allowed. Max 255 characters.');
            return;
        }
        for(var index=0;index<this.contract.obj.args.length;index++) {
            const arg=this.contract.obj.args[index];
            if(arg instanceof Object) {
                if((arg.value || arg.value==="") || arg.account) {
                    continue;
                }
                else if(arg.contract) {
                    if(this.getContractsBefore().indexOf(arg.contract)==-1) {
                        alert('Error: Contract arguments are not valid, contract "'+arg.contract+'" must be declared before this contract for it to be able to reference its address in its constructor.');
                        return;
                    }
                    continue;
                }
            }
            alert('Error: Arguments are not valid.');
            return;
        }
        const finalize=()=>{
            if(!this.dappfile.setItem("contracts", [{name: this.props.contract}], this.contract)) {
                alert('Dappfile.yaml updated. You need to reload projects before saving.');
                return;
            }
            this.props.project.save((status)=>{
                if(status==0) {
                    this.isDirty=false;
                    this.props.parent.close();
                    this.props.router.control._reloadProjects();
                }
            });
        };
        // TODO verify object validity?
        if (this.props.contract != this.contract.get('name')) {
            const contract2 = this.dappfile.getItem("contracts", [{name:this.contract.get("name")}]);
            if (contract2) {
                alert("A contract by this name already exists, choose a different name, please.");
                return;
            }
            // Check if any affected windows are open.
            this.props.router.control._closeAnyContractItemsOpen(this.props.contract, false, (status) => {
                if (status != 0) {
                    alert("Please close any editor, compile or deploy window which is open for this contract, then try again to rename it.");
                    return;
                }
                // Rename the source file too.
                const file=this.contract.get('source').match(".*/([^/]+$)")[1];
                this.props.project.renameFile(this._originalsourcepath, file, (status) => {
                    if (status == 4) {
                        // File doesn't exist (yet).
                        // Fall through
                    }
                    else if (status > 0) {
                        alert("Error: Could not rename contract source file. Please close the tab containing the contract's source code and try again.");
                        return;
                    }
                    else {
                        alert("Warning: You must now manually rename the contract and the constructor in the source file to match the new file name, if the contract is used as argument to any other contract that needs to be updated and finally the app.js content will need to be adjusted for the new contract name.");
                    }
                    finalize();
                });
            });
        }
        else {
            finalize();
        }
    };

    onChange = (e, key) => {
        var value=e.target.value;
        if (key == "name") {
            this.contract.set("source", "/contracts/"+value+".sol");
        }
        this.contract.set(key, value);
        this.isDirty = true;
        this.setState();
    };

    getContractsBefore = () => {
        const contracts=[];
        const list=this.props.project.props.state.data.dappfile.contracts();
        for(var index=0;index<list.length;index++) {
            const contract=list[index];
            if(contract.name==this.props.contract) break;
            contracts.push(contract.name);
        }
        return contracts;
    };

    renderArgs = () => {
        return (
            <div>
                { this.contract.obj.args.map((arg, index) => (
                    <div class={style.argumentContainer}>
                        <ConstructorArgument
                            index={index}
                            argument={arg}
                            accounts={this.getAccounts()}
                            contractsBefore={this.getContractsBefore()}
                            onOptionSelected={this.redraw}
                            onRemoveArgumentClicked={this.removeArgument}
                        /> , <br/>
                    </div>
                    ))
                }
            </div>
        )
    };

    getAccounts = () => {
        const ret=[];
        this.dappfile.accounts().map((account) => {
            ret.push(account)
        })
        return ret;
    };

    addArgument = (e) => {
        e.preventDefault();
        this.contract.obj.args.push({ value: "" })
        this.setState();
    };

    removeArgument = (e, index) => {
        e.preventDefault();
        if (index > -1) {
            this.contract.obj.args.splice(index, 1);
            this.setState();
        }
    };

    render() {
        if (!this.contract) {
            return (<div>Could not find {this.props.contract} in Dappfile.yaml</div>);
        }
        const args=this.renderArgs();
        return (<div id={this.id} class={style.main}>
            <div class="scrollable-y" id={this.id+"_scrollable"}>
                <div class={style.inner}>
                    <h1 class={style.title}>
                        Edit Contract {this.props.contract}
                    </h1>
                    <div class={style.form}>
                        <form action="">
                            <div class={style.field}>
                                <div class="superInputDark">
                                    <label for="name">Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        onKeyUp={(e)=>{this.onChange(e, 'name')}}
                                        value={this.contract.get("name")}
                                        onChange={(e)=>{this.onChange(e, 'name')}}
                                        />
                                </div>
                            </div>
                            <div class={style.constructorContainer}>
                                <h3>Constructor arguments</h3>
                                <p>When deploying your contract, you need to provide the initial values for the contract's constructor arguments.
                                <a href="#" target="_blank" rel="noopener noreferrer"> Learn more</a>
                                    <br/>
                                    <br/>
                                    <b>IMPORTANT:</b> The number of arguments must match the number of arguments on the contract constructor.</p>
                                <div class={style.argumentsContainer}>
                                    <p><b>No. args: </b>{this.contract.obj.args.length}</p>
                                    <div class={style.arguments}>
                                        <div>
                                            <b>{this.contract.obj.name} (</b>
                                            {
                                                this.contract.obj.args.length ? args : null
                                            }
                                            <button class={classNames(["btnNoBg", style.iconAdd])} onClick={this.addArgument}>
                                                <IconAdd />
                                            </button>
                                            <b>)</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button href="#" class="btn2" onClick={this.save}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>);
    }
}
