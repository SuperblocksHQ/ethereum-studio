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
import PropTypes from 'prop-types';
import classNames from 'classnames';
import style from './style.less';
import { DropdownContainer } from '../common/dropdown';
import { Tooltip, HelpAction, NewProjectAction } from '../common';
import UploadDialog from './upload';
import {
    IconPreferences,
    IconProjectSelector,
    IconUpload,
    IconFork,
    IconShare,
    IconMenu,
    IconAlphabetA,
    IconLoader,
} from '../icons';
import OnlyIf from '../onlyIf';
import NetworkAccountSelector from '../networkAccountSelector';
import MenuDropdownDialog from './menu';
import LoginButton from "../login";
import ProjectTitle from './projectTitle';

const MenuAction = () => (
    <div className={style.action}>
        <button className={classNames([style.container, "btnNoBg"])}>
            <IconMenu />
        </button>
    </div>
);

const DashboardAction = () => (
    <a href="/dashboard" className={classNames([style.action, style.actionRight])}>
        <Tooltip title="Dashboard">
            <div className={classNames([style.actionMenu, style.actionDashboard, style.container, "btnNoBg"])}>
                <IconProjectSelector />
            </div>
        </Tooltip>
    </a>
);

const PreferencesAction = () => (
    <div className={classNames([style.action, style.actionRight])}>
        <Tooltip title="Preferences">
            <button className={classNames([style.container, "btnNoBg"])}>
                <IconPreferences />
            </button>
        </Tooltip>
    </div>
);

const UploadDrowdownAction = () => (
    <div className={style.action}>
        <button className={classNames([style.container, 'btnNoBg'])}>
            <IconUpload />
            <span>Upload</span>
        </button>
    </div>
);

const ForkDropdownAction = (props) => {
    const { onForkClicked, isProjectForking } = props;
    return(
        <div className={style.action}>
            <button className={classNames([style.actionFork, style.container, 'btnNoBg'])} onClick={onForkClicked} disabled={isProjectForking}>
                { isProjectForking
                    ? <IconLoader />
                    : <IconFork />
                }
                <span>Fork</span>
            </button>
        </div>
    )
};

const ShareDropdownAction = () => (
    <button className={classNames([style.container, 'btnNoBg'])}>
        <IconShare />
        <span>Share</span>
    </button>
);

export default class TopBar extends Component {

    state = {
        selectedProjectName: this.props.selectedProjectName,
        ipfsActions: {
            showUploadDialog: this.props.ipfsActions.showUploadDialog,
            showUploadButton: this.props.ipfsActions.showUploadButton,
            showForkButton: this.props.ipfsActions.showForkButton,
            showShareButton: this.props.ipfsActions.showShareButton,
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.ipfsActions !== this.props.ipfsActions) {
            this.setState({
                ipfsActions: this.props.ipfsActions
            });
        }

        if (prevProps.selectedProjectName !== this.props.selectedProjectName) {
            this.setState({
                selectedProjectName: this.props.selectedProjectName
            });
        }
    }

    showModal = (modalType) => {
        const { showModal} = this.props;

        switch (modalType) {
            case 'preferences':
                showModal('PREFERENCES_MODAL', null);
                break;
            case 'share':
                const defaultUrl = String(window.location);
                showModal('SHARE_MODAL', {defaultUrl});
                break;
        }
    };

    onForkClicked = () => {
        const { forkProject, selectedProjectId } = this.props;
        forkProject(selectedProjectId, true);
    }

    onCloseUploadDialog = () => {
        this.props.hideUploadDialog()
    }

    render() {

        const { showUploadDialog, showUploadButton, showForkButton } = this.state.ipfsActions;
        const { project, showOpenInLab } = this.props.view;

        return (
            <div className={style.topbar}>
                <div className={style.actionsLeft}>
                    <DropdownContainer
                        className={style.actionDialogMenu}
                        dropdownContent={<MenuDropdownDialog />} >
                        <MenuAction />
                    </DropdownContainer>
                    <OnlyIf test={showOpenInLab}>
                        <a
                            className={style.openLab}
                            href={window.location}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open in Lab"
                        >
                            <IconAlphabetA style={{width: 17, height: 17}} />
                            <span>Open in Lab</span>
                        </a>
                    </OnlyIf>
                    <NetworkAccountSelector />
                    <div className={style.projectActions}>
                        <OnlyIf test={showUploadButton}>
                            <DropdownContainer
                                className={classNames([style.actionUpload, style.action])}
                                dropdownContent={<UploadDialog />}
                                enableClickInside={true}
                                showMenu={showUploadDialog}
                                onCloseMenu={this.onCloseUploadDialog}
                            >
                                <UploadDrowdownAction />
                            </DropdownContainer>
                        </OnlyIf>
                        <OnlyIf test={showForkButton}>
                            <ForkDropdownAction
                                onForkClicked={this.onForkClicked}
                                isProjectForking={this.props.isProjectForking}
                            />
                        </OnlyIf>
                        <div className={classNames([style.action, style.actionMenu])} onClick={() => this.showModal('share')}>
                            <ShareDropdownAction />
                        </div>
                    </div>
                </div>
                <ProjectTitle
                    projectName={project.name}
                />
                <div className={style.actionsRight}>
                    <NewProjectAction redirect={false} />
                    <DashboardAction />
                    <div onClick={() => this.showModal('preferences')}>
                        <PreferencesAction />
                    </div>
                    <HelpAction />
                    <LoginButton
                        functions={this.props.functions}
                        onSettingsModalClose={this.onSettingsModalClose}
                    />
                </div>
            </div>
        );
    }
}

TopBar.propTypes = {
    functions: PropTypes.object.isRequired,
    selectedProjectName: PropTypes.string,
    selectedProjectId: PropTypes.string,
    ipfsActions: PropTypes.shape({
        showUploadDialog: PropTypes.bool.isRequired,
        showUploadButton: PropTypes.bool.isRequired,
        showForkButton: PropTypes.bool.isRequired,
        showShareButton: PropTypes.bool.isRequired,
    }),
    view: PropTypes.shape({
        showSelectedProjectName: PropTypes.bool,
        showOpenInLab: PropTypes.bool,
    }),
    hideUploadDialog: PropTypes.func.isRequired,
    forkProject: PropTypes.func.isRequired
};
