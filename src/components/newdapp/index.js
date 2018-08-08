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
import classnames from 'classnames';
import style from './style';
import Templates from '../templates';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

class Step1 extends Component {

    state = {
        projectName: "",
        projectTitle: "",
        isValid: false
    }

    validateInputs () {
        let { projectName, projectTitle } = this.state;
        var validInputs = false;
        if (projectName == "") {
            alert("Please give the project a name.");
        } else if (!projectName.match(/^([a-zA-Z0-9-]+)$/)) {
            alert('Illegal projectname. Only A-Za-z0-9 and dash (-) allowed.');
        } else if (projectTitle == "") {
            alert("Please give the project a snappy title.");
        } else if (projectTitle.match(/([\"\']+)/)) {
            alert('Illegal title. No special characters allowed.');
        } else if (projectName.length > 20 || projectTitle.length > 20) {
            alert('Sorry, the project name or title is way to long! (Max 20 chars).');
        } else {
            validInputs = true;
        }

        return validInputs;
    }

    add = (evt, dappfileJSONObj) => {
        if (evt) evt.preventDefault();

        if (dappfileJSONObj) {
            // We assume its validity is checked already.
            this.setState({ projectTitle: updatupdatedappfileJSONObj.dappfile.project.info.title});
        }

        // TODO - Make sure we  validate this and don't forget to turn off!
        // if (this.validateInputs()) {
            this.props.onStep1Done();
        //}
    };

    cancel = () => {
     // this.props.modal.cancel=this.props.modal.cancel||this.cancel;'
    };

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

    render() {
        return (
            <div className={classnames([style.newDapp, "modal"])}>
                <div class={style.step1}>
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
                        <a onClick={this.cancel} class="btn2 noBg" href="#">Cancel</a>
                        <a onClick={this.add} class="btn2"   href="#">Next</a>
                    </div>
                </div>
            </div>
        );
    }
}

Step1.protoTypes = {
    onStep1Done: Proptypes.func
}


class Step2 extends Component {
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

    state = {
        sectionSelected: 0
    }

    createProject = () => {
        // TODO
    }

    back = () => {
        this.props.onBackPress();
    }

    onSectionSelected(id) {
        this.setState({
            sectionSelected: id
        })
    }

    render() {
        let { sections, templates } = Templates;
        let { sectionSelected } = this.state;

        return(
            <div className={classnames([style.newDapp, "modal"])}>
                <div class={style.step2}>
                    <div class={style.header}>
                        <div class={style.title}>Select Template</div>
                    </div>
                    <div class={style.area}>
                        <div style="display: flex;">
                            <div class={style.sectionsArea}>
                                <ul>
                                    {
                                        sections.map(section =>
                                            <li class={sectionSelected == section.id ? style.selected : null}>
                                                <TemplateSection
                                                    title={section.name}
                                                    onSectionSelected={() => this.onSectionSelected(section.id)}/>
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                            <div class={style.templateListArea}>
                                <GridLayout templates={templates}/>
                            </div>
                        </div>
                    </div>
                    <div class={style.footer}>
                        <a onClick={this.back} class="btn2 noBg" href="#">Back</a>
                        <a onClick={this.createProject} class="btn2" href="#">Create Project</a>
                    </div>
                </div>
            </div>
        );
    }
}

const TemplateSection = (props) => (
    <div onClick={props.onSectionSelected}>{props.title}</div>
)

// class TemplateSection extends Component {
//     render() {
//         return (

//         );
//     }
// }

const GridLayout = (props) => (
    <div class={style.gridLayout}>
        <div id="mainContent" className="container" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '10px', gridAutoRows: 'minMax(100px, auto)'}}>
        { props.templates.map((template) => (
                <TemplateLayout template={template}/>
        ))}
        </div>
    </div>
);

const TemplateLayout = (props) => (
    <div class={style.templateLayout}>
        <img src={props.template.image} width="300"/>
        <div class={style.title}>{props.template.name}</div>
        <div class={style.description}>{props.template.description}</div>
    </div>
)

TemplateSection.protoTypes = {
    title: Proptypes.string,
    onSectionSelected: Proptypes.func
}

export default class DevkitNewDapp extends Component {

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
