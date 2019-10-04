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
import { DropdownContainer } from '../common/dropdown';
import { HelpAction, NewProjectAction, OnlyIf, StyledButton } from '../common';
import NetworkAccountSelector from '../networkAccountSelector';
import MenuDropdownDialog from './menu';
import ProjectTitle from './projectTitle';
import { IProject } from '../../models';
import { ForkDropdownAction, MenuAction, PreferencesAction, ShareDropdownAction } from './actions';
import AccountConfigModal from '../projectEditor/editors/accountConfigModal';
import { StyledButtonType } from '../common/buttons/StyledButtonType';

interface IView {
    showOpenStudio: boolean;
    project: IProject;
    showForkButton: boolean;
    showShareButton: boolean;
}

interface IProps {
    selectedProjectName: string;
    selectedProjectId: string;
    isProjectForking: boolean;
    view: IView;
    showAccountConfig: boolean;
    forkProject: (projectId: string, redirect: boolean) => void;
    showModal: (modalType: string, modalProps: any) => void;
    closeAccountConfigModal(): void;
}
export default class TopBar extends Component<IProps> {

    state = {
        selectedProjectName: this.props.selectedProjectName,
    };

    componentDidUpdate(prevProps: IProps) {

        if (prevProps.selectedProjectName !== this.props.selectedProjectName) {
            this.setState({
                selectedProjectName: this.props.selectedProjectName
            });
        }
    }

    showModal = (modalType: string) => {
        const { showModal } = this.props;

        switch (modalType) {
            case 'preferences':
                showModal('PREFERENCES_MODAL', null);
                break;
            case 'share':
                const defaultUrl = String(window.location);
                showModal('SHARE_MODAL', { defaultUrl });
                break;
            default:
                break;
        }
    }

    onForkClicked = () => {
        const { forkProject, selectedProjectId } = this.props;
        forkProject(selectedProjectId, true);
    }

    render() {
        const { project, showOpenStudio, showForkButton, showShareButton } = this.props.view;
        const { isProjectForking, showAccountConfig, closeAccountConfigModal } = this.props;

        return (
            <div className={style.topbar}>
                <div className={style.actionsLeft}>
                    <DropdownContainer
                        className={style.actionDialogMenu}
                        dropdownContent={<MenuDropdownDialog />} >
                        <MenuAction />
                    </DropdownContainer>
                    <OnlyIf test={showOpenStudio}>
                        <a
                            className={style.openStudio}
                            href={String(window.location)}
                            target='_blank'
                            rel='noopener noreferrer'
                            title='Open Studio'
                        >
                            <StyledButton
                                type={StyledButtonType.Primary}
                                text='Open Studio'
                            />
                        </a>
                    </OnlyIf>
                    <NetworkAccountSelector />
                    <div className={style.projectActions}>
                        <OnlyIf test={showForkButton}>
                            <ForkDropdownAction
                                onForkClicked={this.onForkClicked}
                                isProjectForking={isProjectForking}
                            />
                        </OnlyIf>
                        <OnlyIf test={showShareButton}>
                            <ShareDropdownAction
                                toggleShareModal={() => this.showModal('share')}
                            />
                        </OnlyIf>
                    </div>
                </div>
                <ProjectTitle
                    projectName={project.name}
                />
                <div className={style.actionsRight}>
                    <NewProjectAction redirect={true} />
                    <div onClick={() => this.showModal('preferences')}>
                        <PreferencesAction />
                    </div>
                    <HelpAction />
                </div>
                <OnlyIf test={showAccountConfig}>
                    <AccountConfigModal
                        hideModal={closeAccountConfigModal}
                    />
                </OnlyIf>
            </div>
        );
    }
}
