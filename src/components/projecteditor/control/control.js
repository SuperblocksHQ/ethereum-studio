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

    constructor(props) {
        super(props);
        this.backend = new Backend();
        this._projectsList = [];
        const menu = new Item({
            type: 'top',
            classes: ['menutop'],
            icon: null,
            state: {
                toggable: false,
                children: () => {
                    var children = [];
                    const project = this.getActiveProject();
                    if (project) children.push(project);
                    return children;
                },
            },
            renameFile: props.renameFile
        });

        this.state = {
            activeProject: null,
            menu: menu
        };

        props.router.register('control', this);
    }

    componentDidMount() {
        this._loadProjects(status => {
            if (status == 0) {
                // Make sure no project gets loaded if we are importing one from IPFS
                if (!this.props.isImportedProject) {
                    if (!this._openLastProject()) {
                        this._setProjectActive(null);
                        this._showWelcome();
                    }
                }
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

    /**
     * Load a light list of all projects in storage
     * and update the list of projects if necessary.
     *
     */
    _loadProjects = cb => {
        this.backend.loadProjects((status, lightProjects) => {
            if (status != 0) {
                alert('Error: Could not load projects list.');
            } else {
                // Iterate over all loaded projects,
                // see if already loaded, else add it to the list.
                const projectsList = [];
                lightProjects.map(lightProject => {
                    const exists =
                        this._projectsList.filter(project => {
                            if (project.getInode() === lightProject.inode && lightProject.inode !== 1) {
                                projectsList.push(project);
                                return true;
                            }
                        }).length > 0;
                    if (!exists) {
                        const project = new ProjectItem(
                            {
                                inode: lightProject.inode,
                                state: {
                                    name: lightProject.name,
                                    title: lightProject.title,
                                },
                                renameFile: this.props.renameFile
                            },
                            this.props.router,
                            this.props.functions
                        );
                        projectsList.push(project);
                    }
                });
                this._projectsList = projectsList;
            }
            if (cb) cb(status);
        });
    };

    /**
     * Try to reopen the last opened project.
     */
    _openLastProject = () => {
        let { selectedProjectId } = this.props;
        let found = false;
        this._projectsList.forEach(project => {
            if (selectedProjectId && selectedProjectId === project.getInode() && selectedProjectId !== 1) {
                this.openProject(project);
                found = true;
            }
        });
        return found;
    };

    /**
     * If no project is open then
     * open a window with a welcome message.
     *
     */
    _showWelcome = () => {
        if (!this.getActiveProject()) {
            const item = new Item({
                type: 'info',
                type2: 'welcome',
                icon: <IconCube />,
                state: {
                    title: 'Welcome',
                },
                renameFile: this.props.renameFile
            });
            if (this.props.router.panes) this.props.router.panes.openItem(item);
        }
    };

    /**
     * Request to close all open windows,
     * if all windows successfully closed then remove project from explorer.
     */
    _closeProject = cb => {
        const { router, closeAllPanels } = this.props;
        router.panes.closeAll(status => {
            if (status == 0) {
                this.setState({ activeProject: null });
            }
            if (cb) cb(status);
        });

        closeAllPanels();
    };

    /**
     * Open a project in the explorer.
     * Request to close already open project, if any.
     */
    openProject = (project, cb) => {
        if (this.getActiveProject() === project) {
            if (cb) cb(0);
            return;
        }

        // if we switch from temporary project, discard it
        if (project.getInode() !== 1) {
            ipfsService.clearTempProject();
        }

        this._closeProject(status => {
            if (status == 0) {
                project.load(status => {
                    if (status == 0) {
                        this._setProjectActive(project);
                        this.redrawMain(true);
                    }
                    if (cb) cb(status);
                });
            } else {
                this.redrawMain(true);
                if (cb) cb(status);
            }
        });
    };

    /**
     * Return the active project (as shown in the explorer).
     *
     */
    getActiveProject = () => {
        return this.state.activeProject;
    };

    /**
     * Return the list of loaded projects.
     *
     */
    getProjects = () => {
        return this._projectsList;
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

    _openItem = (e, item) => {
        e.preventDefault();
        e.stopPropagation();

        if (this.props.router.panes) this.props.router.panes.openItem(item);
    };

    openContractItem = (e, item, id) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const fullpath = item.props.state.fullpath;
        const dappfile = item.props.state.project.props.state.data.dappfile;
        // Check so that the contract file is represented in the Dappfile, otherwise create that representation.
        var contract = dappfile.contracts().filter(c => {
            return c.source == fullpath;
        })[0];

        if (!contract) {
            var name = fullpath.match('.*[/](.+)[.]([^.]+)$')[1];
            contract = {
                name: name,
                args: [],
                source: fullpath,
                blockchain: 'ethereum',
            };
            dappfile.contracts().push(contract);
            // TODO: new to save the file.
        }

        item.props.state.contract = contract;

        if (this.props.router.panes) this.props.router.panes.openItem(item, id);
    };

    _closeAnyContractItemsOpen = (contractName, includeConfigure, cb) => {
        const project = this.getActiveProject();
        if (project) {
            // TODO: this lookup is bad since it depends on the order of the menu items.
            // TODO: look through project object for the contract named contractName, then get the item for the Editor, Compiler, Deployer and Interact window.
            const items = [];
            const item = project.props.state.children[1]
                .getChildren()[0]
                .props.state._children.filter(item => {
                    return (
                        item.props.state.contract &&
                        item.props.state.contract.name == contractName
                    );
                })[0];
            if (!item) {
                if (cb) cb(2);
                return;
            }
            items.push(item);
            if (includeConfigure) {
                items.push(item.props.state.children[0]); // Configure item
            }
            items.push(item.props.state.children[1]);
            items.push(item.props.state.children[2]);
            items.push(item.props.state.children[3]);

            const close = (items, cb) => {
                if (items.length == 0) {
                    if (cb) cb(0);
                    return;
                }
                const item = items.pop();
                const { pane, winId } = this.props.router.panes.getWindowByItem(
                    item
                );
                if (pane && winId) {
                    this.props.router.panes.closeWindow(
                        pane.id,
                        winId,
                        status => {
                            if (status != 0) {
                                if (cb) cb(status);
                                return;
                            }
                            close(items, cb);
                        }
                    );
                } else {
                    close(items, cb);
                }
            };
            close(items, cb);
            return;
        }
        if (cb) cb(1);
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

    deleteProject = (project, cb) => {
        if (confirm('Are you sure you want to delete this project?')) {
            const delFn = cb => {
                project.delete(status => {
                    this._loadProjects(() => {
                        if (cb) cb(status);
                    });
                });
            };

            if (this.getActiveProject() == project) {
                this._closeProject(status => {
                    if (status == 0) {
                        delFn(status => {
                            // Open project if any
                            if (this._projectsList.length) {
                                this.openProject(
                                    this._projectsList[
                                        this._projectsList.length - 1
                                    ]
                                );
                            } else {
                                this._setProjectActive(null);
                                this._showWelcome();
                                this.redrawMain(true);
                            }
                            if (cb) cb(status);
                        });
                    } else {
                        if (cb) cb(status);
                    }
                });
            } else {
                delFn(cb);
            }
        } else {
            if (cb) cb(1);
        }
    };

    _openContractMake = (e, item) => {
        e.preventDefault();
        const item2 = this._filterItem(item, { type: 'make' });
        if (item2 && this.props.router.panes)
            this.props.router.panes.openItem(item2);
    };

    _filterItem = (root, filter) => {
        if (this._filterItemCmp(root, filter)) {
            return root;
        }
        return root.getChildren().filter(item => {
            return this._filterItemCmp(item, filter);
        })[0];
    };

    _filterItemCmp = (item, filter) => {
        const keys = Object.keys(filter);
        for (var index = 0; index < keys.length; index++) {
            const key = keys[index];
            if (item.props[key] != filter[key]) return false;
        }
        return true;
    };

    openTransactionHistory = () => {
        // Open the transaction history tab for the open project.
        const project = this.getActiveProject();
        if (project) {
            //TODO: this lookup is bad since it depends on the order of the menu items.
            if (this.props.router.panes)
                this.props.router.panes.openItem(
                    project.props.state.children[0]
                );
        }
    };

    _clickNewContract = (e, projectItem) => {
        e.preventDefault();
        e.stopPropagation();

        var name;
        name = prompt('Please give the contract a name:');
        if (!name) return;
        if(!name.match(/^([a-zA-Z0-9-_]+)$/) || name.length > 255) {
            alert('Illegal contract name. Only A-Za-z0-9, dash (-) and underscore (_) allowed. Max 255 characters.');
            return;
        }
        if (
            projectItem.props.state.data.dappfile.contracts().filter(c => {
                return c.name == name;
            }).length > 0
        ) {
            alert(
                'A contract by this name already exists, choose a different name, please.'
            );
            return;
        }
        //for(var index=0;index<100000;index++) {
        //name="Contract"+index;
        //if(projectItem.props.state.data.dappfile.contracts().filter((c)=>{
        //return c.name==name;
        //}).length==0) {
        //break;
        //}
        //}
        var account = '';
        if (projectItem.props.state.data.dappfile.accounts().length > 0)
            account = projectItem.props.state.data.dappfile.accounts()[0].name;
        projectItem.props.state.data.dappfile.contracts().push({
            name: name,
            account: account,
            source: '/contracts/' + name + '.sol',
            blockchain: 'ethereum',
        });
        projectItem.save(status => {
            if (status == 0) {
                // Note: children[0] holds the "Transaction Logs", so the actual starting
                //       position for contracts starts at children index 1.
                //
                // TODO: this lookup is bad.
                const ctrs =
                    projectItem.props.state.children[1].props.state._children;

                // Note: The following check asserts there exists at least 1 valid element plus one.
                //       The extra position (plus one) is reserved to the "make contract" prop, appended to the end
                //       of the contracts array (ctrs).
                //       The extra position is the last valid element at index ctrs.length-1
                //       The last valid contract element is at index ctrs.length-2
                if (ctrs && ctrs.length >= 2) {
                    const contract = ctrs[ctrs.length - 2];
                    const item = contract.props.state.children[0];
                    if (this.props.router.panes)
                        this.props.router.panes.openItem(item);
                }
            }
        });
        this.redrawMain(true);
    };

    _clickDeleteContract = (e, projectItem, contractIndex) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Really delete contract?')) return;
        const contract = projectItem.props.state.data.dappfile.contracts()[
            contractIndex
        ];
        this._closeAnyContractItemsOpen(contract.name, true, status => {
            if (status != 0) {
                alert(
                    'Could not delete contract, close editor/compiler/deployer/interaction windows and try again.'
                );
                return;
            }
            projectItem.deleteFile(contract.source, status => {
                if (status > 0) {
                    alert(
                        'Could not delete contract, close editor and try again.'
                    );
                    return;
                }
                projectItem.props.state.data.dappfile
                    .contracts()
                    .splice(contractIndex, 1);
                projectItem.save();
                this.redrawMain(true);
            });
        });
    };

    _clickEditAccount = (e, projectItem, accountIndex) => {
        const account = projectItem.filterNonMenuItem('accounts', {
            _index: accountIndex,
        });
        this._openItem(e, account);
    };

    render() {
        const item = this.state.menu.render();
        const isProjectActive = this.state.activeProject;
        const { toggleFileSystemPanel } = this.props;

        return (
            <div className="full">
                <BaseSidePanel icon={ <IconFileAlt /> } name="Explorer" onClose={toggleFileSystemPanel}>
                    <div className={style.treemenu}>
                        {item}
                        <OnlyIf test={!isProjectActive}>
                            <LearnAndResources className="mt-3" />
                        </OnlyIf>
                    </div>
                </BaseSidePanel>
            </div>
        );
    }
}

Control.propTypes = {
    appVersion: PropTypes.string.isRequired,
    selectProject: PropTypes.func.isRequired,
    renameFile: PropTypes.func.isRequired,
    selectedProjectId: PropTypes.number,
    toggleFileSystemPanel: PropTypes.func.isRequired,
};
