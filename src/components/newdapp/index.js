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
import SelectedTemplate from './selectTemplate';
import ProjectDetails from './projectDetails';
import Templates from '../templates';

export default class NewDapp extends Component {

    state = {
        selectedTemplate: null,
        currentStep: 1,
    }

    onCloseClickHandle = () => {
        this.closeModal();
    }

    onTemplateSelectedHandle = (selectedTemplate) => {
        this.setState({
            currentStep: 2,
            selectedTemplate: selectedTemplate
        })
    }

    onProjectDetailsDone = (projectInfo) => {
        var dappfile = this.state.selectedTemplate.dappfile;

        // Make sure we include the info of the current project in the dappFile, in order to do not break anything in the app...
        const project = { info: projectInfo }
        dappfile.project = project;

        const files = this.state.selectedTemplate.files;

        this.props.backend.saveProject(projectInfo.name, { dappfile: dappfile }, o => this.props.cb(o.status, o.code), true, files);

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
                step = <SelectedTemplate
                            categories={Templates.categories}
                            templates={Templates.templates}
                            onTemplateSelected={this.onTemplateSelectedHandle}
                            onBackPress={this.closeModal}
                            onCloseClick={this.onCloseClickHandle}/>;
                break;
            case 2:
                step = <ProjectDetails
                            projectName={this.state.projectInfo ? this.state.projectInfo.name : ""}
                            projectTitle={this.state.projectInfo ? this.state.projectInfo.title : ""}
                            onProjectDetailsDone={this.onProjectDetailsDone}
                            onCloseClick={this.onCloseClickHandle}
                            onBackClick={this.pop}/>;
                break;
            default:
                step = <AddProjectDetails onStep1Done={this.onStep1DoneHandle}/>;
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
