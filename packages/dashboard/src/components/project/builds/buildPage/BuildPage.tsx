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
import { Link } from 'react-router-dom';
import { BreadCrumbs } from '../../../common';
import { IconBranch, IconCommit } from '../../../common/icons';
import { BuildStatus } from '../BuildStatus';
import moment from 'moment';
import BuildConsole from './BuildConsole';
import classNames from 'classnames';
import { IProject } from '../../../../models';

interface IProps {
    build: any;
    location: any;
    match: any;
    project: IProject;
}

export default class BuildPage extends Component<IProps> {
    render() {
        const { project } = this.props;

        const build = {
            status: 1,
            buildNumber: 3,
            branch: 'fork-branch',
            buildTime: '00:02:56',
            duration: '1 min and 43 seconds',
            commit: {
                ownerAvatar: 'https://avatars3.githubusercontent.com/u/7814134?v=4&s=24',
                ownerName: 'Javier Taragaza Gomez',
                description: 'Initial commit',
                hash: 'gf245df',
                timestamp: '2019-04-15T12:47:45.090Z',
                branchLink: 'https://github.com/SuperblocksHQ/superblocks-lab/commits/master',
                commitLink: 'https://github.com/SuperblocksHQ/superblocks-lab/commit/1553091f58d7a5328201b8ad4a94766e1babe80d'
            }
        };

        return (
            <div className={style.buildPage}>
                <BreadCrumbs>
                    <Link to={'/'}>Organization Name</Link>
                    <Link to={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/builds`}>{project.name}</Link>
                    <Link to={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/builds`}>Builds</Link>
                    <Link to={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/builds/${this.props.match.params.buildId}`}>
                        #{build.buildNumber}
                    </Link>
                </BreadCrumbs>

                <div className={style.title}>
                    <BuildStatus status={build.status} />
                    <h1><span>{`Build #${build.buildNumber} - `}</span>{build.commit.description}</h1>
                </div>

                <p className={classNames([style.subtitle, style.flexVerticalCenter])}>
                    {
                        `Triggered ${moment.utc(build.commit.timestamp).fromNow()} by `
                    }
                    <img src={build.commit.ownerAvatar} />
                    <span className={style.ownerName}>{build.commit.ownerName}</span>
                    <span>
                        <IconBranch />
                        <a href={build.commit.branchLink} className={classNames([style.linkPrimary, style['ml-1']])} target='_blank' rel='noopener noreferrer'>
                            {build.branch}
                        </a>
                    </span>
                    <span>
                        <IconCommit />
                        <a href={build.commit.commitLink} className={classNames([style.linkPrimary, style['ml-1']])} target='_blank' rel='noopener noreferrer'>
                            {build.commit.hash}
                        </a>
                    </span>
                </p>

                <div className={style.tabNavigation}>
                    <a href='#' className={style.tabItem}>Logs</a>
                </div>
                <div className={style.hr}></div>

                <h2>Compile and Test</h2>
                <p className={style['mb-4']}>
                    <span><b>Total duration:</b> {build.duration}</span>
                    <span className={style['ml-3']}><b>Queued:</b> 00:01 waiting</span>
                </p>

                <BuildConsole />
            </div>
        );
    }
}
