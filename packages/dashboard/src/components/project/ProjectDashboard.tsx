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
import Topbar from '../topbar';
import style from './style.less';
import { SideMenu, SideMenuItem, SideMenuFooter } from '../sideMenu';
import { IconConfigure, IconPlay } from '../common/icons';

interface IProps {
    location: any;
    match: any;
    content: JSX.Element;
}

export default class ProjectDashboard extends Component<IProps> {

    render() {
        const { content } = this.props;
        const { pathname } = this.props.location;

        return (
            <div className={style.projectDashboard}>
                <React.Fragment>
                    <Topbar />
                    <div className={style.content}>
                        <SideMenu>
                            <SideMenuItem
                                    icon={<IconPlay />}
                                    title='Builds'
                                    active={pathname.includes('builds')}
                                    linkTo={`/${this.props.match.params.organizationId}/${this.props.match.params.projectId}/builds`}
                            />
                            <SideMenuFooter>
                                <SideMenuItem
                                    icon={<IconConfigure />}
                                    title='Project Settings'
                                    active={pathname.includes('settings')}
                                    linkTo={`/${this.props.match.params.organizationId}/${this.props.match.params.projectId}/settings`}
                                />
                            </SideMenuFooter>

                        </SideMenu>
                        <div className={style.pageContent}>
                            {content}
                        </div>
                    </div>
                </React.Fragment>
            </div>
        );
    }
}
