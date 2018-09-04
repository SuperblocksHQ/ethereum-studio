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

    onCloseClickHandle = () => {
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
                step = <Step1
                            projectName={this.state.projectInfo ? this.state.projectInfo.name : ""}
                            projectTitle={this.state.projectInfo ? this.state.projectInfo.title : ""}
                            onStep1Done={this.onStep1DoneHandle}
                            onCloseClickHandle={this.onCloseClickHandle}/>;
                break;
            case 2:
                step = <Step2
                            categories={Templates.categories}
                            templates={Templates.templates}
                            onTemplateSelected={this.onTemplateSelectedHandle}
                            onBackPress={this.pop}
                            onCloseClickHandle={this.onCloseClickHandle}/>;
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
