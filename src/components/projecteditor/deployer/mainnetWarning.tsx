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
import classNames from 'classnames';
import style from './style-mainnetWarning.less';
import ModalHeader from '../../common/modal/modalHeader';
import { TextInput } from '../../common';
import { validateMainnetWarning } from '../../../validations';

interface IProps {
    projectName: string;
    onDeployConfirmed(): void;
    onCloseClick(): void;
}

interface IState {
    isValid: boolean;
}

export class MainnetWarning extends Component<IProps, IState> {

    state = {
        isValid: false,
    };

    handleTitleChange = (e: any) => {
        const error = validateMainnetWarning(this.props.projectName, e.target.value);
        this.setState({
            isValid: !error
        });
    }

    onConfirmClick = () => {
        if (this.state.isValid) {
            this.props.onDeployConfirmed();
        }
    }

    render() {
        const { isValid } = this.state;
        const { projectName, onCloseClick } = this.props;
        return(
            <div className={classNames([style.mainnetWarning, 'modal'])}>
                <div className={style.container}>
                    <ModalHeader
                        title='Warning - Deploying to Mainnet'
                        onCloseClick={onCloseClick}
                    />
                    <div className={style.area}>
                        <div>
                            This action <b>cannot</b> be undone. This will deploy your contract from the <b>{projectName}</b> project all the way to Mainnet.
                        </div>
                        <div className={style.form}>
                            <div className={style.info}>
                                <TextInput
                                    id='projectName'
                                    type='text'
                                    label='Type the name of the project to confirm:'
                                    onChangeText={this.handleTitleChange}
                                />
                            </div>
                        </div>
                        <button disabled={!isValid} className={style.buttonConfirm} onClick={this.onConfirmClick}>I understand, start deploying to Mainnet</button>
                    </div>
                </div>
            </div>
        );
    }
}

