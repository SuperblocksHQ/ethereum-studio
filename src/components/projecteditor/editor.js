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
import style from './style-editor';
import MonacoEditor from 'react-monaco-editor';
import { IconSave, IconCompile, IconDeploy, IconConfigure, IconInteract } from '../icons';

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.id=props.id+"_editor";
        this.props.parent.childComponent=this;
        this.langmap={
            js:"javascript",
            sol:"sol",
            sh:"shell",
            md:"markdown",
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
                    this.body.contents=`pragma solidity ^0.4.25;

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
                    <button class="btnNoBg" title="Save" style={stl} onClick={this.save}><IconSave /></button>
                    {this.props.type2=="contract" && <button class="btnNoBg" title="Compile" onClick={this.compile}><IconCompile /></button>}
                    {this.props.type2=="contract" && <button class="btnNoBg" title="Deploy" onClick={this.deploy}><IconDeploy style={{ verticalAlign:'middle'}} /></button>}
                    {this.props.type2=="contract" && <button class="btnNoBg" title="Configure" onClick={this.configure}><IconConfigure /></button>}
                    {this.props.type2=="contract" && <button class="btnNoBg" title="Interact" onClick={this.interact}><IconInteract style={{ verticalAlign:'middle'}}/></button>}
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
