// Copyright 2018 Superblocks AB
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
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ToastContainer from '../toasts/toastcontainer';
import Loadable from 'react-loadable';
import { EmptyLoading } from '../common';
import PrivateRoute from './PrivateRoute';

const LoginScreen = Loadable({
    loader: () => import(/* webpackChunkName: "LoginScreen" */'../login/loginScreen'),
    loading: EmptyLoading,
});

const Dashboard = Loadable({
    loader: () => import(/* webpackChunkName: "Dashboard" */'../dashboard'),
    loading: EmptyLoading,
});

const OrganizationSettings = Loadable({
    loader: () => import(/* webpackChunkName: "Dashboard" */'../organization/settings'),
    loading: EmptyLoading,
});

const ProjectDashboard = Loadable({
    loader: () => import(/* webpackChunkName: "ProjectDashboard" */'../project/ProjectDashboard'),
    loading: EmptyLoading,
});

const ProjectSettings = Loadable({
    loader: () => import(/* webpackChunkName: "ProjectSettings" */'../project/settings/ProjectSettings'),
    loading: EmptyLoading,
});

const ProjectBuilds = Loadable({
    loader: () => import(/* webpackChunkName: "ProjectBuild" */'../project/builds/ProjectBuilds'),
    loading: EmptyLoading,
});

interface IProps {
    notifyAppStart: () => void;
    isAuthenticated: boolean;
    isLoginInProgress: boolean;
}

export default class App extends Component<IProps> {

    componentDidMount() {
        const { notifyAppStart }  = this.props;

        // Make sure we fire this event in order to let other parst of the app configure depending
        // on the initial state (per example turning on/off analytics)
        notifyAppStart();
    }

    render() {
        const { isAuthenticated, isLoginInProgress } = this.props;

        return (
            <Router>
                <div id='app'>
                    <div id='app_content'>
                        <div className='maincontent'>
                            <Switch>
                                <Route path='/login' exact render={(props: any) => <LoginScreen {...props} />} />
                                <PrivateRoute path='/' exact isAuthenticated={isAuthenticated} isLoading={isLoginInProgress} render={(props: any) => <Dashboard {...props} />} />
                                <PrivateRoute path='/:organizationId' exact isAuthenticated={isAuthenticated} isLoading={isLoginInProgress} render={(props: any) => <Dashboard {...props} />} />
                                <PrivateRoute path='/:organizationId/settings' exact isAuthenticated={isAuthenticated} isLoading={isLoginInProgress} render={(props: any) => <OrganizationSettings {...props} />} />
                                <PrivateRoute exact path='/:organizationId/:projectId' isAuthenticated={isAuthenticated} isLoading={isLoginInProgress} render={(props: any) => (
                                    <ProjectDashboard content={<ProjectBuilds {...props}/>} {...props} />
                                )} />
                                <PrivateRoute exact path='/:organizationId/:projectId/builds' isAuthenticated={isAuthenticated} isLoading={isLoginInProgress} render={(props: any) => (
                                    <ProjectDashboard content={<ProjectBuilds {...props}/>} {...props} />
                                )} />
                                <PrivateRoute exact path='/:organizationId/:projectId/settings' isAuthenticated={isAuthenticated} isLoading={isLoginInProgress} render={(props: any) => (
                                    <ProjectDashboard content={<ProjectSettings {...props}/>} {...props} />
                                )} />
                            </Switch>
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </Router>
        );
    }
}
