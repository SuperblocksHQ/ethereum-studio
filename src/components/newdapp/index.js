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

import React, { Component } from 'react';
import Proptypes from 'prop-types';
import SelectedTemplate from './selectTemplate';
import ProjectDetails from './projectDetails';
import Templates from '../../templates';
import { logEvent, Analytics } from "../../analytics";
import DappfileItem from '../projecteditor/control/item/dappfileItem';
import JSZipUtils from 'jszip-utils';

export default class NewDapp extends Component {
    state = {
        selectedTemplate: null,
        currentStep: 1,
    };

    onCloseClickHandle = () => {
        this.closeModal();
    };

    onTemplateSelectedHandle = selectedTemplate => {
        this.setState({
            currentStep: 2,
            selectedTemplate: selectedTemplate,
        });
    };

    onProjectDetailsDone = async projectInfo => {
        const fn = (files) => {
            // Try to decode the `/dappfile.json`.
            var dappfile;
            try {
                dappfile = JSON.parse(
                    files['/'].children['dappfile.json'].contents
                );
            } catch (e) {
                dappfile = DappfileItem.getDefaultDappfile();
                files['/'].children['dappfile.json'] = { type: 'f' };
            }
            dappfile.project.info.name = name;
            dappfile.project.info.title = title;
            files['/'].children['dappfile.json'].contents = JSON.stringify(
                dappfile, null, 4
            );

            this.props.backend.createProject(files, status =>
                this.props.cb(status)
            );

            logEvent('PROJECT_CREATED', { template: this.state.selectedTemplate.name});

            this.closeModal();
        };

        const name = projectInfo.name;
        const title = projectInfo.title;

        JSZipUtils.getBinaryContent(this.state.selectedTemplate.zip, async (err, data) => {
            if (err) {
                alert('Error: Could not load zip file.');
                return;
            }
            const project = await this.props.backend.unZip(data);
            fn(project.files);
        });
    };

    closeModal() {
        this.props.functions.modal.cancel();
    }

    pop = () => {
        this.setState({
            currentStep: this.state.currentStep - 1,
        });
    };

    render() {
        let step;
        switch (this.state.currentStep) {
            case 1:
                step = (
                    <SelectedTemplate
                        categories={Templates.categories}
                        templates={Templates.templates}
                        onTemplateSelected={this.onTemplateSelectedHandle}
                        onBackPress={this.closeModal}
                        onCloseClick={this.onCloseClickHandle}
                    />
                );
                break;
            case 2:
                step = (
                    <ProjectDetails
                        projectName={
                            this.state.projectInfo
                                ? this.state.projectInfo.name
                                : ''
                        }
                        projectTitle={
                            this.state.projectInfo
                                ? this.state.projectInfo.title
                                : ''
                        }
                        onProjectDetailsDone={this.onProjectDetailsDone}
                        onCloseClick={this.onCloseClickHandle}
                        onBackClick={this.pop}
                    />
                );
                break;
            default:
                step = (
                    <SelectedTemplate
                        categories={Templates.categories}
                        templates={Templates.templates}
                        onTemplateSelected={this.onTemplateSelectedHandle}
                        onBackPress={this.closeModal}
                        onCloseClick={this.onCloseClickHandle}
                    />
                );
                break;
        }

        return (
            <Analytics
                eventProperties={{
                    scope: ["NEW_PROJECT"],
                    "current step": this.state.currentStep
                }}
            >
                <div>{step}</div>;
            </Analytics>
        );
    }
}

NewDapp.proptypes = {
    modal: Proptypes.object.isRequired,
    functions: Proptypes.object.isRequired,
    cb: Proptypes.func.isRequired,
};
