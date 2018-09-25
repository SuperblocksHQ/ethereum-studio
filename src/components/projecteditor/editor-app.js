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
import style from './style-editor-contract';
import Backend from './control/backend';


export default class AppEditor extends Component {
    constructor(props) {
        super(props);
        this.backend = new Backend();
        this.id=props.id+"_editor";
        this.props.parent.childComponent=this;
        this.dappfile = this.props.project.props.state.data.dappfile;
        this.app = this.dappfile.getObj().app || {};
        this.project = this.dappfile.getObj().project || {};
        this.project.info=this.project.info||{};
        this.project.info.title=this.project.info.title||"";
        this.setState({form:{title:this.project.info.title}});
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

    save = (e) => {
        e.preventDefault();
        if(this.state.form.title.length==0) {
            alert("Please give the project a snappy title.");
            return false;
        }
        if(this.state.form.title.match(/([\"\']+)/)) {
            alert('Illegal title. No special characters allowed.');
            return false;
        }
        this.project.info.title=this.state.form.title;
        this.dappfile.getObj().project=this.project;
        this.props.project.save((status)=>{
            if(status==0) {
                this.props.parent.close();
            }
        });
    };

    onChange = (e, key) => {
        var value=e.target.value;
        const form=this.state.form;
        form[key]=value;
        this.setState(form);
    };

    render() {
        return (<div id={this.id} class={style.main}>
            <div class="scrollable-y" id={this.id+"_scrollable"}>
                <div class={style.inner}>
                    <h1 class={style.title}>
                        Edit DApp Configuration
                    </h1>
                    <div class={style.form}>
                        <form action="">
                            <div class={style.field}>
                                <p>Title:</p>
                                <input maxLength="30" type="text" value={this.state.form.title} onChange={(e)=>{this.onChange(e, 'title')}} />
                            </div>
                            <a href="#" class="btn2" onClick={this.save}>Save</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>);
    }
}
