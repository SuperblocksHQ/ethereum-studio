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

import React from 'react';
import style from './style.less';
import { TextInput, TextAreaInput, ModalHeader } from '../../common';
import { validateProjectName } from '../../../validations';
import { IProject } from '../../../models';
import classNames from 'classnames';

interface IProps {
    project: IProject;
    updateProject: (project: IProject) => void;
    hideModal: () => void;
}

interface IState {
    errorName: string | null;
    errorDescription: string | null;
    newName: string;
    newDescription: string;
    canSave: boolean;
}

export default class EditModal extends React.Component<IProps, IState> {

    state: IState = {
        errorName: null,
        errorDescription: null,
        newName: this.props.project.name,
        newDescription: this.props.project.description,
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

        // TODO: Validate Description

        this.setState({
            newDescription
        });
    }

    onSave = () => {
        const { project, hideModal, updateProject } = this.props;
        const { newName, newDescription} = this.state;

        project.name = newName;
        project.description = newDescription;

        updateProject(project);
        hideModal();
    }

    render() {
        const { project, hideModal } = this.props;
        const { errorName, errorDescription, canSave } = this.state;

        return (
            <div className={classNames([style.editModal, 'modal'])}>
                <ModalHeader
                    title='Project info'
                    onCloseClick={hideModal}
                />
                <div className={style.content}>
                    <div className={style.title}>
                        Name
                    </div>
                    <div className={style.inputContainer}>
                        <TextInput
                            id='name'
                            error={errorName}
                            onChangeText={this.onNameChange}
                            defaultValue={project.name}
                        />
                    </div>
                    <div className={style.title}>
                        Description
                    </div>
                    <div className={style.inputContainer}>
                        <TextAreaInput
                            id='description'
                            error={errorDescription}
                            onChangeText={this.onDescChange}
                            defaultValue={project.description}
                            rows={3}
                        />
                    </div>
                </div>
                <div className={style.footer}>
                    <div className={style.buttonsContainer}>
                        <button onClick={hideModal} className='btn2 noBg mr-2'>Cancel</button>
                        <button onClick={this.onSave} className='btn2' disabled={!canSave}>Save</button>
                    </div>
                </div>
            </div>
        );
    }
}
