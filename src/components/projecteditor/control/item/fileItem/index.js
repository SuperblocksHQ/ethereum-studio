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

import React from 'react';
import classnames from 'classnames';
import Item from '../item';
import {
    IconFile,
    IconConfigure,
    IconCompile,
    IconDeploy,
    IconInteract,
    IconContract,
    IconHtml,
    IconJS,
    IconCss,
    IconMd,
    IconJSON,
    IconBinary,
} from '../../../../icons';
import style from '../../style.less';
import { DirectoryEntry } from './directoryEntry';
import { FileEntry } from './fileEntry';
import ImportFileModal from "../../../../importFile";

export default class FileItem extends Item {
    constructor(props, router, functions) {
        props.state = props.state || {};
        props.type = props.type || 'file';
        props.lazy = props.lazy === undefined ? true : props.lazy;
        props.state.toggable =
            props.state.toggable === undefined
                ? props.type == 'folder'
                : props.state.toggable;
        props.state.open =
            props.state.open === undefined ? true : props.state.open;
        super(props, router, functions);
        if (props.type == "folder") {
            props.state.children = (props.state.children === undefined ? this._createChildren : props.state.children);
        }
        props.state.isSaved = true;
        props.state.contents = '';
        props.state.savedContents = '';
        props.render = props.render || this._renderFileTitle;

        if (props.type == 'file') {
            var icon = <IconFile />;
            var type2 = 'file';
            var a = (props.state.file || '').match('.*[.]([^.]+)$');
            if (a) {
                const suffix = a[1].toLowerCase();
                switch (suffix) {
                    case 'html':
                        type2 = 'html';
                        icon = <IconHtml />;
                        break;
                    case 'css':
                        type2 = 'css';
                        icon = <IconCss />;
                        break;
                    case 'js':
                        type2 = 'js';
                        icon = <IconJS />;
                        break;
                    case 'md':
                        type2 = 'md';
                        icon = <IconMd />;
                        break;
                    case 'sol':
                        type2 = 'contract';
                        icon = <IconContract />;
                        break;
                    case 'json':
                        type2 = 'json';
                        icon = <IconJSON />;
                        break;
                    case 'bin':
                        type2 = 'bin';
                        icon = <IconBinary />;
                        break;
                }
            }
            props.type2 = props.type2 || type2;
            props.icon = props.icon || icon;
        }
    }

    /**
     * Override
     * Sort items in alphabetical order.
     */
    _sort = (items) => {
        return items.sort( (itemA, itemB) => {
            if (!itemA.getFile || !itemB.getFile) return 0;
            const a = itemA.getFile();
            const b = itemB.getFile();
            const aLC = a.toLowerCase();
            const bLC = b.toLowerCase();
            return (aLC > bLC ? 1 : aLC < bLC ? -1: (a > b ? 1 : a < b ? -1 : 0));
        });
    }

    /**
     * Return the file/dir name.
     */
    getFile = () => {
        return this.props.state.file;
    };

    /**
     * Return the full path of the file/dir.
     */
    getFullPath = () => {
        var s =
            (this.props.state.__parent
                ? this.props.state.__parent.getFullPath()
                : '') +
            '/' +
            this.props.state.file;
        if (s.substr(0, 2) == '//') {
            s = s.substr(1);
        }
        return s;
    };

    /**
     * Load the contents of the file.
     * @param reload: force reload
     * @return Promise
     */
    load = reload => {
        if (!this.isSaved() && !reload) {
            return new Promise((resolve, reject) => {
                console.log(
                    'File not saved, cannot reload it without force flag.'
                );
                reject();
            });
        }

        return new Promise((resolve, reject) => {
            const project = this.getProject();
            project.loadFile(this.getFullPath(), ret => {
                if (ret.status != 0) {
                    reject();
                } else {
                    this.props.state.savedContents = ret.contents;
                    this.setContents(ret.contents);
                    resolve();
                }
            });
        });
    };

    /**
     * Save the contents of the file.
     * @return: Promise
     *
     */
    save = () => {
        return new Promise( (resolve, reject) => {
            const project = this.getProject();
            project.saveFile(this.getFullPath(), this.getContents(), ret => {
                if (ret.status != 0) {
                    reject();
                } else {
                    this.props.state.savedContents = this.getContents();
                    this.props.state.isSaved = true;
                    resolve();
                }
            });
        });
    };

    setContents = contents => {
        this.props.state.contents = contents;
        this.props.state.isSaved =
            this.props.state.contents == this.props.state.savedContents;
    };

    getContents = () => {
        return this.props.state.contents;
    };

    isSaved = () => {
        return this.props.state.isSaved;
    };

    isReadOnly = () => {
        return this.props.state.isReadOnly == true;
    };

    setReadOnly = flag => {
        this.props.state.isReadOnly = flag;
    };

    _loadFileTree = (item) => {
        return new Promise( (resolve, reject) => {
            item = item || this;
            if (item.getType() == 'folder') {
                const children = item.getChildren(true, () => {
                    const children = item.getChildren().slice(0);
                    const promises = children.map( (child) => {
                        return child._loadFileTree();
                    });
                    Promise.all(promises).then( () => {
                        resolve();
                    });
                });
            }
            else {
                resolve();
            }
        });
    };

    /**
     * Move/Rename this file in storage.
     *
     */
    mv = newFullPath => {
        if (newFullPath[newFullPath.length - 1] == '/') {
            // Cannot end with slash (nor be a (Lonesome) Cowboy Slash).
            return new Promise((resolve, reject) => {
                reject();
            });
        }
        return new Promise( (resolve, reject) => {
            this._loadFileTree().then( () => {
                const project = this.getProject();
                const oldPath = this.getFullPath();
                project.moveFile(oldPath, newFullPath, (status) => {
                    if (status != 0 ) {
                        reject(status);
                    }
                    else {
                        // Update this item with new filename.
                        // Move item and change parent.
                        const a = newFullPath.match("^(.*)/([^/]+)$");
                        const newPath = a[1];
                        const filename = a[2];
                        this.reKey(filename, newFullPath);
                        this.props.state.file = filename;
                        this.props.state.title = filename;

                        // Disconnect item from cached children list in parent.
                        const children = this.props.state.__parent.getChildren();  // This will already be loaded and cached, otherwise we couldn't be here.
                        for(let index=0; index < children.length; index++) {
                            if (children[index].props.state.key == this.props.state.key) {
                                children.splice(index);
                                break;
                            }
                        }

                        // We want to get the new parent item to attach this item to.
                        // But we must be careful not to have it create missing contracts in the dappfile in this stage.
                        const project = this.getProject();
                        const newPathArray = newPath.split('/');
                        project.getItemByPath(newPathArray, this.getProject()).then( (newParent) => {
                            // Set new parent
                            this.props.state.__parent = newParent;

                            // Now we need to notify this file and all below if this is a folder that they have been moved.
                            // Contract files need to adjust their settings in the dappfile, which they will do when notified.
                            // It is important this is done before we recache the children below.
                            // Note that when renaming a non contract to a contract file the dappfile will get updated at a later stage.
                            if (this.notifyMoved) {
                                var promise = this.notifyMoved(oldPath);
                            }
                            else {
                                var promise = Promise.resolve();
                            }
                            promise
                                .then( () => {
                                    // Recache the children, this will create the missing contract.
                                    newParent.getChildren(true, () => {
                                        const children2 = newParent.getChildren();
                                        this._copyState(children2, [this]);
                                        if (this.getType() == 'file') {
                                            this.props.renameFile(this.props.state.id, filename); // update redux, only for files for now
                                        }
                                        resolve();
                                    });
                                });

                        }).catch( () => {
                            alert("Error: Unexpected error when moving file.");
                            location.reload();
                            return;
                        });
                    }
                });
            });
        });
    };

    /**
     * Close the open file.
     * This means reverting the buffer to it's last saved state.
     *
     */
    close = cb => {
        this.revert();
    };

    revert = () => {
        this.setContents(this.props.state.savedContents);
    };

    /**
     * Default implementation for when a file has been deleted.
     * If this is a directory then it will notify all files/directories below.
     *
     */
    notifyDeleted = () => {
        return new Promise( (resolve, reject) => {
            if (this.getType() == "folder") {
                // NOTE: This relies on that all children already have been loaded and cached, the old list, before deleting, that is.
                // Since the fresh list obviously will not have the items in it which we want to notify.
                const promises = this.getChildren().map( (child) => {
                    if (child.notifyDeleted) {
                        return child.notifyDeleted();
                    }
                    else {
                        if(this.router.panes) this.router.panes.closeItem(child, null, true);
                    }
                });
                Promise.all(promises).then( resolve );
            }
            else {
                if(this.router.panes) this.router.panes.closeItem(this, null, true);
                resolve();
            }
        });
    };

    /**
     * Default implementation for when a file has been moved.
     * If this is a directory then it will notify all files/directories below.
     *
     */
    notifyMoved = (oldPath) => {
        return new Promise( (resolve, reject) => {
            if (this.getType() == "folder") {
                // NOTE: This relies on that all children already have been loaded and cached, the old list, before moving, that is.
                // Since the fresh list obviously will not have the items in it which we want to notify.
                const promises = this.getChildren().map( (child) => {
                    if (child.notifyMoved) {
                        return child.notifyMoved(oldPath + "/" + child.getFile());
                    }
                });
                Promise.all(promises).then( resolve );
            }
            else {
                resolve();
            }
        });
    };

    _clickNewFile = e => {
        e.preventDefault();

        if (this.getType() == 'folder') {
            const project = this.getProject();
            const file = prompt("Enter the new file's name");

            if (file) {
                if (!file.match('(^[a-zA-Z0-9-_.]+[/]?)$') || file.length > 255) {
                    alert('Illegal file name. Only A-Za-z0-9, dash (-) and underscore (_) allowed. Max 255 characters.');
                    return false;
                }
                project.newFile(this.getFullPath(), file, status => {
                    if (status == 0) {
                        this.getChildren(true, () => {
                            this.redrawMain(true);
                        });
                    } else {
                        status == 3 ? alert('A file or folder with that name already exists at this location. Please choose a different name.', status) : alert('Could not create the file.', status);
                    }
                });
            }
        }
    };

    onImportModalClose = () => {
        this.functions.modal.close();
    };

    _clickImportFile = e => {
        e.preventDefault();

        const modal = (
            <ImportFileModal
                context = {this}
                project = {this.getProject()}
                onCloseClick={this.onImportModalClose}
            />
        );
        this.functions.modal.show({
            cancel: () => {
                return false;
            },
            render: () => {
                return modal;
            }
        });

    };

    _clickNewFolder = e => {
        e.preventDefault();

        if (this.getType() == 'folder') {
            const project = this.getProject();
            const file = prompt("Enter the new folder's name");

            if (file) {
                if (!file.match('(^[a-zA-Z0-9-_.]+)$') || file.length > 255) {
                    alert('Illegal folder name. Only A-Za-z0-9, dash (-) and underscore (_) allowed. Max 255 characters.');
                    return false;
                }

                project.newFolder(this.getFullPath(), file, status => {
                    if (status == 0) {
                        this.getChildren(true, () => {
                            this.redrawMain(true);
                        });
                    } else {
                        status == 3 ? alert('Folder with that name already exists.', status) : alert('Could not create the folder.', status);
                    }
                });
            }
        }
    };

    _clickDeleteFile = e => {
        e.preventDefault();

        if (!confirm('Are you sure to delete ' + this.getFullPath() + '?')) {
            return false;
        }

        this.delete();
    };

    delete = () => {
        return new Promise( (resolve, reject) => {
            // We need to load the file tree below this item (if any) to be able to notify those items about the delete.
            this._loadFileTree().then( () => {
                const project = this.getProject();
                project.deleteFile(this.getFullPath(), (status) => {
                    if (status == 0) {
                        if (this.notifyDeleted) {
                            var promise = this.notifyDeleted();
                        }
                        else {
                            var promise = Promise.resolve();
                            if(this.router.panes) this.router.panes.closeItem(this, null, true);
                        }

                        promise
                            .then( () => {
                                this.props.state.__parent.getChildren(true, () => {
                                    this.redrawMain(true);
                                    resolve();
                                });
                            });
                    }
                    else {
                        alert("Could not delete file/folder.", status);
                        reject();
                    }
                });
            });
        });
    };

    _clickRenameFile = e => {
        e.preventDefault();

        const newFile = prompt('Enter new name.', this.getFullPath());
        if (newFile) {
            // TODO: we should only allow file name change here, not path move. Move we want drag and drop for.
            // but until we have that we allow for giving paths here in the rename function.
            //if (!newFile.match("(^[a-zA-Z0-9-_\.]+)$")) {
            //alert("Illegal filename.");
            //return false;
            //}

            // Check if user is trying to move directory into a subdirectory, an action we can't support.
            const forbiddenPrefix = this.getFullPath() + '/';
            if (newFile.indexOf(forbiddenPrefix) === 0) {
                alert("Error: Could not move directory into its own subdirectory");
                return
            }

            if (newFile == this.getFullPath()) {
                return;
            }
            const suffix1 =
                (this.getFullPath().match('^.*/[^/]+[.](.+)$') || [])[1] ||
                '';
            const suffix2 =
                (newFile.match('^.*/[^/]+[.](.+)$') || [])[1] || '';
            if (
                suffix1.toLowerCase() == 'sol' &&
                suffix1.toLowerCase() != suffix2.toLowerCase()
            ) {
                // NOTE: To allow a .sol to be renamed to a generic file we will need to strip away some
                // stuff from the contractitem. That's why we don't allow it for now.
                alert('When renaming a contract it must retain the .sol suffix.');
                return;
            }
            if(newFile.length > 255) {
                alert("Max 255 characters.");
                return;
            }
            this.mv(newFile)
                .then(() => {
                    this.redrawMain(true);
                })
                .catch(err => {
                    alert('Error: Could not move file.');
                    return;
                });
        }
    };

    // Checks if file is in App folder and is one of the main files needed for View panel
    _isAppFile = () => {
       return (this.props.state.__parent.getFullPath() == '/app' &&
            (
                (this.getTitle() == 'app.css') ||
                (this.getTitle() == 'app.html') ||
                (this.getTitle() == 'app.js')
            )
        );
    }

    _renderFileTitle = (level, index) => {
        if (this.getType() == "file") {
            return (
                <FileEntry
                   isAppFile={this._isAppFile()}
                   openItem={this._openItem}
                   title={this.getTitle()}
                   isReadOnly={this.isReadOnly()}
                   clickRenameFile={this._clickRenameFile}
                   clickDeleteFile={this._clickDeleteFile}
                   icons={this._renderIcons(level, index)}
               />
            );
        } else if (this.getType() == "folder") {
            return (
                <DirectoryEntry
                    angleClicked={this._angleClicked}
                    title={this.getTitle()}
                    isReadOnly={this.isReadOnly()}
                    fullPath={this.getFullPath()}
                    clickNewFile={this._clickNewFile}
                    clickImportFile={this._clickImportFile}
                    clickNewFolder={this._clickNewFolder}
                    clickRenameFile={this._clickRenameFile}
                    clickDeleteFile={this._clickDeleteFile}
                    icons={this._renderIcons(level, index)}
                />
            );
        }
    };

    /** Override **/
    _render2 = (level, index, renderedChildren) => {
        var output;
        if (this.props.render) {
            output = this.props.render(level, index, this);
        }
        else {
            output = this._defaultRender(level, index, this);
        }

        const childrenPkg = this._packageChildren(level, index, renderedChildren);
        const classes = this._getClasses(level, index);
        const key = (level + index).toString();
        return (
            <div
                key={key}
                className={classnames(classes)}
                onClick={this.props.onClick ? (e) => this.props.onClick(e, this) : null}>
                {output}
                {childrenPkg}
            </div>
        );
    };

    // Just gonna put this here for now
    _renderApplicationSectionTitle = (level, index, item) => {
        const icons = item._renderIcons(level, index);

        return (
            <div className={style.projectContractsTitleContainer} onClick={item._angleClicked} onContextMenu={(e)=>{e.preventDefault()}}>
                <div className={style.header}>
                    { icons }
                    <div className={style.title}>
                        <a title={item.getTitle()} href="#">
                            { item.getTitle() }
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    _createChildren = (cb) => {
        if (this.getType() == 'folder') {
            const project = this.getProject();
            const list = project.listFiles(this.getFullPath());
            const children = [];
                list.map(file => {
                    if (file.type == 'd') {
                        var render;
                        if (this.getFullPath() == "/" && file.name == "app") {
                            render = this._renderApplicationSectionTitle;
                        }
                        children.push(
                            new FileItem(
                                {
                                    type: 'folder',
                                    render: render,
                                    state: {
                                        key: file.name,
                                        open: false,
                                        title: file.name,
                                        file: file.name,
                                        __parent: this,
                                        project: this.getProject(),
                                    },
                                    renameFile: this.props.renameFile
                                },
                                this.router,
                                this.functions
                            )
                        );
                    } else if (file.type == 'f') {
                        var fileItem;
                        if (
                            this.getFullPath() == '/' &&
                            file.name == 'dappfile.json'
                        ) {
                            fileItem = this.getProject().getHiddenItem(
                                'dappfile'
                            );
                            fileItem.props.onClick = fileItem._openItem;
                            fileItem.props.state.__parent = this;
                            fileItem.props.state._tag = 0;
                        } else {
                            fileItem = new FileItem(
                                {
                                    type: 'file',
                                    state: {
                                        key: file.name,
                                        title: file.name,
                                        file: file.name,
                                        __parent: this,
                                        project: this.getProject(),
                                        _tag: 0,
                                    },
                                    renameFile: this.props.renameFile
                                },
                                this.router,
                                this.functions
                            );
                            fileItem.props.onClick = fileItem._openItem;
                        }

                        if (fileItem.getType2() == 'contract') {
                            // WOHA! This is a contract, let's get the ContractItem representation of it.
                            var contractItem = this.getProject().getContract(
                                fileItem.getFullPath()
                            );
                            if (contractItem) {
                                // Replace file item with contract item.
                                fileItem = contractItem;
                                fileItem.props.onClick = fileItem._openItem;
                                fileItem.props.state.__parent = this;
                                fileItem.props.state._tag = 0;
                                fileItem.props.state.project = this.getProject();
                                fileItem.props.state.toggable = true;
                            }

                            // Set child items of the contract.
                            const configureItem = new Item(
                                {
                                    type: 'contract',
                                    type2: 'configure',
                                    icon: <IconConfigure />,
                                    state: {
                                        key: 'configure',
                                        title: 'Configure',
                                        __parent: fileItem,
                                        project: this.getProject(),
                                        _tag: 1,
                                    },
                                },
                                this.router
                            );
                            configureItem.props.onClick =
                                configureItem._openItem;

                            const interactItem = new Item(
                                {
                                    type: 'contract',
                                    type2: 'interact',
                                    icon: <IconInteract />,
                                    state: {
                                        key: 'interact',
                                        title: 'Interact',
                                        __parent: fileItem,
                                        project: this.getProject(),
                                        _tag: 2,
                                    },
                                },
                                this.router
                            );
                            interactItem.props.onClick =
                                interactItem._openItem;

                            const compileItem = new Item(
                                {
                                    type: 'contract',
                                    type2: 'compile',
                                    icon: <IconCompile />,
                                    state: {
                                        key: 'compile',
                                        title: 'Compile',
                                        __parent: fileItem,
                                        project: this.getProject(),
                                        _tag: 3,
                                    },
                                },
                                this.router
                            );
                            compileItem.props.onClick =
                                compileItem._openItem;

                            const deployItem = new Item(
                                {
                                    type: 'contract',
                                    type2: 'deploy',
                                    icon: <IconDeploy />,
                                    state: {
                                        key: 'deploy',
                                        title: 'Deploy',
                                        __parent: fileItem,
                                        project: this.getProject(),
                                        _tag: 4,
                                    },
                                },
                                this.router,

                            );
                            deployItem.props.onClick = deployItem._openItem;

                            const contractChildren = [
                                configureItem,
                                compileItem,
                                deployItem,
                                interactItem,
                            ];
                            //fileItem.setChildren(contractChildren);
                            this._copyState(
                                contractChildren,
                                fileItem.props.state.children || []
                            );
                            fileItem.props.state.children = contractChildren;
                        }
                        children.push(fileItem);
                    }
                });
                this._copyState(children, this.props.state._children || []);
                this.props.state._children = children;
                if (cb) cb();
            return;
        } else {
            if (cb) cb();
        }
    };
}
