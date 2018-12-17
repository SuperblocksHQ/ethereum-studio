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

import FileItem from './fileItem';

export default class ContractItem extends FileItem {
    constructor(props, router) {
        props.type2 = props.type2 || 'contract';
        super(props, router);
    }

    /**
     * Notifies us the contract file has been deleted.
     * Tell the project to delete it from the dappfile.
     *
     */
    notifyDeleted = () => {
        return new Promise( (resolve) => {
            this.getProject().deleteContract(this.getSource(), () => {
                // Close the contract item if open
                if(this.router.panes) this.router.panes.closeItem(this, null, true);

                // Close the child items if open
                this.getChildren().map( (item) => {
                    if(this.router.panes) this.router.panes.closeItem(item, null, true);
                });

                this._deleteContractBuildFiles(this.getSource());
                resolve();
            });
        });
    }

    /**
     * Delete the build directory for this contract source file.
     *
     */
    _deleteContractBuildFiles = (source, cb) => {
        const path = this._calculateBuildDir(source);
        this.getProject().getItemByPath(path.split('/'), this.getProject())
            .then( (item) => {
                item.delete()
                    .then( () => {if (cb) cb(0)});
            })
            .catch( () => {if (cb) cb(0)});
    };

    _moveContractBuildFiles = (oldSource, newSource, cb) => {
        const oldBuildDir = this._calculateBuildDir(oldSource);
        const newBuildDir = this._calculateBuildDir(newSource);

        const newContractName = newSource.match(".*/([^/]+)[.][sS][oO][lL]$")[1];

        const getOldBuildDir = () => {
            return this.getProject().getItemByPath(oldBuildDir.split('/'), this.getProject());
        };

        const getNewBuildDir = () => {
            return this.getProject().getItemByPath(newBuildDir.split('/'), this.getProject());
        };

        const deleteNewBuildDir = () => {
            return new Promise( (resolve) => {
                getNewBuildDir()
                    .then( (item) => {
                        item.delete().then(resolve);
                    })
                    .catch(resolve);
            });
        };

        const copyFiles = (children) => {
            // Copy and rename the files
            return new Promise( (resolve) => {
                const mvs = [];
                children.map( (file) => {
                    var a = file.getFile().match("^(.+)[.](.+)[.](deploy|address|tx|js)$");
                    if (a) {
                        const oldFile = oldBuildDir.concat("/", file.getFile());
                        const newFile = newBuildDir.concat("/", newContractName, ".", a[2], ".", a[3]);
                        mvs.push([oldFile, newFile]);
                    }
                    else {
                        var a = file.getFile().match("^(.+)[.](abi|meta|bin|hash)$");
                        if (a) {
                            const oldFile = oldBuildDir.concat("/", file.getFile());
                            const newFile = newBuildDir.concat("/", newContractName, ".", a[2]);
                            mvs.push([oldFile, newFile]);
                        }
                    }
                });
                const fn = () => {
                    const obj = mvs.pop();
                    if (obj) {
                        this.getProject().getItemByPath(obj[0].split('/'), this.getProject()).then( (fileItem) => {
                            fileItem.mv(obj[1]).then(fn);
                        })
                        .catch( (e) => {
                            console.log('Error: could not move file', obj[0], obj[1]);
                            fn();
                        });
                    }
                    else {
                        resolve();
                        return;
                    }
                    fn();
                };
                fn();
            });
        };

        const deleteOldBuildDir = () => {
            return new Promise( (resolve, reject) => {
                getOldBuildDir()
                    .then( (oldItem) => {
                        oldItem.delete()
                            .then(resolve);
                    });
            });
        };

        getOldBuildDir()
            .then( (oldBuildDirItem) => {
                oldBuildDirItem.getChildren(true, () => {
                    const children = oldBuildDirItem.getChildren();
                    if (children.length > 0) {
                        // Delete the target newBuildDir if it exists
                        deleteNewBuildDir()
                            .then( () => {
                                // Then copy all files to the new builddir.
                                copyFiles(children)
                                    .then(deleteOldBuildDir().
                                        then(cb));
                            });
                    }
                    else {
                        // No files to copy, just delete the build dir.
                        deleteOldBuildDir().then(cb)
                    }
                });
            })
            .catch( () => {
            });
    };

    _calculateBuildDir = (contractSource) => {
        const a = contractSource.match(/^(.*\/)([^/]+)$/);
        const dir=a[1];
        const filename=a[2];
        const a2 = filename.match(/^(.+)[.][Ss][Oo][Ll]$/);
        const contractName = a2[1];
        const path = "/build" + dir + contractName;
        return path;
    };

    /**
     * Notifies us the contract file has been renamed.
     * Tell the project to update the dappfile.
     *
     */
    notifyMoved = (oldPath, cb) => {
        return new Promise( (resolve) => {
            this.props.state.source = this.getFullPath();  // We need to keep the items source up to date with the actual file path.
            this.getProject().moveContract(oldPath, this.getFullPath(), resolve);
            this._moveContractBuildFiles(oldPath, this.getSource());
        });
    };

    /**
     * Return the source path for the contract file, as defined in the dappfile.
     */
    getSource = () => {
        return this.props.state.source;
    };

    /**
     * Return the arguments for this contract.
     */
    getArgs = () => {
        return this.props.state.args;
    };

    /**
     * Set the arguments for the contract.
     */
    setArgs = args => {
        this.props.state.args = args;
    };

    /**
     * Set this items key values to a new key.
     *
     */
    reKey = (newkey, newFullPath) => {
        this.props.state.source = newFullPath;
        this.props.state.key = newkey;
    };
}
