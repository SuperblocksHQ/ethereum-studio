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
import { IProject } from '../../models';
import CreateProject from '../organization/createProject';
import OnlyIf from '../common/onlyIf';
import CreateOrganizationModal from '../modals/createOrganizationModal';

interface IProps {
    projectList: IProject[];
    isProjectListLoading: boolean;
    showCreateOrganizationModal: boolean;
    toggleCreateOrganizationModal: () => void;
    getProjectList: () => void;
    githubLoginAction: () => void;
}

export default class Dashboard extends Component<IProps> {

    componentWillMount() {
        this.props.getProjectList();
    }

    // TODO - Make sure to change the hardcoded organization Ids for the real deal
    render() {
        const { projectList, isProjectListLoading, showCreateOrganizationModal, toggleCreateOrganizationModal } = this.props;

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
                    </div>
                </div>
                <OnlyIf test={showCreateOrganizationModal}>
                    <CreateOrganizationModal hideModal={toggleCreateOrganizationModal} />
                </OnlyIf>
            </Fragment>
        );
    }
}
