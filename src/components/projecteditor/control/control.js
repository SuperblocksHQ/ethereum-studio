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
import style from './style.less';
import Item from './item/item';
import ProjectItem from './item/projectItem';
import Backend from './backend';
import NewDapp from '../../newdapp';
import NetworkAccountSelector from '../../networkAccountSelector';
import LearnAndResources from '../../learnAndResources';
import { ipfsService, previewService } from '../../../services';
import {
    IconCube,
    IconFileAlt,
    IconClose
} from '../../icons';
import Networks from '../../../networks';
import OnlyIf from '../../onlyIf';
import classNames from 'classnames';
import { BaseSidePanel } from '../sidePanels/baseSidePanel';

export default class Control extends Component {

    state = {
        isProjectLoaded: false,
        activeProject: null
    }

    constructor(props) {
        super(props);

        props.router.register('control', this);
    }

    componentDidMount() {
        this._initProject();
    }

    _initProject() {
        const { project } = this.props;

        const projectItem = new ProjectItem({
            inode: project.id,
            state: {
                name: project.name,
                title: project.title,
            },
            files: project.files
            // renameFile: this.props.renameFile
            },
            this.props.router,
            this.props.functions
        );

        this.menu = new Item({
            type: 'top',
            classes: ['menutop'],
            icon: null,
            state: {
                toggable: false,
                children: () => {
                    var children = [];
                    if (project) children.push(projectItem);
                    return children;
                },
            },
            // renameFile: props.renameFile
        });

        projectItem.load(status => {
            if (status === 0) {
                this.setState({
                    isProjectLoaded: true,
                    activeProject: projectItem,
                });

                const environments = projectItem.getHiddenItem('environments').getChildren().map(e => {
                    const name = e.getName();
                    return {
                        name,
                        endpoint: Networks[name] && Networks[name].endpoint
                    };
                });

                this.props.setAllEnvironments(environments);
            } else {
                // TODO - make sure we have a fallback here
            }
        });
    }

    /**
     * Redraw this component.
     *
     */
    redraw = () => {
        this.forceUpdate();
    };

    /**
     * Redraw the Main component.
     *
     */
    redrawMain = redrawAll => {
        this.props.router.main.redraw(redrawAll);
    };

    // /**
    //  * Load a light list of all projects in storage
    //  * and update the list of projects if necessary.
    //  *
    //  */
    // _loadProjects = cb => {
    //     this.backend.loadProjects((status, lightProjects) => {
    //         if (status != 0) {
    //             alert('Error: Could not load projects list.');
    //         } else {
    //             // Iterate over all loaded projects,
    //             // see if already loaded, else add it to the list.
    //             const projectsList = [];
    //             lightProjects.map(lightProject => {
    //                 const exists =
    //                     this._projectsList.filter(project => {
    //                         if (project.getInode() === lightProject.inode && lightProject.inode !== 1) {
    //                             projectsList.push(project);
    //                             return true;
    //                         }
    //                     }).length > 0;
    //                 if (!exists) {
    //                     const project = new ProjectItem(
    //                         {
    //                             inode: lightProject.inode,
    //                             state: {
    //                                 name: lightProject.name,
    //                                 title: lightProject.title,
    //                             },
    //                             renameFile: this.props.renameFile
    //                         },
    //                         this.props.router,
    //                         this.props.functions
    //                     );
    //                     projectsList.push(project);
    //                 }
    //             });
    //             this._projectsList = projectsList;
    //         }
    //         if (cb) cb(status);
    //     });
    // };

    // /**
    //  * Try to reopen the last opened project.
    //  */
    // _openLastProject = () => {
    //     let { selectedProjectId } = this.props;
    //     let found = false;
    //     this._projectsList.forEach(project => {
    //         if (selectedProjectId && selectedProjectId === project.getInode() && selectedProjectId !== 1) {
    //             this.openProject(project);
    //             found = true;
    //         }
    //     });
    //     return found;
    // };

    // /**
    //  * If no project is open then
    //  * open a window with a welcome message.
    //  *
    //  */
    // _showWelcome = () => {
    //     if (!this.getActiveProject()) {
    //         const item = new Item({
    //             type: 'info',
    //             type2: 'welcome',
    //             icon: <IconCube />,
    //             state: {
    //                 title: 'Welcome',
    //             },
    //             renameFile: this.props.renameFile
    //         });
    //         if (this.props.router.panes) this.props.router.panes.openItem(item);
    //     }
    // };

    /**
     * Request to close all open windows,
     * if all windows successfully closed then remove project from explorer.
     */
    // _closeProject = cb => {
    //     const { router, closeAllPanels } = this.props;
    //     router.panes.closeAll(status => {
    //         if (status == 0) {
    //             this.setState({ activeProject: null });
    //         }
    //         if (cb) cb(status);
    //     });

    //     closeAllPanels();
    // };

    // /**
    //  * Open a project in the explorer.
    //  * Request to close already open project, if any.
    //  */
    // openProject = (project, cb) => {
    //     if (this.getActiveProject() === project) {
    //         if (cb) cb(0);
    //         return;
    //     }

    //     // if we switch from temporary project, discard it
    //     if (project.getInode() !== 1) {
    //         ipfsService.clearTempProject();
    //     }

    //     this._closeProject(status => {
    //         if (status == 0) {
    //             project.load(status => {
    //                 if (status == 0) {
    //                     this._setProjectActive(project);
    //                     this.redrawMain(true);
    //                 }
    //                 if (cb) cb(status);
    //             });
    //         } else {
    //             this.redrawMain(true);
    //             if (cb) cb(status);
    //         }
    //     });
    // };

    /**
     * Return the active project (as shown in the explorer).
     *
     */
    getActiveProject = () => {
        return this.state.activeProject;
    };

    /**
     * Set a project as active in the explorer.
     */
    _setProjectActive = project => {
        this.setState({ activeProject: project });
        previewService.projectItem = project;

        let projectData = null;
        if (project) {
            projectData = {
                id: project.getInode(),
                name: project.getName(),
                // TODO: this should be read from epic in local storage
                environments: project.getHiddenItem('environments').getChildren().map(e => {
                    const name = e.getName();
                    return {
                        name,
                        endpoint: Networks[name] && Networks[name].endpoint
                    };
                })
            };
        }
        this.props.selectProject(projectData);
    };

    /**
     * Open the project config item for the active project.
     */
    openProjectConfig = item => {
        const project = this.getActiveProject();
        if (project) {
            if (this.props.router.panes)
                this.props.router.panes.openItem(project);
        }
    };

    /**
     * Open the dialog about creating a new project.
     * Create the new project and open it.
     */
    newDapp = e => {
        e.preventDefault();
        const project = this.getActiveProject();
        if (project && !project.isSaved()) {
            alert('Please save the current project first.');
            return;
        }
        const cb = status => {
            if (status == 0) {
                this._loadProjects(() => {
                    this._closeProject(status => {
                        if (status == 0) {
                            // Open last project
                            this.openProject(
                                this._projectsList[
                                    this._projectsList.length - 1
                                ]
                            );
                        }
                    });
                });
            } else {
                alert(
                    'A DApp with that name already exists, please choose a different name.'
                );
            }
        };
        const modal = {};
        modal.render = () => {
            return (
                <NewDapp
                    backend={this.backend}
                    router={this.props.router}
                    functions={this.props.functions}
                    modal={modal}
                    cb={cb}
                />
            );
        };
        this.props.functions.modal.show(modal);
    };

    importProject = (files, isTemporary) => {
        const cb = status => {
            if (status == 0) {
                this._loadProjects(() => {
                    this._closeProject(status => {
                        if (status == 0) {
                            // Open last project
                            this.openProject(
                                this._projectsList[
                                    this._projectsList.length - 1
                                ]
                            );
                        }
                    });
                });
            } else {
                alert('Error: could not import project.');
            }
        };

        this.props.router.control.backend.createProject(files, cb, isTemporary);
    };

    // deleteProject = (project, cb) => {
    //     if (confirm('Are you sure you want to delete this project?')) {
    //         const delFn = cb => {
    //             project.delete(status => {
    //                 this._loadProjects(() => {
    //                     if (cb) cb(status);
    //                 });
    //             });
    //         };

    //         if (this.getActiveProject() == project) {
    //             this._closeProject(status => {
    //                 if (status == 0) {
    //                     delFn(status => {
    //                         // Open project if any
    //                         if (this._projectsList.length) {
    //                             this.openProject(
    //                                 this._projectsList[
    //                                     this._projectsList.length - 1
    //                                 ]
    //                             );
    //                         } else {
    //                             this._setProjectActive(null);
    //                             this._showWelcome();
    //                             this.redrawMain(true);
    //                         }
    //                         if (cb) cb(status);
    //                     });
    //                 } else {
    //                     if (cb) cb(status);
    //                 }
    //             });
    //         } else {
    //             delFn(cb);
    //         }
    //     } else {
    //         if (cb) cb(1);
    //     }
    // };

    renderProject() {
        const { isProjectLoaded } = this.state;

        if (!isProjectLoaded) {
            // TODO - Simply put a loader here
            return <div>Loading Project</div>
        } else {
            return this.menu.render();
        }
    }

    render() {
        // const item = this.state.menu.render();
        const { toggleFileSystemPanel } = this.props;
        const projectFiles = this.renderProject();

        return (
            <div className="full">
                <BaseSidePanel
                    icon={ <IconFileAlt /> }
                    name="Explorer"
                    onClose={toggleFileSystemPanel}>
                    <div className={style.treemenu}>
                        {projectFiles}
                    </div>
                </BaseSidePanel>
            </div>
        );
    }

}

Control.propTypes = {
    appVersion: PropTypes.string.isRequired,
    setAllEnvironments: PropTypes.func.isRequired,
    renameFile: PropTypes.func.isRequired,
    selectedProjectId: PropTypes.string,
    toggleFileSystemPanel: PropTypes.func.isRequired,
    project: PropTypes.object
};
