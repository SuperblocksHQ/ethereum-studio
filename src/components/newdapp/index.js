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
import Proptypes from 'prop-types';
import Step1 from './step1';
import Step2 from './step2';
import Templates from '../templates';

export default class NewDapp extends Component {

    state = {
        projectInfo: null,
        currentStep: 1,
    }

    onStep1DoneHandle = (projectInfo) => {
        this.setState({
            currentStep: 2,
            projectInfo: projectInfo
        });
    }

    onCancelClickHandle = () => {
        this.closeModal();
    }

    onTemplateSelectedHandle = (selectedTemplate) => {
        var dappfile = selectedTemplate.dappfile;

        // Make sure we include the info of the current project in the dappFile, in order to do not break anything in the app...
        const project = { info: this.state.projectInfo }
        dappfile.project = project;

        const files = selectedTemplate.files;

        this.props.backend.saveProject(this.state.projectInfo.name, { dappfile: dappfile }, o => this.props.cb(o.status, o.code), true, files);
        this.closeModal();
    }

    closeModal() {
        this.props.functions.modal.cancel();
    }

    pop = () => {
        this.setState({
            currentStep:  this.state.currentStep - 1
        })
    }

    render() {
        let step;
        switch (this.state.currentStep) {
            case 1:
                step = <Step1 onStep1Done={this.onStep1DoneHandle}
                            onCancelClick={this.onCancelClickHandle}/>;
                break;
            case 2:
                step = <Step2
                            categories={Templates.categories}
                            templates={Templates.templates}
                            onTemplateSelected={this.onTemplateSelectedHandle}
                            onBackPress={this.pop}/>;
                break;
            default:
                step = <Step1 onStep1Done={this.onStep1DoneHandle}/>;
                break;
        }

        return (
            <div>
                {step}
            </div>
        );
    }
}

NewDapp.proptypes = {
    modal: Proptypes.object.isRequired,
    functions: Proptypes.object.isRequired,
    cb: Proptypes.func.isRequired
}

 // const cb=(status, code) => {
    //     if(this.props.cb) {
    //         const index=this.props.functions.modal.getCurrentIndex();
    //         if(this.props.cb(status, code) !== false) this.props.functions.modal.close(index);
    //     }
    //     else {
    //         this.props.functions.modal.close();
    //     }
    // };
    // if(dappfileJSONObj) {
    //     this.props.backend.saveProject(project, {dappfile:dappfileJSONObj.dappfile}, (o)=>{cb(o.status,o.code)}, true, dappfileJSONObj.files)
    // }
    // else if(this.state.projectTemplate=="blank") {
    //     const tpl=Templates.tplBlank(project, title);
    //     const dappfile=tpl[0];
    //     const files=tpl[1];
    //     this.props.backend.saveProject(project, {dappfile:dappfile}, (o)=>{cb(o.status,o.code)}, true, files)
    // }
    // else if(this.state.projectTemplate=="HelloWorld") {
    //     const tpl=Templates.tplHelloWorld(project, title);
    //     const dappfile=tpl[0];
    //     const files=tpl[1];
    //     this.props.backend.saveProject(project, {dappfile:dappfile}, (o)=>{cb(o.status,o.code)}, true, files)
    // }
    // else if(this.state.projectTemplate=="RaiseToSummon") {
    //     const tpl=Templates.tplRaiseToSummon(project, title);
    //     const dappfile=tpl[0];
    //     const files=tpl[1];
    //     this.props.backend.saveProject(project, {dappfile:dappfile}, (o)=>{cb(o.status,o.code)}, true, files)
    // }
    // else if(this.state.projectTemplate=="NewsFeed") {
    //     const tpl=Templates.tplNewsFeed(project, title);
    //     const dappfile=tpl[0];
    //     const files=tpl[1];
    //     this.props.backend.saveProject(project, {dappfile:dappfile}, (o)=>{cb(o.status,o.code)}, true, files)
    // }
    // else if(this.state.projectTemplate=="Blank") {
    //     const tpl=Templates.tplBlank(project, title);
    //     const dappfile=tpl[0];
    //     const files=tpl[1];
    //     this.props.backend.saveProject(project, {dappfile:dappfile}, (o)=>{cb(o.status,o.code)}, true, files)
    // }
    // else {
    //     cb(1, 1);
    // }

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
    // };
