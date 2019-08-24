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
import OnlyIf from '../../onlyIf';
import { DropdownContainer, TextInput } from '../../common';
import {
    IconDropdown
} from '../../icons';
import ProjectMenuDropdownDialog from '../projectMenu';
import classNames from 'classnames';

interface IProps {
    projectId: string;
    projectName: string;
    isOwnProject: boolean;
    renameProject: (newName: string) => void;
}

export default class ProjectTitle extends Component<IProps> {

    state = {
        projectNameUpdating: false,
        newProjectName: this.props.projectName
    };

    handleProjectNameClick = () => {
        const { projectName } = this.props;

        this.setState({
          projectNameUpdating: true,
          newProjectName: projectName
        });
    }

    handleChangeName = () => {
        const { renameProject } = this.props;
        const { newProjectName } = this.state;

        this.setState({
          projectNameUpdating: false
        });

        renameProject(newProjectName);
    }

    handleInputChange = (e: any) => {
        this.setState({
            newProjectName: e.target.value
        });
    }

    render() {
        const { projectName, projectId, isOwnProject } = this.props;
        const { projectNameUpdating, newProjectName } = this.state;

        return(
            <div className={style.projectButton}>
                <OnlyIf test={!projectNameUpdating}>
                    <div onClick={isOwnProject ? this.handleProjectNameClick : undefined} className={style.titleOverflow}>
                        <span className={style.projectText}>{projectName}</span>
                    </div>
                    {
                        isOwnProject &&
                        <DropdownContainer
                            showMenu={false}
                            className={style.projectMenuDropdown}
                            dropdownContent={<ProjectMenuDropdownDialog projectId={projectId} redirect={true} renameProject={this.handleProjectNameClick} />}
                        >
                            <IconDropdown className={classNames([style.dropDown, 'dropDown'])} />
                        </DropdownContainer>
                    }
                </OnlyIf>
                <OnlyIf test={projectNameUpdating}>
                    <form onSubmit={this.handleChangeName}>
                        <input
                            type='text'
                            value={newProjectName}
                            onBlur={this.handleChangeName}
                            onChange={this.handleInputChange}
                            spellCheck={false}
                            autoFocus
                        />
                    </form>
                </OnlyIf>
            </div>
        );
    }
}
