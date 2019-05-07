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

import React, { Component, Fragment } from 'react';
import style from './style.less';
import { IconConfigure, IconPlusTransparent } from '../common/icons';
import { LetterAvatar } from '../common';
import Topbar from '../topbar';
import { SideMenu, SideMenuItem, SideMenuSubHeader, SideMenuFooter } from '../sideMenu';
import ProjectList from '../organization/projectList';
import { Redirect } from 'react-router';
import OnlyIf from '../common/onlyIf';
import { IOrganization, IProject } from '../../models';
import CreateOrganizationModal from '../modals/createOrganizationModal';
import CreateProject from '../organization/createProject';

interface IProps {
    organizationList: [IOrganization];
    isOrganizationListLoading: boolean;
    loadUserOrganizationList: () => void;
    projectList: IProject[];
    isProjectListLoading: boolean;
    showCreateOrganizationModal: boolean;
    toggleCreateOrganizationModal: () => void;
    getProjectList: () => void;
    githubLoginAction: () => void;
}

export default class Dashboard extends Component<IProps> {

    componentDidMount() {
        this.props.loadUserOrganizationList();
        this.props.getProjectList();
    }

    render() {
        const { projectList, isProjectListLoading, showCreateOrganizationModal, toggleCreateOrganizationModal, isOrganizationListLoading } = this.props;

        const organizationList = [
            {
                id: 'patata'
            }
        ];

        return (
            <Fragment>
                <div className={style.dashboard}>
                    <Topbar />
                    <div className={style.content}>
                        <SideMenu>
                            <SideMenuSubHeader title='My organizations' />
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
                                    onClick={toggleCreateOrganizationModal}
                                />
                                {/* TODO: Add :organizationId to linkTo */}
                                <SideMenuItem
                                    icon={<IconConfigure />}
                                    title='Organization settings'
                                    linkTo='12334/settings/details'
                                />
                            </SideMenuFooter>
                        </SideMenu>
                        { projectList.length === 0 && !isProjectListLoading ?
                            <CreateProject />
                            :
                            <ProjectList
                                list={projectList}
                                organizationName={'Placeholder organization'}
                                organizationId={'12334'}
                            />
                        }
                        <OnlyIf test={!isOrganizationListLoading && !organizationList.length}>
                            <Redirect to={'/welcome'} />
                        </OnlyIf>
                    </div>
                </div>
                <OnlyIf test={showCreateOrganizationModal}>
                    <CreateOrganizationModal hideModal={toggleCreateOrganizationModal} />
                </OnlyIf>
            </Fragment>
        );
    }
}
