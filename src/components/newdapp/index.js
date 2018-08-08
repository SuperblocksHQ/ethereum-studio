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
import Step1 from './step1';
import Step2 from './step2';

export default class NewDapp extends Component {

    state = {
        currentStep: 1,
    }

    constructor(props) {
        super(props);
        // this.setState({projectTemplate:"HelloWorld"});
        // this.setState({
        //     projectName: "",
        //     projectTitle: "",
        //     projectGitUrl: ""
        // });
        // this.templates=new Templates();
        // this.props.modal.cancel=this.props.modal.cancel||this.cancel;
    }

    onStep1DoneHandle = () => {
        this.setState({
            currentStep: 2
        });
    }

    onStep2DoneHandle = () => {
        // this.setState({
        //     currentStep: 2
        // });
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
                step = <Step1 onStep1Done={this.onStep1DoneHandle}/>;
                break;
            case 2:
                step = <Step2 onStep2Done={this.onStep2DoneHandle}
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



    // _clickProject = (e) => {
    //     e.preventDefault();
    //     document.querySelector('#wsProjectFileInput').dispatchEvent(new MouseEvent('click')); // ref does not work https://github.com/developit/preact/issues/477
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
