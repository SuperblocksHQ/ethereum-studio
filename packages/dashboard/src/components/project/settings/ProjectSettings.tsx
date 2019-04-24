// Copyright 2019 Superblocks AB
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
import style from './style.less';
import { BreadCrumbs, TextInput, TextAreaInput } from '../../common';
import { Link } from 'react-router-dom';
import { PrimaryButton, DangerButton } from '../../common/buttons';

interface IProps {
    location: any;
    match: any;
    saveProject: () => void;
    deleteProject: () => void;
    showModal: (modalType: string, modalProps: any) => void;
}
export default class ProjectSettings extends Component<IProps> {

    render() {
        const { saveProject, deleteProject, showModal } = this.props;

        return (
            <React.Fragment>
                <BreadCrumbs>
                    <Link to={`/${this.props.match.params.organizationId}`}>Organization Name</Link>
                    <Link to={`/${this.props.match.params.organizationId}/${this.props.match.params.projectId}`}>Project Name</Link>
                    <Link to={window.location.pathname}>Settings</Link>
                </BreadCrumbs>

                <h1>Details</h1>
                <TextInput label={'Project name'} id={'project-name'} placeholder={'project-name'} />
                <TextAreaInput label={'Description'} id={'description'} placeholder={'Enter a short description (optional)'} />
                <PrimaryButton text={'Save Details'} onClick={() => deleteProject} />
                <DangerButton text={'Delete Project'} onClick={() => showModal('DELETE_PROJECT_MODAL', null)} />
            </React.Fragment>
        );
    }
}
