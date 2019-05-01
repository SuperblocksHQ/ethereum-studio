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
import { TextAreaInput, TextInput, StyledButton } from '../../common';
import { StyledButtonType } from '../../../models/button.model';
import { IconPlusTransparent } from '../../common/icons';
import { validateProjectName } from '../../../validations';

interface IProps {
    createProject: (redirect: boolean) => void;
}

interface IState {
    errorName: string | null;
    projectName: string;
    projectDescription: string;
    canCreate: boolean;
}

export default class CreateProject extends Component<IProps, IState> {

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
        const { errorName, canCreate } = this.state;

        return (
            <div className={style.container}>
                <div className={style.left}>
                    <img src='/static/img/illustration-new-project.svg' />
                </div>
                <div>
                    <h2 className={style['mb-4']}>Create a project to get started</h2>

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
                    <StyledButton
                        type={StyledButtonType.Primary}
                        icon={<IconPlusTransparent width={'12px'} height={'12px'} />}
                        text={'Create Project'}
                        onClick={this.onCreate}
                        isDisabled={!canCreate}
                    />
                </div>
            </div>
        );
    }
}
