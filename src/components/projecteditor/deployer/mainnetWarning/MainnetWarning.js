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

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#app')

export default class MainnetWarning extends Component {

    state = {
        projectTitle: ""
    }

    onCloseClickHandle = () => {
        this.props.onCloseClick();
    };

    handleTitleChange = (e) => {
        const title = e.target.value;
        this.setState({
            projectTitle: e.target.value,
        });
    }

    onCreateProjectHandle = () => {
        if (this.state.positiveMatch) {
            this.props.onDeployConfirmed();
        }
    }

    validate(projectTitle) {
        return projectTitle === "hola";
    }

    render() {
        const { projectTitle } = this.state;
        const isEnabled = this.validate(projectTitle);
        return(
            <div className={classNames([style.mainnetWarning, "modal"])}>
                <div className={style.container}>
                    <ModalHeader
                        title="Warning - Deploying to Mainnet"
                        onCloseClick={this.onCloseClickHandle}
                    />
                    <div className={style.area}>
                        <div>
                            This action <b>cannot</b> be undone. This will deploy your contract from the <b>HelloWorld</b> project all the way to Mainnet.
                        </div>
                        <div className={style.form}>
                            <div className={style.info}>
                                <TextInput
                                    id="projectName"
                                    type="text"
                                    label="Type the name of the project to confirm:"
                                    onChangeText={this.handleTitleChange}
                                    defaultValue={projectTitle}
                                />
                            </div>
                        </div>
                        <button disabled={!isEnabled} className={style.buttonConfirm} onClick={this.onCreateProjectHandle}>I understand, start deploying to Mainnet</button>
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
