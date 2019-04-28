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
import classNames from 'classnames';
import { IProject } from '../../../models';
import { ModalHeader, TextInput, StyledButton } from '../../common';
import { StyledButtonType } from '../../../models/button.model';

interface IProps {
    project: IProject;
    deleteProject: (projectId: string) => void;
    hideModal: () => void;
}

interface IState {
    isValid: boolean;
}

export default class DeleteProjectModal extends React.Component<IProps, IState> {

    state: IState = {
        isValid: false
    };

    handleTitleChange = (e: any) => {
        this.setState({
            isValid: this.props.project.name === e.target.value
        });
    }

    onConfirmClick = () => {
        const { id } = this.props.project;
        if (this.state.isValid) {
            this.props.deleteProject(id);
        }
    }

    render() {
        const { hideModal, project } = this.props;
        const { isValid } = this.state;

        return (
            <div className={classNames([style.deleteProjectModal, 'modal'])}>
                <ModalHeader
                    title='Delete this project'
                    onCloseClick={hideModal}
                />
                <div className={style.content}>
                    <p>
                        This action <b>cannot</b> be undone. This will permanently delete your project and its data, making it inaccessible for any of the members of the organization.
                    </p>
                    <p>
                        To confirm this action, please type "<b>{project.name}</b>":
                    </p>
                    <TextInput
                        id='projectName'
                        type='text'
                        placeholder='Type the name of the project to confirm...'
                        onChangeText={this.handleTitleChange}
                    />
                    <div className={style.footer}>
                        <div className={style.cancelBtn} onClick={hideModal}>Cancel</div>
                        <StyledButton type={StyledButtonType.Danger} text={'Delete Project'} onClick={this.onConfirmClick} isDisabled={!isValid} />
                    </div>
                </div>

            </div>
        );
    }
}
