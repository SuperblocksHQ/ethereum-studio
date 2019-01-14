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

import IpfsAPI from 'ipfs-api';
import Backend from '../components/projecteditor/control/backend';

let ipfs = null;
let backend = null;

const TEMPORARY_PROJECT_ID = 1;

export const ipfsService = {

    init(backendInstance) {
        ipfs = new IpfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
        backend = backendInstance;
    },

    isTemporaryProject(id) {
        return id === TEMPORARY_PROJECT_ID;
    },

    clearTempProject() {
        this._stripIpfsHash();
        backend.deleteProject(1, () => {});
    },

    ipfsFetchFiles(hash, options) {
        return ipfs.files.get(hash);
    },

    ipfsSyncUp(inode, { includeBuildInfo, includeProjectConfig }) {
        return new Promise((resolve, reject) => {
            const data =
                JSON.parse(localStorage.getItem(Backend.DAPP_FORMAT_VERSION)) || {};

            if (!data.projects) data.projects = [];

            var project = data.projects.filter(item2 => {
                return inode == item2.inode;
            })[0];

            if (!project || !project.files) {
                reject();
                return;
            }

            const files = [];
            var node = project.files['/'];
            const fn = (node, path) => {
                return new Promise( (resolve) => {
                    if (path === 'build/' && !includeBuildInfo) {
                        resolve();
                        return;
                    } else if (path === '.super/' && !includeProjectConfig) {
                        resolve();
                        return;
                    }

                    if (node.children) {
                        const childrenKeys = Object.keys(node.children);
                        const fn2 = () => {
                            const childKey = childrenKeys.pop();
                            if (childKey) {
                                const child = node.children[childKey];
                                if (child.type == 'f') {
                                    files.push({
                                            path: path + childKey,
                                            content: ipfs.types.Buffer.from(child.contents),
                                        });

                                    fn2();
                                    return
                                }
                                else {
                                    // Directory
                                    fn(child, path + childKey + '/').then( () => {
                                        fn2();
                                        return;
                                    });
                                }
                            }
                            else {
                                resolve();
                                return;
                            }
                        };

                        fn2();
                    }
                    else {
                        resolve();
                    }
                });
            };

            fn(node, "").then( () => {
                ipfs.files.add(files, {onlyHash: false, wrapWithDirectory: true}).then((res) => {
                    const hash = res.filter( (obj) => {
                        if (obj.path === "") return true;
                    })[0].hash;

                    resolve(hash);
                })
                .catch( (e) => {
                    reject(e);
                });
            })
            .catch( (e) => {
                reject(e);
            });
        });
    },

    _stripIpfsHash() {
        history.pushState({}, '', '/');
    },
};
