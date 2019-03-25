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
import {
    IconPreferences,
    IconProjectSelector,
    IconFork,
    IconShare,
    IconMenu,
    IconAlphabetA
} from '../icons';
import OnlyIf from '../onlyIf';
import { ConfigurationSelector } from './configurationSelector';
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

const ForkDropdownAction = (props) => {
    const { onForkClicked } = props;
    return(
        <div className={style.action}>
            <button className={classNames([style.actionFork, style.container, 'btnNoBg'])} onClick={onForkClicked}>
                <IconFork />
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

    showPreferencesModal = () => {
        this.props.showModal('PREFERENCES_MODAL', null);
    }

    showShareModal = () => {
        this.props.showModal('SHARE_MODAL', {defaultUrl: String(window.location)});
    }

    showConfigurationsModal = () => {
        this.props.showModal('CONFIGURATIONS_MODAL', null);
    }

    onForkClicked = () => {
        const { forkProject, selectedProjectId } = this.props;
        forkProject(selectedProjectId, true);
    }

    onCloseUploadDialog = () => {
        this.props.hideUploadDialog()
    }

    render() {

        const { showForkButton } = this.state.ipfsActions;
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
                    <ConfigurationSelector
                        items={this.props.configurations}
                        onChange={this.props.selectConfiguration}
                        onAddConfig={this.showConfigurationsModal} />
                    <div className={style.projectActions}>
                        <OnlyIf test={showForkButton}>
                            <ForkDropdownAction
                                onForkClicked={this.onForkClicked}
                            />
                        </OnlyIf>
                        <div className={classNames([style.action, style.actionMenu])} onClick={this.showShareModal}>
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
                    <div onClick={this.showPreferencesModal}>
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
        showForkButton: PropTypes.bool.isRequired,
        showShareButton: PropTypes.bool.isRequired,
    }),
    view: PropTypes.shape({
        showOpenInLab: PropTypes.bool,
    }),
    hideUploadDialog: PropTypes.func.isRequired,
    forkProject: PropTypes.func.isRequired
};
