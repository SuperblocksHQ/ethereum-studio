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
import Loadable from 'react-loadable';
import { Switch } from 'react-router-dom';
import LoadingBar from 'react-redux-loading-bar';
import Topbar from '../topbar';
import style from './style.less';
import { EmptyLoading } from '../common';
import { SideMenu, SideMenuItem, SideMenuFooter } from '../sideMenu';
import { IconConfigure, IconPlay } from '../common/icons';
import PrivateRoute from '../app/PrivateRoute';
import OnlyIf from '../common/onlyIf';

const ProjectSettingsDetails = Loadable({
    loader: () => import(/* webpackChunkName: "ProjectSettingsDetails" */'../project/settings/projectSettingsDetails'),
    loading: EmptyLoading,
});

const BuildList = Loadable({
    loader: () => import(/* webpackChunkName: "ProjectBuild" */'../project/builds'),
    loading: EmptyLoading,
});

const BuildPage = Loadable({
    loader: () => import(/* webpackChunkName: "ProjectBuild" */'../project/builds/buildPage'),
    loading: EmptyLoading,
});

interface IProps {
    location: any;
    match: any;
    loadProject: (projectId: string) => void;
    isProjectLoading: boolean;
    isAuthenticated: boolean;
    isAuthLoading: boolean;
}

export default class ProjectDashboard extends Component<IProps> {

    componentDidMount() {
        const { match, loadProject } = this.props;

        loadProject(match.params.projectId);
    }

    render() {
        const { isAuthenticated, isAuthLoading, isProjectLoading } = this.props;
        const { pathname } = this.props.location;

        return (
            <div className={style.projectDashboard}>
                <React.Fragment>
                    <Topbar />
                    <LoadingBar className='loading' />
                    <div className={style.content}>
                        <SideMenu>
                            <SideMenuItem
                                    icon={<IconPlay />}
                                    title='Builds'
                                    active={pathname.includes('builds')}
                                    linkTo={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/builds`}
                            />
                            <SideMenuFooter>
                                <SideMenuItem
                                    icon={<IconConfigure />}
                                    title='Project Settings'
                                    active={pathname.includes('settings')}
                                    linkTo={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/settings/details`}
                                />
                            </SideMenuFooter>

                        </SideMenu>
                            <OnlyIf test={!isProjectLoading}>
                                <div className={style.pageContent}>
                                    <Switch>
                                        <PrivateRoute exact path='/:organizationId/projects/:projectId' isAuthenticated={isAuthenticated} isLoading={isAuthLoading} render={(props: any) => (
                                            <BuildList {...props} />
                                        )}/>
                                        <PrivateRoute exact path='/:organizationId/projects/:projectId/builds' isAuthenticated={isAuthenticated} isLoading={isAuthLoading} render={(props: any) => (
                                            <BuildList {...props} />
                                        )}/>
                                        <PrivateRoute exact path='/:organizationId/projects/:projectId/builds/:buildId' isAuthenticated={isAuthenticated} isLoading={isAuthLoading} render={(props: any) => (
                                            <BuildPage {...props} />
                                        )}/>
                                        <PrivateRoute exact path='/:organizationId/projects/:projectId/settings/details' isAuthenticated={isAuthenticated} isLoading={isAuthLoading} render={(props: any) => (
                                            <ProjectSettingsDetails {...props} />
                                        )}/>
                                    </Switch>
                                </div>
                            </OnlyIf>
                    </div>
                </React.Fragment>
            </div>
        );
    }
}
