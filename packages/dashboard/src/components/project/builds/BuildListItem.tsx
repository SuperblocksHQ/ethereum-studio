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
import moment from 'moment';
import { IconBranch, IconCommit, IconClock, IconCalendar } from '../../common/icons';
import { BuildStatus } from './BuildStatus';
import { Link } from 'react-router-dom';

interface IProps {
    build: any;
    projectId: string;
    organizationId: string;
}

export default class BuildListItem extends Component<IProps> {
    render() {
        const { build } = this.props;

        return (
            <React.Fragment>
                <td>
                    <BuildStatus status={build.status} />
                </td>
                <td>
                    <Link to={{pathname: `/${this.props.organizationId}/projects/${this.props.projectId}/builds/${build.commit.hash}`, state: {build}}}>
                        #{build.buildNumber}
                    </Link>
                </td>
                <td>
                    <span className={style.flexVerticalCenter}>
                        <IconBranch className={style['mr-2']} />
                        <a href={build.commit.branchLink} target='_blank' rel='noopener noreferrer'>
                            {build.branch}
                        </a>
                    </span>
                </td>
                <td>
                    <div className={style.flexVerticalCenter}>
                        <img src={build.commit.ownerAvatar} className={style['mr-2']} alt={build.commit.ownerName} />
                        <div>
                            <span className={style['mb-1']}>
                                {build.commit.description}
                            </span>
                            <span>
                                <IconCommit className={style['mr-1']} />
                                <a href={build.commit.commitLink} target='_blank' rel='noopener noreferrer' className={style.linkPrimary}>
                                    {build.commit.hash}
                                </a>
                            </span>
                        </div>
                    </div>
                </td>
                <td className={style[`status-${build.status}`]}>
                    <span className={style['mb-2']}>
                        <IconClock className={style['mr-2']} />
                        {build.buildTime}
                    </span>
                    <span>
                        <IconCalendar className={style['mr-2']} />
                        {moment.utc(build.commit.timestamp).fromNow()}
                    </span>
                </td>
            </React.Fragment>
        );
    }
}
