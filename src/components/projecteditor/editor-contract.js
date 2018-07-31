// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Studio.
//
// Superblocks Studio is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Studio is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Studio.  If not, see <http://www.gnu.org/licenses/>.

import { h, Component } from 'preact';
import style from './style-editor-contract';

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
        this.form={env:""};
    }

    componentDidMount() {
        this.redraw();
    }

    redraw = () => {
        this.setState();
    };

    focus = (rePerform) => {
    };

    save = (e) => {
        e.preventDefault();
        if((this.contract.obj.name||"").length==0||(this.contract.obj.source||"").length==0||(this.contract.obj.account||"").length==0) {
            alert('Error: Missing fields.');
            return;
        }
        if(!this.contract.obj.name.match(/^([a-zA-Z0-9-_]+)$/)) {
            alert('Illegal contract name. Only A-Za-z0-9, dash (-) and underscore (_) allowed.');
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
                    this.props.parent.close();
                    this.props.router.control._reloadProjects();
                }
            });
        }
        // TODO verify object validity?
        if(this.props.contract!=this.contract.get('name')) {
            const contract2 = this.dappfile.getItem("contracts", [{name:this.contract.get("name")}]);
            if(contract2) {
                alert("A contract by this name already exists, choose a different name, please.");
                return;
            }
            // Rename the source file too.
            const file=this.contract.get('source').match(".*/([^/]+$)")[1];
            this.props.project.renameFile(this._originalsourcepath, file, (status)=>{
                if(status==4) {
                    // File doesn't exist (yet).
                    // Fall through
                }
                else if(status>0) {
                    alert("Error: Could not rename contract source file. Close the editor and try again.");
                    return;
                }
                else {
                    alert("Warning: You must now manually rename the constructor in the contract source file to match the new name.");
                }
                finalize();
            });
        }
        else {
            finalize();
        }
    };

    onChange = (e, key) => {
        var value=e.target.value;
        if(key=="name") {
            this.contract.set("source", "/contracts/"+value+".sol");
        }
        if(value=="(default)") value=undefined;
        this.contract.set(key, value, (key!="name"?this.form.env:null));
        this.setState();
    };

    getSelect = (active, options, onChange) => {
        return (<select onChange={onChange}>
            {options.map((option)=>{
                return (<option selected={active==option} value={option}>{option}</option>);
            })}
            </select>);
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
        const ret=this.contract.obj.args.map((arg, index)=> {
            var type="value";
            var value;
            if(arg.account!=null) {
                type="account";
                const options=[];
                const accounts=this.getAccounts(false);
                accounts.map((account) => options.push(account.name));
                arg[type] = arg[type] || options[0];
                value=this.getSelect(arg[type], options, (e) => {
                    arg[type]=e.target.value;
                });
            }
            else if(arg.contract!=null) {
                type="contract";
                const options=this.getContractsBefore();
                arg[type] = arg[type] || options[0];
                value=this.getSelect(arg[type], options, (e) => {
                    arg[type]=e.target.value;
                });
            }
            else {
                value=(<input value={arg[type]} onChange={(e) => {
                    arg[type]=e.target.value;
                }}/>);
            }
            const select=this.getSelect(type, ["account","contract","value"], (e) => {
                delete arg[type];
                arg[e.target.value]="";
                this.redraw();
            });
            return (
                <div style="display: inline;">
                    {select}
                    {value}
                </div>
            );
        });
        return ret;
    };

    getAccounts = (useDefault) => {
        const ret=[];
        if(this.form.env && useDefault!==false) ret.push({name:"(default)"});
        this.dappfile.accounts().map((account) => {
            ret.push(account)
        })
        return ret;
    };

    getNetworks = () => {
        const ret=[];
        if(this.form.env) ret.push("(default)");
        ["browser", "local","ropsten","rinkeby","infuranet","kovan","mainnet"].map((network) => {
            ret.push(network)
        })
        return ret;
    };

    incArg = (e) => {
        e.preventDefault();
        this.contract.obj.args.push({value:""})
        this.setState();
    };

    decArg = (e) => {
        e.preventDefault();
        this.contract.obj.args.splice(-1,1);
        this.setState();
    };

    renderToolbar = () => {
        return (
            <div class={style.toolbar} id={this.id+"_header"}>
                <div>
                </div>
            </div>
        );
    };
                    //<a href="#" title="Save" onClick={this.save}><FaIcon icon={iconSave}/></a>
                    //<a href="#" title="Compile" onClick={this.compile}><FaIcon icon={iconCompile}/></a>
                    //<a href="#" title="Deploy"><FaIcon icon={iconDeploy}/></a>
                    //<a href="#" title="Test"><FaIcon icon={iconTest}/></a>
                    //<a href="#" title="Debug in Remix"><FaIcon icon={iconDebug}/></a>

    getHeight = () => {
        const a=document.getElementById(this.id);
        const b=document.getElementById(this.id+"_header");
        if(!a) return 99;
        return (a.offsetHeight - b.offsetHeight);
    };

    onEnvChange = (e) => {
        e.preventDefault();
        this.form.env=e.target.value;
        this.setState();
    };

    render() {
        if(!this.contract) {
            return (<div>Could not find {this.props.contract} in Dappfile.yaml</div>);
        }

        const args=this.renderArgs();
        const accounts=this.getAccounts();
        const networks=this.getNetworks();
        const toolbar=this.renderToolbar();
        const maxHeight = {
            height: this.getHeight() + "px"
        };
        return (<div id={this.id} class={style.main}>
            {toolbar}
            <div class="scrollable-y" style={maxHeight} id={this.id+"_scrollable"}>
                <h1 class={style.title}>
                    Edit Contract {this.props.contract}
                </h1>
                <div class={style.form}>
                    <form action="">
                        <div class={style.field}>
                            <p>Name:</p>
                            <input type="text" onKeyUp={(e)=>{this.onChange(e, 'name')}} value={this.contract.get("name")} onChange={(e)=>{this.onChange(e, 'name')}} />
                        </div>
                        <div class={style.field} style="display:none;">
                            <p>
                                Source:
                            </p>
                            <input type="text" onChange={(e)=>{this.onChange(e, 'source')}} value={this.contract.get("source")} />
                        </div>
                        <div class={style.field}>
                            <p>
                                Account:
                            </p>
                            <select onChange={(e)=>{this.onChange(e, 'account')}} value={this.contract.get('account')}>
                                {accounts.map((account) => {
                                    return (<option
                                        selected={account.name==this.contract.get('account')}
                                        value={account.name}>{account.name}</option>);
                                })}
                            </select>
                        </div>
                        <div>
                            <p>Contract constructor arguments. The number of arguments must match the number of arguments on the contract constructor.</p>
                            <div>
                                <p>No. args: {this.contract.obj.args.length}
                                    <a href="#" onClick={this.incArg} title="Increase arguments">+</a>
                                    <a href="#" onClick={this.decArg} title="Decrease arguments">-</a>
                                </p>
                            </div>
                            <div class={style.arguments}>
                                <div>{this.contract.obj.name}({args})</div>
                            </div>
                        </div>
                        <div>
                        <div class={style.field}>
                            <p>
                                Environment:
                            </p>
                            <select key="envs" onChange={this.onEnvChange} value={this.form.env}>
                                <option value="">(default)</option>
                                {this.dappfile.environments().map((env) => {
                                    return (<option
                                        value={env.name}>{env.name}</option>);
                                })}
                            </select>
                        </div>
                        <div class={style.field}>
                            <p>
                                Network:
                            </p>
                            <select key="networks" value={(this.contract.get('network', this.form.env, false) || "(default)")}
                                    onChange={(e)=>{this.onChange(e, 'network')}}>
                                {networks.map((network)=>{
                                    return (<option
                                        value={network}>{network}</option>);})}
                            </select>
                        </div>



                            <a href="#" class="btn2" onClick={this.save}>Save</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>);
    }
}
