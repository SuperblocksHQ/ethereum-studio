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
import { StyledButton } from '../../../common';
import { IconPlusTransparent } from '../../../common/icons';
import OnlyIf from '../../../common/onlyIf';
import { StyledButtonType } from '../../../../models/button.model';
import { IProject } from '../../../../models';
import ProjectBlock from '../projectBlock/ProjectBlock';
import CreateProjectModal from '../../../modals/createProjectModal';

interface IProps {
    title: string;
    showCreateProjectModal: boolean;
    toggleCreateProjectModal: () => void;
    suggestedProjects: IProject[];
    organizationId: string;
}

export default class Header extends Component<IProps> {

    render() {
        const { title, showCreateProjectModal, toggleCreateProjectModal, suggestedProjects, organizationId } = this.props;

        return (
            <div className={style.container}>
                <div className={style.title}>
                    <h1 className={style.organizationTitle}>{title}</h1>
                    <div className={style.createProject}>
                        <StyledButton icon={<IconPlusTransparent width={'12px'} height={'12px'} />} type={StyledButtonType.Primary} text={'Create Project'} onClick={() => toggleCreateProjectModal()} />
                        <OnlyIf test={showCreateProjectModal}>
                            <CreateProjectModal hideModal={toggleCreateProjectModal} />
                        </OnlyIf>
                    </div>
                </div>
                <p>Suggested projects</p>
                <div className={style.suggestedProjects}>
                    {
                        suggestedProjects.map((project: IProject) => {
                            return (
                                <ProjectBlock
                                    orderBy={''}
                                    key={project.id}
                                    project={project}
                                    organizationId={organizationId}
                                />
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}
