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
import classNames from 'classnames';
import style from './style.less';
import ModalHeader from '../../../modal/modalHeader';
import TextInput from '../../../textInput';
import { validateMainnetWarning } from '../../../../validations';

export default class MainnetWarning extends Component {

    state = {
        isValid: false,
    }

    onCloseClickHandle = () => {
        this.props.onCloseClick();
    };

    handleTitleChange = (e) => {
        const error = validateMainnetWarning(this.props.selectedProject.name, e.target.value);
        this.setState({
            isValid: error != null ? false : true
        });
    }

    onCreateProjectHandle = () => {
        if (this.state.isValid) {
            this.props.onDeployConfirmed();
        }
    }

    render() {
        const { isValid } = this.state;
        const { selectedProject } = this.props;
        return(
            <div className={classNames([style.mainnetWarning, "modal"])}>
                <div className={style.container}>
                    <ModalHeader
                        title="Warning - Deploying to Mainnet"
                        onCloseClick={this.onCloseClickHandle}
                    />
                    <div className={style.area}>
                        <div>
                            This action <b>cannot</b> be undone. This will deploy your contract from the <b>{selectedProject.name}</b> project all the way to Mainnet.
                        </div>
                        <div className={style.form}>
                            <div className={style.info}>
                                <TextInput
                                    id="projectName"
                                    type="text"
                                    label="Type the name of the project to confirm:"
                                    onChangeText={this.handleTitleChange}
                                />
                            </div>
                        </div>
                        <button disabled={!isValid} className={style.buttonConfirm} onClick={this.onCreateProjectHandle}>I understand, start deploying to Mainnet</button>
                    </div>
                </div>
            </div>
        );
    }
}

MainnetWarning.proptypes = {
    categories: Proptypes.array.isRequired,
    templates: Proptypes.array.isRequired,
    onTemplateSelected: Proptypes.func.isRequired,
    onCloseClick: Proptypes.func.isRequired
}
