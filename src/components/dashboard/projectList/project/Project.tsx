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
import EditModal from '../../../editModal';
import moment from 'moment';

interface IProps {
    project: IProject;
    deleteProject: (projectId: string) => void;
    forkProjectById: (projectId: string) => void;
    functions: any;
    orderBy: string;
}

export default class Project extends Component<IProps> {

    onModalClose = () => {
        this.props.functions.modal.close();
    }

    showShareModal = () => {
        const modal = (
            <ShareModal
                defaultUrl={`${String(window.location.origin)}/${this.props.project.id}`}
                onCloseClick={this.onModalClose}
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

    showEditModal = () => {
        const modal = (
            <EditModal
                project={this.props.project}
                onCloseClick={this.onModalClose}
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

    openProject = () => {
        const { project } = this.props;
        window.location.href = `${window.location.origin}/${project.id}`;
    }

    openProjectNewTab = () => {
        const { project } = this.props;
        window.open(`${window.location.origin}/${project.id}`, '_blank');
    }

    editProject = () => {
        console.log('TODO Edit project');
    }

    render() {
        const { project, orderBy }  = this.props;

        return (
            <div className={style.container}>
                <a href={project.id} className={style.innerWrapper}>
                    <div className={style.name}>
                        {project.name}
                    </div>
                    <div className={style.description}>
                        {project.description}
                    </div>
                    <div className={style.timestamp}>
                        { orderBy === 'createdAt'
                            ? `Created ${moment.utc(project.createdAt).fromNow()}`
                            : `Edited ${moment.utc(project.lastModifiedAt).fromNow()}`
                        }
                    </div>
                </a>
                <DropdownContainer
                    showMenu={false}
                    className={style.projectButtonWrapper}
                    dropdownContent={
                        <ProjectMenuDropdownDialog
                            customClass={style.menuDialog}
                            projectId={project.id}
                            editProject={this.showEditModal}
                            openProject={this.openProject}
                            openProjectNewTab={this.openProjectNewTab}
                            deleteProject={this.props.deleteProject}
                            forkProject={this.props.forkProjectById}
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
