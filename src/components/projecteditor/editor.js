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
import style from './style-editor';
import MonacoEditor from 'react-monaco-editor';
import FaIcon  from '@fortawesome/react-fontawesome';
import iconSave from '@fortawesome/fontawesome-free-regular/faSave';
import iconCompile from '@fortawesome/fontawesome-free-solid/faPuzzlePiece';
import iconDeploy from '@fortawesome/fontawesome-free-regular/faPlayCircle';
import iconTest from '@fortawesome/fontawesome-free-solid/faFlask';
import iconDebug from '@fortawesome/fontawesome-free-solid/faBug';
import iconCog from '@fortawesome/fontawesome-free-solid/faCog';
import iconChess from '@fortawesome/fontawesome-free-solid/faChess';

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.id=props.id+"_editor";
        this.props.parent.childComponent=this;
        this.langmap={
            js:"javascript",
            sol:"sol",
            sh:"shell",
        };
        this.editorObj;
        this.monacoObj;
        this.body={contents:"",state:-1};
        this.language="";
        var a=this.props.file.match(".*[.](.+)$");
        if(a) {
            const suffix=a[1].toLowerCase();
            if(this.langmap[suffix]) {
                this.language=this.langmap[suffix];
            }
            else {
                this.language=suffix;
            }
        }
    }

    componentDidMount() {
        if(this.props.file) this.loadContents();
        this.redraw();
    }

    _finalize = () => {
        this.props.project.closeFile(this.props.file);
    };

    canClose = (cb) => {
        if(this.body.state!=0) {
            if(confirm("File is not saved, close anyways?")) {
                this._finalize();
                cb(0);
                return
            }
            cb(1);
            return;
        }
        this._finalize();
        cb(0);
    };

    loadContents = () => {
        this.props.project.loadFile(this.props.file, (body) => {
            this.body=body;
            if(body.status==0) {
            }
            else {
                body.status=0;
                body.state=1;
                if(this.language=="sol") {
                    this.body.contents=`pragma solidity ^0.4.17;

contract `+this.props.contract.name+` {
}
`;
                }
            }
            this.redraw();
        });
    };

    getTitle = () => {
        if(this.body.state!=0) return "*" + this.props.item.props.title;
        return this.props.item.props.title;
    };

    save = (e) => {
        if(e) e.preventDefault();
        this.props.project.saveFile(this.props.file, (ret) => {
            if(ret.status==0) {
                this.body.state=0;
                this.props.parent.props.parent.props.parent.redraw();
            }
            else if(ret.status==2) {
            }
        });
    };

    compile = (e) => {
        this.save(e);
        const subitem = this.props.item.getChildren().filter((elm) => {
            return (elm.props.type2=="compile");

        })[0];
        if(subitem) this.props.router.panes.openItem(subitem, this.props.parent.props.parent.props.id);
    };

    deploy = (e) => {
        e.preventDefault();
        const subitem = this.props.item.getChildren().filter((elm) => {
            return (elm.props.type2=="deploy");

        })[0];
        if(subitem) this.props.router.panes.openItem(subitem, this.props.parent.props.parent.props.id);
    };

    configure = (e) => {
        e.preventDefault();
        const subitem = this.props.item.getChildren().filter((elm) => {
            return (elm.props.type2=="configure");

        })[0];
        if(subitem) this.props.router.panes.openItem(subitem, this.props.parent.props.parent.props.id);
    };

    interact = (e) => {
        e.preventDefault();
        const subitem = this.props.item.getChildren().filter((elm) => {
            return (elm.props.type2=="interact");

        })[0];
        if(subitem) this.props.router.panes.openItem(subitem, this.props.parent.props.parent.props.id);
    };

    textChange = (value) => {
        this.body.contents=value;
        if(this.body.state!=1) {
            this.body.state=1;
            this.props.parent.props.parent.props.parent.redraw();
        }
    };

    editorDidMount = (editorObj, monacoObj) => {
        this.editorObj=editorObj;
        this.monacoObj=monacoObj;
        editorObj.addCommand(monacoObj.KeyMod.CtrlCmd | monacoObj.KeyCode.KEY_S, ()=>{
            this.save();
        });
        this.focus();
    };

    redraw = () => {
        this.setState();
        this.updateLayout();
    };

    focus = (rePerform) => {
        if(this.editorObj) this.editorObj.focus();
    };

    updateLayout = () => {
        if(this.editorObj) this.editorObj.layout();
    };

    renderToolbar = () => {
        const stl={};
        if(this.body.state!=0) stl['color']='#ee1010';
        return (
            <div class={style.toolbar} id={this.id+"_header"}>
                <div class={style.buttons}>
                    <a href="#" title="Save" style={stl} onClick={this.save}><FaIcon icon={iconSave}/></a>
                    {this.props.type2=="contract" && <a href="#" title="Compile" onClick={this.compile}><FaIcon icon={iconCompile}/></a>}
                    {this.props.type2=="contract" && <a href="#" title="Deploy" onClick={this.deploy}><FaIcon icon={iconDeploy}/></a>}
                    {this.props.type2=="contract" && <a href="#" title="Configure" onClick={this.configure}><FaIcon icon={iconCog}/></a>}
                    {this.props.type2=="contract" && <a href="#" title="Interact" onClick={this.interact}><FaIcon icon={iconChess}/></a>}
                </div>
                <div class={style.info}>
                    <span>
                        {this.props.file}
                    </span>
                </div>
            </div>
        );
    };
    getHeight = () => {
        const a=document.getElementById(this.id);
        const b=document.getElementById(this.id+"_header");
        if(!a) return "99";
        return (a.offsetHeight - b.offsetHeight);
    };

    getWidth = () => {
        const a=document.getElementById(this.id);
        if(!a) return "99";
        return a.offsetWidth;
    };

    render() {
        const options = {
            selectOnLineNumbers: true
        };
        const toolbar=this.renderToolbar();
        const height=this.getHeight();
        const width=this.getWidth();
        if(height!=this.currentEditorHeight || width!=this.currentEditorWidth) {
            this.currentEditorHeight=height;
            this.currentEditorWidth=width;
            setTimeout(this.updateLayout, 1);
        }
        return (
          <div class="full" id={this.id}>
              {toolbar}
              <MonacoEditor
                key={this.id}
                height={height}
                language={this.language}
                theme="vs-dark"
                value={this.body.contents}
                options={options}
                onChange={(value)=>this.textChange(value)}
                editorDidMount={(obj, monaco)=>this.editorDidMount(obj, monaco)}
              />
          </div>
        );
    }
}
