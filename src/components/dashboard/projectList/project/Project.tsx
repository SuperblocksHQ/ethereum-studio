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
import { IProject } from '../../../../models';
import { IconDots } from '../../../icons';
import { DropdownContainer } from '../../../common/dropdown';
import ProjectMenuDropdownDialog from '../../../topbar/projectMenu/ProjectMenuDropdownDialog';
import ShareModal from '../../../shareModal';

interface IProps {
    project: IProject;
    deleteProject: (projectId: string) => void;
    functions: any;
}

export default class Project extends Component<IProps> {

    onShareModalClose = () => {
        this.props.functions.modal.close();
    }

    showShareModal = () => {
        const modal = (
            <ShareModal
                defaultUrl={`${String(window.location.origin)}/${this.props.project.id}`}
                onCloseClick={this.onShareModalClose}
            />
        );
        this.props.functions.modal.show({
            cancel: () => {
                return false;
            },
            render: () => {
                return modal;
            }
        });
    }

    render() {
        const { project }  = this.props;

        return (
            <div className={style.container}>
                <a href={project.id} className={style.innerWrapper}>
                    <div className={style.name}>
                        {project.name}
                    </div>
                    <div className={style.description}>
                        {project.description}
                    </div>
                </a>
                <DropdownContainer
                    showMenu={false}
                    className={style.projectButtonWrapper}
                    dropdownContent={
                        <ProjectMenuDropdownDialog
                            customClass={style.menuDialog}
                            projectId={project.id}
                            deleteProject={this.props.deleteProject}
                            shareProject={this.showShareModal}
                        />}
                >
                    <div className={style.menuWrapper}>
                        <IconDots className={style.projectButtonIcon} width='30' />
                    </div>
                </DropdownContainer>
            </div>
        );
    }
}
