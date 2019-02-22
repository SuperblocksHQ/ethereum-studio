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
import copy from 'copy-to-clipboard';
import classNames from 'classnames';
import style from './style.less';
import {
    IconCopy
} from '../icons';
import TextInput from '../textInput';
import TextAreaInput from '../textAreaInput';
import { Tooltip } from '../common';
import Switch from 'react-switch';
import ModalHeader from '../modal/modalHeader';
import { IProject } from '../../models';

interface IProps {
    project: IProject;
    onCloseClick: () => void;
}

interface IState {
    errorName: string | null;
    errorDescription: string | null;
}

export default class EditModal extends React.Component<IProps, IState> {

    state: IState = {
        errorName: null,
        errorDescription: null
    };

    onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // TODO Add to validations and validate name
        const valid = /^[a-zA-ZA-Z0-9 -]+$/.test(value);
        if (!valid) {
            this.setState({
                errorName: 'Wrong name'
            });
        }

    }

    onDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Todo validate same as name
        // Todo save and update through epic
        console.log('desc');
    }

    render() {
        const { project } = this.props;
        const { errorName, errorDescription } = this.state;
        const canSave = true;
        return (
            <div className={classNames([style.shareModal, 'modal'])}>
                <ModalHeader
                    title='Project info'
                    onCloseClick={this.props.onCloseClick}
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
                        <button onClick={this.props.onCloseClick} className='btn2 noBg mr-2'>Cancel</button>
                        <button onClick={this.props.onCloseClick} className='btn2' disabled={!canSave}>Save</button>
                    </div>
                </div>
            </div>
        );
    }
}
