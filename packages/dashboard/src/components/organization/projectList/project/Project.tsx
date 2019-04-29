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
import moment from 'moment';
import { Link } from 'react-router-dom';

interface IProps {
    project: IProject;
    organizationId: string;
    deleteProject: (projectId: string) => void;
    showModal: (modalType: string, modalProps: any) => void;
    orderBy: string;
}

export default class Project extends Component<IProps> {

    render() {
        const { organizationId, project, orderBy }  = this.props;

        return (
            <div className={style.container}>
                <Link to={`${organizationId}/${project.id}`} className={style.innerWrapper}>
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
                </Link>
            </div>
        );
    }
}
