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
import ProjectList from './projectList';
import Topbar from './topbar';
import { IProject } from '../../models';
import style from './style.less';
import { LoginModal } from '../modals';
import { SideMenu, SideMenuItem, SideMenuHeader, SideMenuFooter } from './sideMenu';
import { IconConfigure, IconPlusTransparent } from '../icons';
import { LetterAvatar } from '../common';
import { Link } from 'react-router-dom';

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
                                {/* TODO: Remove placeholder items and fetch organizations instead */}
                                    <SideMenuItem
                                        icon={<LetterAvatar title='Test'/>}
                                        title='Test'
                                        onClick={() => console.log('1')}
                                    />
                                    <SideMenuItem
                                        icon={<LetterAvatar title='Hola'/>}
                                        title='Hola'
                                        onClick={() => console.log('2')}
                                    />
                                    <SideMenuItem
                                        icon={<LetterAvatar title='Boligrafo'/>}
                                        title='Boligrafo'
                                        onClick={() => console.log('3')}
                                    />
                                <SideMenuFooter>
                                    <SideMenuItem
                                        icon={<IconPlusTransparent />}
                                        title='New organization'
                                        onClick={() => console.log('4')}
                                    />
                                    {/* TODO: Add :organizationId to Link */}
                                    <Link to='dashboard/settings'>
                                        <SideMenuItem
                                            icon={<IconConfigure width='10px' height='10px' />}
                                            title='Organization settings'
                                            onClick={() => console.log('5')}
                                        />
                                    </Link>
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
