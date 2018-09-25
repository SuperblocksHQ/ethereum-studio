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
import style from './style-editor-account';

export default class AccountConstant extends Component {
    constructor(props) {
        super(props);
        this.id=props.id+"_editor";;
        this.props.parent.childComponent=this;
        this.dappfile = this.props.project.props.state.data.dappfile;
        this.constant = this.dappfile.getItem("constants", [{name: props.constant}]);
        this.form={env:""};
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

    save = (e) => {
        e.preventDefault();
        // TODO verify object validity?
        if(!this.constant.obj.name.match(/^([a-zA-Z0-9-_]+)$/)) {
            alert('Illegal constant name. Only A-Za-z0-9, dash (-) and underscore (_) allowed.');
            return;
        }
        if(!this.dappfile.setItem("constants", [{name: this.props.constant}], this.constant)) {
            alert('Dappfile.yaml updated. You need to reload projects before saving.');
            return;
        }
        this.props.project.save((status)=>{
            if(status==0) {
                this.props.parent.close();
            }
        });
    };

    onChange = (e, key) => {
        var value=e.target.value;
        if(value=="(default)") value=undefined;
        this.constant.set(key, value, (key!="name"?this.form.env:null));
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
        console.log("redraw edit constant");
        if(!this.constant) {
            return (<div>Could not find constant {this.props.constant} in Dappfile.yaml</div>);
        }
        const indexes=( () => {var ret=[];if(this.form.env) ret.push("(default)");for(var i=0;i<30;i++) ret.push(i);return ret;})();
        const toolbar=this.renderToolbar();
        const maxHeight = {
            height: this.getHeight() + "px"
        };
        return (<div id={this.id} class={style.main}>
            {toolbar}
            <div class="scrollable-y" style={maxHeight} id={this.id+"_scrollable"}>
                <h1 class={style.title}>
                    Edit Constant {this.props.constant}
                </h1>
                <div class={style.form}>
                    <form action="">
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
                            <p>Name:</p>
                            <input type="text" onKeyUp={(e)=>{this.onChange(e, 'name')}} value={this.constant.get("name")} onChange={(e)=>{this.onChange(e, 'name')}} />
                        </div>
                        <div class={style.field}>
                            <p>
                                Value:
                                <input type="text" onKeyUp={(e)=>{this.onChange(e, 'value')}} placeholder={ this.constant.get("value", this.form.env, false)===undefined?"(default)":"" } value={this.constant.get("value", this.form.env, false)} onChange={(e)=>{this.onChange(e, 'value')}} />
                                <button onClick={(e)=>{e.preventDefault();this.onChange({target:{}}, 'value')}}>Remove value</button>
                            </p>
                        </div>
                        <div>
                            <a href="#" class="btn2" onClick={this.save}>Save</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>);
    }
}
