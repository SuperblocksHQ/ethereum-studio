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
import PropTypes from 'prop-types';
import classNames from 'classnames';
import style from './style.less';
import { DropdownContainer } from '../common/dropdown';
import Backend from '../projecteditor/control/backend';
import Modal from '../modal';
import { Tooltip } from '../common';
import PreferencessModal from '../preferences';
import UploadDialog from './upload';
import Note from '../note';
import {
    IconDownload,
    IconTrash,
    IconConfigure,
    IconHelp,
    IconProjectSelector,
    IconDropdown,
    IconDiscord,
    IconCheck,
    IconUpload,
    IconFork
} from '../icons';
import Dappfile from '../projecteditor/control/item/dappfileItem';
import OnlyIf from '../onlyIf';

const PreferencesAction = () => (
    <div className={style.action}>
        <button className={classNames([style.container, "btnNoBg"])}>
            <IconConfigure />
            <span>Preferences</span>
        </button>
    </div>
);

const HelpDropdownAction = () => (
    <div className={style.action}>
        <button className={classNames([style.container, 'btnNoBg'])}>
            <IconHelp />
            <span>Help</span>
        </button>
    </div>
);

const UploadDrowdownAction = () => (
    <div className={style.action}>
        <button className={classNames([style.container, 'btnNoBg'])}>
            <IconUpload />
            <span>Upload</span>
        </button>
        <Note
            title="Beta"
            backgroundColor="#417505"
            color="#fff"
        />
    </div>
);

const ForkDropdownAction = (props) => {
    const { onForkClicked } = props;
    return(
        <div className={style.action}>
            <button className={classNames([style.container, 'btnNoBg'])} onClick={onForkClicked}>
                <IconFork />
                <span>Fork</span>
            </button>
        </div>
    )
};

const HelpDropdownDialog = () => (
    <div className={style.helpMenu}>
        <div className={style.title}>General</div>
        <ul>
            <li>
                <a
                    href="https://help.superblocks.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Help Center
                </a>
            </li>
            <li>
                <a className={style.container} href="https://discord.gg/6Cgg2Dw" target="_blank" rel="noopener noreferrer" title="Superblocks' community">
                    Join our Community!
                    <span className={style.communityIcon}>
                        <IconDiscord color="#7289DA"/>
                    </span>
                </a>
            </li>
        </ul>
    </div>
);

const ProjectSelector = ({ title } = props) => (
    <div className={style.action}>
        <button className="btnNoBg">
            <IconProjectSelector className={style.icon} />
            <span className={style.projectText}>{title}</span>
            <IconDropdown className={classNames([style.dropDown, 'dropDown'])} />
        </button>
    </div>
);

class ProjectDialog extends Component {
    openProject = (e, project, cb) => {
        this.props.router.control.openProject(project, cb);
        this.props.onProjectSelected();
    };

    openProjectConfig = (e, project) => {
        this.openProject(e, project, status => {
            if (status == 0) {
                this.props.router.control.openProjectConfig();
            }
        });
    };

    downloadProject = (e, project) => {
        e.stopPropagation();

        const keepState = prompt(
            'Do you also want to save the project state (current contract addresses, ABIs, etc)?',
            'yes'
        );
        if (!keepState) {
            return;
        }
        const s = keepState.toLowerCase();
        if (s != 'yes' && s != 'no') {
            alert('Download aborted. Yes or No answer expected.');
            return;
        }
        const backend = new Backend();
        backend.downloadProject(project, keepState.toLowerCase() == 'yes');
    };

    importProject = e => {
        // Thanks to Richard Bondi for contributing with this upload code.
        e.preventDefault();
        var uploadAnchorNode = document.createElement('input');
        uploadAnchorNode.setAttribute('id', 'importFileInput');
        uploadAnchorNode.setAttribute('type', 'file');
        uploadAnchorNode.onchange = this.importProject2;
        document.body.appendChild(uploadAnchorNode); // required for firefox
        uploadAnchorNode.click();
        uploadAnchorNode.remove();
    };

    importProject2 = e => {
        var file = e.target.files[0];
        var reader = new FileReader();

        reader.onloadend = evt => {
            var project;
            if (evt.target.readyState == FileReader.DONE) {
                if (evt.target.result.length > 1024**2) {
                    alert('File to big to be handled. Max size in 1 MB.');
                    return;
                }

                const backend = new Backend();
                backend.unZip(evt.target.result).then( (project) => {
                    this.importProject3(project);
                })
                    .catch( () => {
                        console.log("Could not parse import as zip, trying JSON.");
                        try {
                            const obj = JSON.parse(evt.target.result);
                            if (!obj.files) {
                                alert('Error: Invalid project file. Must be ZIP-file (or legacy JSON format).');
                                return;
                            }
                            project = obj;
                        } catch (e) {
                            alert('Error: Invalid project file. Must be ZIP-file (or legacy JSON format).');
                            return;
                        }
                        this.importProject3(project);
                    });

            }
        };
        var blob = file.slice(0, file.size);
        reader.readAsBinaryString(blob);
    };

    importProject3 = project => {
        const backend = new Backend();
        backend.convertProject(project, (status, project2) => {
            if (status > 1) {
                const modalData = {
                    title: 'Project converted',
                    body: (
                        <div>
                            <div>
                                The imported project has been converted to the
                                new Superblocks Lab format.
                                <br />
                                You might need to reconfigure your accounts and
                                contract arguments due to these changes. We are
                                sorry for any inconvenience.
                            </div>
                            <div>
                                Please see the Superblocks Lab help center for
                                more information on this topic.
                            </div>
                        </div>
                    ),
                    style: { width: '680px' },
                };
                const modal = <Modal data={modalData} />;
                this.props.functions.modal.show({
                    cancel: () => {
                        this.importProject4(project2.files);
                        return true;
                    },
                    render: () => {
                        return modal;
                    },
                });
            } else if (status == -1) {
                alert('Error: Could not import project.');
            } else {
                this.importProject4(project.files);
            }
        });
    };

    importProject4 = files => {
        var title = '';
        var name = '';
        var dappfile;

        // Try to decode the `/dappfile.json`.
        try {
            dappfile = JSON.parse(
                files['/'].children['dappfile.json'].contents
            );
        } catch (e) {
            // Create a default dappfile.
            console.log('Create default dappfile.json for import');
            dappfile = Dappfile.getDefaultDappfile();
            files['/'].children['dappfile.json'] = {type: 'f'};
        }

        try {
            title = dappfile.project.info.title || '';
            name = dappfile.project.info.name || '';
        } catch (e) {
            dappfile.project = { info: {} };
        }

        // This will make sure the dappfile has a sane state.
        Dappfile.validateDappfile(dappfile);

        do {
            var name2 = prompt('Please give the project a name.', name);
            if (!name2) {
                alert('Import cancelled.');
                return;
            }
            if (!name2.match(/^([a-zA-Z0-9-]+)$/) || name2.length > 30) {
                alert(
                    'Illegal projectname. Only A-Za-z0-9 and dash (-) allowed. Max 30 characters.'
                );
                continue;
            }
            name = name2;
            break;
        } while (true);

        do {
            var title2 = prompt(
                'Please give the project a snappy title.',
                title
            );
            if (!title2) {
                alert('Import cancelled.');
                return;
            }
            if (title2.match(/([\"\'\\]+)/) || title2.length > 100) {
                alert(
                    'Illegal title. No special characters allowed. Max 100 characters.'
                );
                continue;
            }
            title = title2;
            break;
        } while (true);

        try {
            dappfile.project.info.name = name;
            dappfile.project.info.title = title;
            files['/'].children['dappfile.json'].contents = JSON.stringify(
                dappfile, null, 4
            );
        } catch (e) {
            console.error(e);
            alert('Error: could not import project.');
            return;
        }

        this.props.router.control.importProject(files);
    };

    deleteProject = (e, project) => {
        e.stopPropagation();

        this.props.router.control.deleteProject(project, () => {
            this.forceUpdate();
        });
    };

    getProjectItems = () => {
        if (this.props.router.control) {
            const openProject = this.props.router.control.getActiveProject();

            const items = this.props.router.control
                .getProjects()
                .slice(0)
                .reverse()
                .map(project => {
                    const isActive = openProject === project;
                    const isTemporaryProject = project.getInode() === 1;
                    return (
                        !isTemporaryProject &&
                        <li
                            key={project.getInode()}
                            className={style.projSwitcherItem}
                            onClick={e => {
                                this.openProject(e, project);
                            }}
                        >
                            <div
                                className={classNames([
                                    style.projSwitcherRow,
                                    style.container,
                                ])}
                            >
                                {isActive ? (
                                    <div className={style.active}>
                                        <IconCheck />
                                    </div>
                                ) : null}
                                <div className={style.container}>
                                    <div className={style.overflowText}>
                                        {project.getName()} - &nbsp;
                                        {project.getTitle()}
                                    </div>
                                </div>
                                <div
                                    className={classNames([
                                        style.projSwitcherRowActions,
                                        style.container,
                                    ])}
                                >
                                    <button
                                        className="btnNoBg"
                                        onClick={e => {
                                            this.openProjectConfig(e, project);
                                        }}
                                    >
                                        <Tooltip title="Configure Project">
                                            <IconConfigure />
                                        </Tooltip>
                                    </button>
                                    <button
                                        className="btnNoBg"
                                        onClick={e => {
                                            this.downloadProject(e, project);
                                        }}
                                    >
                                        <Tooltip title="Download">
                                            <IconDownload />
                                        </Tooltip>
                                    </button>
                                    <button
                                        className="btnNoBg"
                                        onClick={e => {
                                            this.deleteProject(e, project);
                                        }}
                                    >
                                        <Tooltip title="Delete">
                                            <IconTrash />
                                        </Tooltip>
                                    </button>
                                </div>
                            </div>
                        </li>
                    );
                });

            return items;
        }
    };

    render() {
        const projectItems = this.getProjectItems();
        return (
            <div className={classNames([style.projectMenu, 'modal'])}>
                <div className={style.tabs}>
                    <div className={classNames([style.tabList, style.container])}>
                        <button className={style.tab}>Personal</button>
                    </div>
                    <div className={classNames([style.paneList, style.container])}>
                        <div className={style.pane}>
                            <ul className={style.projectSwitcherList}>
                                {projectItems}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={style.actions}>
                    <button
                        className="btnNoBg"
                        onClick={this.props.router.control.newDapp}
                    >
                        Create New
                    </button>
                    <div className={style.separator} />
                    <button className="btnNoBg" onClick={this.importProject}>
                        Import
                    </button>
                </div>
            </div>
        );
    }
}

ProjectDialog.propTypes = {
    onProjectSelected: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    functions: PropTypes.object.isRequired,
};

export default class TopBar extends Component {

    state = {
        selectedProjectName: this.props.selectedProjectName,
        ipfsActions: {
            showUploadDialog: this.props.ipfsActions.showUploadDialog,
            showUploadButton: this.props.ipfsActions.showUploadButton,
            showForkButton: this.props.ipfsActions.showForkButton
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

    onSettingsModalClose = () => {
        this.props.functions.modal.close();
    };

    showPreferencesModal = () => {
        const modal = (
            <PreferencessModal
                onCloseClick={this.onSettingsModalClose}
            />
        );
        this.props.functions.modal.show({
            cancel: () => {
                return false;
            },
            render: () => {
                return modal;
            }
        });
    };

    onForkClicked = () => {
        this.props.forkProject();
    }

    onCloseUploadDialog = () => {
        this.props.hideUploadDialog()
    }

    render() {
        const { showUploadDialog, showUploadButton, showForkButton } = this.state.ipfsActions;
        const { selectedProjectName } = this.state;

        return (
            <div className={style.topbar}>
                <img
                    className={style.logo}
                    src="/static/img/img-lab-logo.svg"
                    alt="Superblocks Lab logo"
                />
                <OnlyIf test={showUploadButton}>
                    <DropdownContainer
                        className={style.actionHelp}
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
                    />
                </OnlyIf>
                <DropdownContainer
                    className={style.projectButton}
                    dropdownContent={
                        <ProjectDialog
                            functions={this.props.functions}
                            router={this.props.router}
                            onProjectSelected={this.props.onProjectSelected}
                        />
                    }
                >
                    <ProjectSelector title={selectedProjectName} />
                </DropdownContainer>

                <div className={style.actionsRight}>
                    <div onClick={this.showPreferencesModal}>
                        <PreferencesAction />
                    </div>

                    <DropdownContainer
                        className={style.actionHelp}
                        dropdownContent={<HelpDropdownDialog />} >
                        <HelpDropdownAction />
                    </DropdownContainer>
                </div>
            </div>
        );
    }
}

TopBar.propTypes = {
    onProjectSelected: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    functions: PropTypes.object.isRequired,
    selectedProjectName: PropTypes.string,
    ipfsActions: PropTypes.shape({
        showUploadDialog: PropTypes.bool.isRequired,
        showUploadButton: PropTypes.bool.isRequired,
        showForkButton: PropTypes.bool.isRequired,
    }),
};
