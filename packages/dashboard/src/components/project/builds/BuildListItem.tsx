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
import classNames from 'classnames';
import style from './style.less';
import moment from 'moment';
import { IconBranch, IconCommit, IconClock, IconCalendar } from '../../common/icons';
import { BuildStatus } from './BuildStatus';
import { Link } from 'react-router-dom';
import { IPipeline } from '../../../models';

interface IProps {
    pipeline: IPipeline;
    projectId: string;
    organizationId: string;
}

export default class BuildListItem extends Component<IProps> {
    render() {
        const { pipeline } = this.props;

        return (
            <React.Fragment>
                <td>
                    <BuildStatus status={pipeline.status} />
                </td>
                <td>
                    <Link to={{pathname: `/${this.props.organizationId}/projects/${this.props.projectId}/builds/${pipeline.commit.hash}`, state: {pipeline}}}>
                        {/* #{pipeline.buildNumber} */}
                    </Link>
                </td>
                <td>
                    <span className={style.flexVerticalCenter}>
                        <IconBranch className={style['mr-2']} />
                        <a href={pipeline.commit.branchUrl} target='_blank' rel='noopener noreferrer'>
                            {pipeline.commit.branch}
                        </a>
                    </span>
                </td>
                <td>
                    <div className={style.flexVerticalCenter}>
                        <img src={pipeline.commit.ownerAvatar} className={classNames('mr-2', style.avatarImg)} alt={pipeline.commit.ownerName} />
                        <div>
                            <span className={style['mb-1']}>
                                {pipeline.commit.description}
                            </span>
                            <span>
                                <IconCommit className={style['mr-1']} />
                                <a href={pipeline.commit.commitUrl} target='_blank' rel='noopener noreferrer' className={style.linkPrimary}>
                                    {pipeline.commit.hash.slice(0, 8)}
                                </a>
                            </span>
                        </div>
                    </div>
                </td>
                <td className={style[`status-${pipeline.status}`]}>
                    <span className={style['mb-2']}>
                        <IconClock className={style['mr-2']} />

                        {/* TODO - This needs to be calculated */}
                        {moment.utc(pipeline.createdAt).fromNow()}
                    </span>
                    <span>
                        <IconCalendar className={style['mr-2']} />
                        {moment.utc(pipeline.createdAt).fromNow()}
                    </span>
                </td>
            </React.Fragment>
        );
    }
}
