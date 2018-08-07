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
import style from './style';
import Templates from '../templates';

class Step1 extends Component {

}

class Step2 extends Component {

}

export default class DevkitNewDapp extends Component {
    constructor(props) {
        super(props);
        this.setState({projectTemplate:"HelloWorld"});
        this.setState({
            projectName: "",
            projectTitle: "",
            projectGitUrl: ""
        });
        this.templates=new Templates();
        this.props.modal.cancel=this.props.modal.cancel||this.cancel;
    }

    add = (evt, dappfileJSONObj) => {
        if(evt) evt.preventDefault();
        var title=this.state.projectTitle;
        if(dappfileJSONObj) {
            // We assume its validity is checked already.
            title=dappfileJSONObj.dappfile.project.info.title;
        }
        var project=this.state.projectName;
        if(project=="") {
            alert("Please give the project a name.");
            return;
        }
        if(!project.match(/^([a-zA-Z0-9-]+)$/)) {
            alert('Illegal projectname. Only A-Za-z0-9 and dash (-) allowed.');
            return;
        }
        if(title=="") {
            alert("Please give the project a snappy title.");
            return;
        }
        if(title.match(/([\"\']+)/)) {
            alert('Illegal title. No special characters allowed.');
            return;
        }
        if(project.length>20 || title.length>30) {
            return;
        }
        const cb=(status, code) => {
            if(this.props.cb) {
                const index=this.props.functions.modal.getCurrentIndex();
                if(this.props.cb(status, code) !== false) this.props.functions.modal.close(index);
            }
            else {
                this.props.functions.modal.close();
            }
        };
        if(dappfileJSONObj) {
            this.props.backend.saveProject(project, {dappfile:dappfileJSONObj.dappfile}, (o)=>{cb(o.status,o.code)}, true, dappfileJSONObj.files)
        }
        else if(this.state.projectTemplate=="blank") {
            const tpl=Templates.tplBlank(project, title);
            const dappfile=tpl[0];
            const files=tpl[1];
            this.props.backend.saveProject(project, {dappfile:dappfile}, (o)=>{cb(o.status,o.code)}, true, files)
        }
        else if(this.state.projectTemplate=="HelloWorld") {
            const tpl=Templates.tplHelloWorld(project, title);
            const dappfile=tpl[0];
            const files=tpl[1];
            this.props.backend.saveProject(project, {dappfile:dappfile}, (o)=>{cb(o.status,o.code)}, true, files)
        }
        else if(this.state.projectTemplate=="RaiseToSummon") {
            const tpl=Templates.tplRaiseToSummon(project, title);
            const dappfile=tpl[0];
            const files=tpl[1];
            this.props.backend.saveProject(project, {dappfile:dappfile}, (o)=>{cb(o.status,o.code)}, true, files)
        }
        else if(this.state.projectTemplate=="NewsFeed") {
            const tpl=Templates.tplNewsFeed(project, title);
            const dappfile=tpl[0];
            const files=tpl[1];
            this.props.backend.saveProject(project, {dappfile:dappfile}, (o)=>{cb(o.status,o.code)}, true, files)
        }
        else if(this.state.projectTemplate=="Blank") {
            const tpl=Templates.tplBlank(project, title);
            const dappfile=tpl[0];
            const files=tpl[1];
            this.props.backend.saveProject(project, {dappfile:dappfile}, (o)=>{cb(o.status,o.code)}, true, files)
        }
        else {
            cb(1, 1);
        }
    };

    _clickProject = (e) => {
        e.preventDefault();
        document.querySelector('#wsProjectFileInput').dispatchEvent(new MouseEvent('click')); // ref does not work https://github.com/developit/preact/issues/477
    }

    // TODO - Move out from here
    // _uploadProject = (e) => {
    //     e.preventDefault();
    //     var project=this.state.projectName;
    //     if(project=="") {
    //         alert("Please give the project a name.");
    //         document.querySelector('#wsProjectFileInput').value = "";
    //         return;
    //     }
    //     if(!project.match(/^([a-zA-Z0-9-]+)$/)) {
    //         alert('Illegal projectname. Only A-Za-z0-9 and dash (-) allowed.');
    //         document.querySelector('#wsProjectFileInput').value = "";
    //         return;
    //     }
    //     var contentJSON="";

    //     var files = document.querySelector('#wsProjectFileInput').files;
    //     var file = files[0];

    //     const handler=(status, code) => {
    //         if(this.props.cb) {
    //             const index=this.props.functions.modal.getCurrentIndex();
    //             if(this.props.cb(status, code) !== false) this.props.functions.modal.close(index);
    //         }
    //         else {
    //             this.props.functions.modal.close();
    //         }
    //     };

    //     this.props.backend.uploadProject(project, file, handler, err => {
    //         if(err) {
    //             alert(err);
    //         }
    //         this.props.functions.modal.close();
    //     });

    //     e.target.value = '';
    // }

    handleNameChange = changeEvent => {
        this.setState({
            projectName: changeEvent.target.value
        });
    }

    handleTitleChange = changeEvent => {
        this.setState({
            projectTitle: changeEvent.target.value
        });
    };

    handleGitUrlChange = changeEvent => {
        this.setState({
            projectGitUrl: changeEvent.target.value
        });
    };

    handleTemplateChange = changeEvent => {
        changeEvent.preventDefault();
        // It can't be in the same cycle???
        setTimeout(()=>{this.setState({projectTemplate:changeEvent.target.value})},1);
    };

    cancel = () => {
    };

    render() {
        return (
            <div className={classnames([style.newDapp, "modal"])}>
                <div class={style.header}>
                    <div class={style.title}>Create a new project</div>
                </div>
                <div class={style.area}>
                    <div class={style.form}>
                        <div class={style.info}>
                            <div class="superInput">
                                <p class="label">Project name</p>
                                <input
                                    type="text"
                                    maxLength="20"
                                    value={this.state.projectName}
                                    onChange={this.handleNameChange}
                                    placeholder="Enter project name"/>
                            </div>
                            <div class="superInput my-3">
                                <p class="label">DApp (HTML) Title: </p>
                                <input
                                    type="text"
                                    maxLength="30"
                                    value={this.state.projectTitle}
                                    onChange={this.handleTitleChange}
                                    placeholder="Project HTML page title"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class={style.footer}>
                    <a onClick={this.props.functions.modal.cancel} class="btn2 noBg" href="#">Cancel</a>
                    <a onClick={this.add} class="btn2"   href="#">Next</a>
                </div>
            </div>
        );
    }
}
