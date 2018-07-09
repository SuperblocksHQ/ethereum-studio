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
import classnames from 'classnames';
import style from './style-editor-contract';
import Backend from  './backend';

import FaIcon  from '@fortawesome/react-fontawesome';
import iconSave from '@fortawesome/fontawesome-free-regular/faSave';
import iconCompile from '@fortawesome/fontawesome-free-solid/faPuzzlePiece';
import iconDeploy from '@fortawesome/fontawesome-free-regular/faPlayCircle';
import iconTest from '@fortawesome/fontawesome-free-solid/faFlask';
import iconDebug from '@fortawesome/fontawesome-free-solid/faBug';

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

    _download=()=>{
    };

    onChange = (e, key) => {
        var value=e.target.value;
        const form=this.state.form;
        form[key]=value;
        this.setState(form);
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

    render() {
        // Copy
        const dappfilejson=JSON.parse(JSON.stringify(this.props.dappfilejson));
        // Clear
        delete dappfilejson.dir;
        delete dappfilejson.inode;
        delete dappfilejson._filecache;
        if(dappfilejson.project) delete dappfilejson.project.info;
        // TODO delete all dotfiles.
        const clearDotfiles=(root)=>{
            const keys=Object.keys(root);
            for(var index=0;index<keys.length;index++) {
                const key=keys[index];
                if(key[0]=='.') {
                    delete root[key];
                    continue;
                }
                const node=root[key];
                if(node.type=='d') {
                    clearDotfiles(node.children);
                }
            }
        };
        clearDotfiles(dappfilejson.files);

        const toolbar=this.renderToolbar();
        const maxHeight = {
            height: this.getHeight() + "px"
        };
        return (<div id={this.id} class={style.main}>
            {toolbar}
            <div class="scrollable-y" style={maxHeight} id={this.id+"_scrollable"}>
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
            <div>
                <a href="#" onClick={(e)=>{e.preventDefault();this.backend.downloadProject(this.props.dappfilejson.dir);}}>Download project as JSON file</a>
            </div>
            </div>
        </div>);
    }
}
