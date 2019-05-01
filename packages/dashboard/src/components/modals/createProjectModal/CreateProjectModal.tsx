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
import { ModalHeader, TextInput, StyledButton, TextAreaInput } from '../../common';
import { StyledButtonType } from '../../../models/button.model';
import { Modal } from '../../common/modal';
import { validateProjectName } from '../../../validations';

interface IProps {
    hideModal: () => void;
    createProject: (redirect: boolean) => void;
}

interface IState {
    errorName: string | null;
    projectName: string;
    projectDescription: string;
    canCreate: boolean;
}

export default class CreateProjectModal extends React.Component<IProps, IState> {

    state: IState = {
        errorName: null,
        projectName: '',
        projectDescription: '',
        canCreate: false
    };

    onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value || ' ';
        const errorName = name ? validateProjectName(name) : null;

        this.setState({
            errorName,
            projectName: name,
            canCreate: !errorName
        });
    }

    onDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const description = e.target.value;

        this.setState({
            projectDescription: description
        });
    }

    onCreate = () => {
        const { createProject } = this.props;
        const { projectName, projectDescription} = this.state;

        // TODO: Create epic for creating project
        createProject(true);
    }

    render() {
        const { hideModal } = this.props;
        const { errorName, canCreate } = this.state;

        return (
            <Modal>
                <div className={classNames([style.createProjectModal, 'modal'])}>
                    <ModalHeader
                        title='Create a project'
                        onCloseClick={hideModal}
                    />
                    <div className={style.content}>
                        <div className={style['mb-4']}>
                            <TextInput
                                onChangeText={this.onNameChange}
                                error={errorName}
                                label={'Project name:'}
                                id={'projectName'}
                                required={true}
                                placeholder={'Super cool name'}
                            />
                        </div>
                        <div className={style['mb-4']}>
                            <TextAreaInput
                                onChangeText={this.onDescChange}
                                label={'Description:'}
                                id={'description'}
                                placeholder={'Enter a short description (optional)'}
                            />
                        </div>
                        <div className={style.footer}>
                            <div className={style.cancelBtn} onClick={hideModal}>Cancel</div>
                            <StyledButton
                                type={StyledButtonType.Primary}
                                text={'Create Project'}
                                onClick={this.onCreate}
                                isDisabled={!canCreate}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
