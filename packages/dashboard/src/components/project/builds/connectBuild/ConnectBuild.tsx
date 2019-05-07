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
import { BreadCrumbs, StyledButton } from '../../../common';
import { StyledButtonType, IProject } from '../../../../models';
import { IconGithub } from '../../../common/icons';
import GithubRepositoryList, { Section } from '../../../githubRepositoryList';

interface IProps {
    project: IProject;
    build: any;
    location: any;
    match: any;
}

export default class ConnectBuild extends Component<IProps> {
    render() {
        const { project } = this.props;
        return (
            <div className={style.connectBuild}>
                <BreadCrumbs>
                    <Link to={'/'}>Organization Name</Link>
                    <Link to={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/builds`}>{project.name}</Link>
                    <Link to={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/builds`}>Builds</Link>
                    <Link to={window.location.pathname}>Connect to repository</Link>
                </BreadCrumbs>

                <div className={style.title}>
                    <h1>Connect to repository</h1>
                    <a href='https://github.com/apps/superblocks-devops' target='_blank' rel='noreferrer noopener'>
                        <StyledButton icon={<IconGithub />} type={StyledButtonType.Primary} text={'Configure Github App'} customClassName={style.btnConfigure} />
                    </a>
                </div>

                <GithubRepositoryList section={Section.ConnectToRepo}/>
            </div>
        );
    }
}
