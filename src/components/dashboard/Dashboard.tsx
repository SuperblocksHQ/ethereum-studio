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
import { IProject } from '../../models';
import style from './style.less';
import { SideMenu, SideMenuItem, SideMenuHeader, SideMenuFooter } from './sideMenu';
import { IconConfigure, IconPlusTransparent } from '../icons';
import { LetterAvatar } from '../common';
import { Loading } from '../common';
import Loadable from 'react-loadable';
import Topbar from './topbar';

const ProjectList = Loadable({
    loader: () => import(/* webpackChunkName: "ProjectList" */'./projectList'),
    loading: Loading,
});

const LoginModal = Loadable({
    loader: () => import(/* webpackChunkName: "LoginModal" */'../modals'),
    loading: Loading,
    render(loaded, props: any) {
        const Modal = loaded.LoginModal;
        return <Modal {...props}/>;
    }
});

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
        this.props.getProjectList();
    }

    render() {
        const { projectList, isAuthenticated, isLoginInProgress, githubLoginAction } = this.props;

        return (
            <div className={style.dashboard}>
                { isAuthenticated ?
                    <React.Fragment>
                        <Topbar />
                        <div className={style.content}>
                            <SideMenu>
                                <SideMenuHeader title='My organizations' />
                                {/* TODO: Remove placeholder items and fetch organizations instead, add corresponding link */}
                                <SideMenuItem
                                    icon={<LetterAvatar title='Placeholder'/>}
                                    title='Placeholder organization'
                                    linkTo='TODO'
                                />
                                <SideMenuFooter>
                                    <SideMenuItem
                                        icon={<IconPlusTransparent />}
                                        title='New organization'
                                        linkTo='dashboard/new-organization'
                                    />
                                    {/* TODO: Add :organizationId to linkTo */}
                                    <SideMenuItem
                                        icon={<IconConfigure width='10px' height='10px' />}
                                        title='Organization settings'
                                        linkTo='dashboard/settings'
                                    />
                                </SideMenuFooter>
                            </SideMenu>
                            <ProjectList
                                listName={'All Your Projects'}
                                list={projectList}
                            />
                        </div>
                    </React.Fragment>
                :
                    <div className={style.loginSection}>
                        { isLoginInProgress ?
                            <React.Fragment />
                            :
                            <LoginModal
                                customClassName={style.loginModal}
                                githubLogin={githubLoginAction}
                                hideCloseButton={true}
                            />
                        }
                    </div>
                }
            </div>
        );
    }
}
