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
import { IProject } from '../../../models';
import { validateProjectName } from '../../../validations';

interface IProps {
    location: any;
    match: any;
    project: IProject;
    updateProject: (project: IProject) => void;
    showModal: (modalType: string, modalProps: any) => void;
}

interface IState {
    errorName: string | null;
    newName: string;
    newDescription: string;
    canSave: boolean;
}

export default class ProjectSettings extends Component<IProps, IState> {

    state: IState = {
        errorName: null,
        newName: 'Project name placeholder', // TODO: Fetch from props
        newDescription: 'Project description placeholder', // TODO: Fetch from props
        canSave: true
    };

    onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value || ' ';
        const errorName = newName ? validateProjectName(newName) : null;

        this.setState({
            errorName,
            newName,
            canSave: !errorName
        });
    }

    onDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDescription = e.target.value;

        this.setState({
            newDescription
        });
    }

    onSave = () => {
        const { project, updateProject } = this.props;
        const { newName, newDescription} = this.state;

        project.name = newName;
        project.description = newDescription;

        updateProject(project);
    }

    render() {
        const { showModal } = this.props;
        const { errorName, canSave } = this.state;

        {/* TODO: Fetch project from redux */}
        const project = {
            name: 'Project name placeholder',
            description: 'Project description placeholder'
        };

        return (
            <div className={style.projectSettings}>
                <BreadCrumbs>
                    <Link to={`/${this.props.match.params.organizationId}`}>Organization Name</Link>
                    <Link to={`/${this.props.match.params.organizationId}/${this.props.match.params.projectId}`}>Project Name</Link>
                    <Link to={window.location.pathname}>Settings</Link>
                </BreadCrumbs>

                <h2>Details</h2>
                <div className={style['mb-5']}>
                    <TextInput
                        onChangeText={this.onNameChange}
                        error={errorName}
                        label={'Project name'}
                        id={'projectName'}
                        placeholder={'project-name'}
                        defaultValue={project.name}
                        required={true}
                    />
                </div>
                <div className={style['mb-4']}>
                    <TextAreaInput
                        onChangeText={this.onDescChange}
                        label={'Description'}
                        id={'description'}
                        placeholder={'Enter a short description (optional)'}
                        defaultValue={project.description}
                    />
                </div>
                <PrimaryButton text={'Save Details'} onClick={this.onSave} isDisabled={!canSave}/>

                <div className={style.sectionDivider}></div>

                <h2>Delete this project</h2>
                <p className={style['mb-4']}>Once deleted, it will be gone forever. Please be certain.</p>
                <DangerButton text={'Delete Project'} onClick={() => showModal('DELETE_PROJECT_MODAL', { project })} />
            </div>
        );
    }
}
