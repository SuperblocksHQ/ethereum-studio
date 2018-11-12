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
import style from '../style.less';
import { IconClose } from '../../icons';

export default class ProjectDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projectName: this.props.projectName ? this.props.projectName : '',
            projectTitle: this.props.projectTitle
                ? this.props.projectTitle
                : '',
            isValid: false,
        };
    }

    validateInputs() {
        let { projectName, projectTitle } = this.state;
        var validInputs = false;
        if (projectName == '') {
            alert('Please give the project a name.');
        } else if (!projectName.match(/^([a-zA-Z0-9-]+)$/)) {
            alert('Illegal projectname. Only A-Za-z0-9 and dash (-) allowed.');
        } else if (projectTitle == '') {
            alert('Please give the project a snappy title.');
        } else if (projectTitle.match(/([\"\'\\]+)/)) {
            alert('Illegal title. No special characters allowed.');
        } else if (projectName.length > 20 || projectTitle.length > 20) {
            alert(
                'Sorry, the project name or title is way to long! (Max 20 chars).'
            );
        } else {
            validInputs = true;
        }

        return validInputs;
    }

    onNextClickHandle = (evt, dappfileJSONObj) => {
        if (evt) evt.preventDefault();

        if (dappfileJSONObj) {
            // We assume its validity is checked already.
            this.setState({
                projectTitle:
                    updatupdatedappfileJSONObj.dappfile.project.info.title,
            });
        }

        if (this.validateInputs()) {
            this.props.onProjectDetailsDone({
                name: this.state.projectName,
                title: this.state.projectTitle,
            });
        }
    };

    onCloseClickHandle = () => {
        this.props.onCloseClick();
    };

    onBackClickHandle = () => {
        this.props.onBackClick();
    };

    handleNameChange = changeEvent => {
        this.setState({
            projectName: changeEvent.target.value,
        });
    };

    handleTitleChange = changeEvent => {
        this.setState({
            projectTitle: changeEvent.target.value,
        });
    };

    render() {
        return (
            <div className={classNames([style.newDapp, 'modal'])}>
                <div className={style.step1}>
                    <div className={style.header}>
                        <div className={style.title}>Create a new project</div>
                        <button
                            className={classNames([style.closeIcon, 'btnNoBg'])}
                            onClick={this.onCloseClickHandle}
                        >
                            <IconClose />
                        </button>
                    </div>
                    <div className={style.area}>
                        <div className={style.form}>
                            <div className={style.info}>
                                <div className="superInputDark">
                                    <label htmlFor="project">Project name</label>
                                    <input
                                        id="project"
                                        type="text"
                                        maxLength="20"
                                        value={this.state.projectName}
                                        onChange={this.handleNameChange}
                                        placeholder="Enter project name"
                                    />
                                </div>
                                <div className="superInputDark my-4">
                                    <label htmlFor="html">
                                        DApp (HTML) Title:{' '}
                                    </label>
                                    <input
                                        id="html"
                                        type="text"
                                        maxLength="20"
                                        value={this.state.projectTitle}
                                        onChange={this.handleTitleChange}
                                        placeholder="Project HTML page title"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.footer}>
                        <button
                            onClick={this.onBackClickHandle}
                            className="btn2 noBg mr-2"
                        >
                            Back
                        </button>
                        <button onClick={this.onNextClickHandle} className="btn2">
                            Create Project
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

ProjectDetails.propTypes = {
    onProjectDetailsDone: Proptypes.func.isRequired,
    onCloseClick: Proptypes.func.isRequired,
    onBackClick: Proptypes.func.isRequired,
};
