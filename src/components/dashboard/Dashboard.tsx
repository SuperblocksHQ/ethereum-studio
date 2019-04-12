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

import React, { Component, lazy, Suspense } from 'react';
import { IProject } from '../../models';
import style from './style.less';
import {userService} from '../../services/user.service';
import { Loading } from '../common';

const ProjectList = lazy(() => import(/* webpackChunkName: "ProjectList" */'./projectList'));

const Topbar = lazy(() => import(/* webpackChunkName: "Topbar" */'./topbar'));

const LoginModal = lazy(() =>
    import(/* webpackChunkName: "LoginModal" */'../modals').then(module => ({ default: module.LoginModal }))
);

interface IProps {
    getProjectList: () => void;
    projectList: IProject[];
    isAuthenticated: boolean;
    githubLoginAction: () => void;
    isProjectListLoading: boolean;
    isLoginInProgress: boolean;
}

export default class Dashboard extends Component<IProps> {
    componentDidMount() {
        if (userService.credentialsExist()) {
            this.props.getProjectList();
        }
    }

    render() {
        const { projectList, isAuthenticated, isLoginInProgress, githubLoginAction } = this.props;

        return (
            <div className={style.dashboard}>
                { isAuthenticated ?
                    <Suspense fallback={< Loading/>}>
                        <Topbar />
                        <div className={style.content}>
                            <ProjectList
                                listName={'All Your Projects'}
                                list={projectList}
                            />
                        </div>
                    </Suspense>
                :
                    <div className={style.loginSection}>
                        { isLoginInProgress ?
                            <React.Fragment />
                            :
                            <Suspense fallback={< Loading/>}>
                                <LoginModal
                                    customClassName= {style.loginModal}
                                    githubLogin={githubLoginAction}
                                    hideCloseButton={true}
                                />
                            </Suspense>
                        }
                    </div>
                }
            </div>
        );
    }
}
