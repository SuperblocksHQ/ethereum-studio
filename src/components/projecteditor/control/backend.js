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

const JSZip = require("jszip");
const FileSaver = require('file-saver');

const DAPP_FORMAT_VERSION = 'dapps1.1.0';
export default class Backend {
    constructor() {}

    // Make sure projects created for an older version are converted to the current format.
    // dapps1.0 is the 1.0 BETA which is deprecated.
    // dapps1.0.0 is the released 1.0 format and will be converted into 1.1.0.
    convertProjects = cb => {
        if (!localStorage.getItem(DAPP_FORMAT_VERSION)) {
            if (localStorage.getItem('dapps1.0.0')) {
                // Convert from 1.0 (beta) to 1.0.0.
                const data = JSON.parse(localStorage.getItem('dapps1.0.0'));
                const newProjects = [];
                for (let i = 0; i < data.projects.length; i++) {
                    const project = data.projects[i];
                    var newProject = null;
                    try {
                        newProject = this._convertProject1_0_0to1_1_0(project);
                    } catch (e) {
                        console.error(e, newProject);
                    }
                    if (newProject) {
                        newProjects.push(newProject);
                    } else {
                        alert(
                            'A project could not be converted into the new format.'
                        );
                    }
                }
                // store projects.
                const newData = { projects: newProjects };
                localStorage.setItem(
                    DAPP_FORMAT_VERSION,
                    JSON.stringify(newData)
                );
                cb(1); // Indicate that there are converted projects.
            } else {
                // Nothing to convert
                cb(0);
            }
        } else {
            // Already converted.
            cb(0);
        }
    };

    // Check single project and convert it if needed.
    // isConverted = 1 means converted and no info lost, 2 means converted and info is lost, -1 means error, 0 means not converted.
    convertProject = (project, cb) => {
        var isConverted = 0;
        try {
            if (project.files && !project.dappfile) {
                // Assume this is the 1.1.0 format.
                // Fall through.
            }
            else {
                // These are the old JSON formats.
                if (!project.format) {
                    project = this._convertProject1_0to1_0_0(project);
                    isConverted = 2;
                }

                if (project.format == 'dapps1.0.0') {
                    project = this._convertProject1_0_0to1_1_0(project);
                    isConverted++;
                }
            }
        } catch (e) {
            console.log('Could not convert project', e);
            cb(-1);
            return;
        }

        cb(isConverted, project);
    };

    /**
     * This takes the dappfile object and turns it into a file: `/dappfile.json`
     * It only transforms and keeps things we recognize.
     *
     */
    _convertProject1_0_0to1_1_0 = project => {
        const files = project.files;
        const dappfile = project.dappfile;

        const wallets = dappfile.wallets.map(wallet => {
            return {
                name: wallet.name,
                desc: wallet.desc,
                type: wallet.type,
            };
        });

        const contracts = dappfile.contracts.map(contract => {
            // Go through args to see if there are any contract names, if so switch to contract source.
            const args = contract.args || [];
            const args2 = args.map(arg => {
                if (arg.contract) {
                    const targetContract = dappfile.contracts.filter(c => {
                        return c.name == arg.contract;
                    })[0];
                    arg.contract = targetContract.source;
                }
                return arg;
            });
            return {
                name: contract.name,
                source: contract.source,
                args: args2,
            };
        });

        const accounts = dappfile.accounts.map(account => {
            return {
                name: account.name,
                _environments: account._environments,
            };
        });

        const dappfile2 = {
            format: DAPP_FORMAT_VERSION.substr(5),  // IMPORTANT: if the format of this variable changes this must be updated. We only want the "x.y.z" part.
            project: dappfile.project,
            environments: dappfile.environments,
            wallets: wallets,
            contracts: contracts,
            accounts: accounts,
        };

        files['/'].children['dappfile.json'] = {
            type: 'f',
            contents: JSON.stringify(dappfile2),
        };
        const build = files['/'].children['build'] || {
            children: {},
            type: 'd',
        };
        files['/'].children['build'] = build;
        const contractsDir = build.children['contracts'] || {
            children: {},
            type: 'd',
        };
        build.children['contracts'] = contractsDir;

        // Move .dotfiles to their new locations.
        // Go through all .dotfiles below `/contracts`, do some regex to figure stuff out
        // and then move them to new locations.
        const createFile = (subdir, file, contents) => {
            // Create a file below `/build`.
            const dir = contractsDir.children[subdir] || {
                children: {},
                type: 'd',
            };
            contractsDir.children[subdir] = dir;
            dir.children[file] = { type: 'f', contents: contents };
        };
        const children = files['/'].children['contracts'].children;
        do {
            var ready = true;
            const keys = Object.keys(children);
            for (let index = 0; index < keys.length; index++) {
                const name = keys[index];
                const file = children[name];
                if (file['type'] != 'f') {
                    continue;
                }
                var a = name.match(
                    '^[.](.+)[.][Ss][Oo][Ll][.]([^.]+)([.]?.*)[.](deploy|address|tx)$'
                );
                if (a) {
                    const contractName = a[1];
                    const networkName = a[2];
                    const type = a[4];
                    createFile(
                        contractName,
                        contractName + '.' + networkName + '.' + type,
                        file.contents
                    );
                    delete children[name];
                    ready = false;
                    break;
                }
                var a = name.match(
                    '^[.](.+)[.][Ss][Oo][Ll][.]([^.]+)([.]?.*)[.](abi|meta|bin|hash)$'
                );
                if (a) {
                    const contractName = a[1];
                    const networkName = a[2];
                    const type = a[4];
                    createFile(
                        contractName,
                        contractName + '.' + type,
                        file.contents
                    );
                    delete children[name];
                    ready = false;
                    break;
                }
            }
        } while (!ready);

        // Move .js files.
        var childrenJs;
        var ready = false;
        try {
            childrenJs =
                files['/'].children['app'].children['contracts'].children;
            delete files['/'].children['app'].children['contracts'];
        } catch (e) {
            ready = true;
        }
        while (!ready) {
            ready = true;
            const keys = Object.keys(childrenJs);
            for (let index = 0; index < keys.length; index++) {
                const name = keys[index];
                const file = childrenJs[name];
                if (file['type'] != 'f') {
                    continue;
                }
                var a = name.match('^[.](.+)[.]([^.]+)[.](js)$');
                if (a) {
                    const contractName = a[1];
                    const networkName = a[2];
                    const type = a[3];
                    createFile(
                        contractName,
                        contractName + '.' + networkName + '.' + type,
                        file.contents
                    );
                    delete childrenJs[name];
                    ready = false;
                    break;
                }
            }
        }

        const newProject = {
            inode: project.inode,
            files: files,
        };

        return newProject;
    };

    _convertProject1_0to1_0_0 = project => {
        const environments = [
            {
                name: 'browser',
            },
            {
                name: 'custom',
            },
            {
                name: 'rinkeby',
            },
            {
                name: 'ropsten',
            },
            {
                name: 'kovan',
            },
            {
                name: 'infuranet',
            },
            {
                name: 'mainnet',
            },
        ];
        const wallets = [
            {
                desc: 'This is a wallet for local development',
                name: 'development',
                blockchain: 'ethereum',
            },
            {
                desc: 'A private wallet',
                name: 'private',
                blockchain: 'ethereum',
            },
            {
                desc:
                    'External wallet integrating with Metamask and other compatible wallets',
                name: 'external',
                blockchain: 'ethereum',
                type: 'external',
            },
        ];
        const accounts = [
            {
                name: 'Default',
                blockchain: 'ethereum',
                _environments: [
                    {
                        name: 'browser',
                        data: {
                            wallet: 'development',
                            index: 0,
                        },
                    },
                    {
                        name: 'custom',
                        data: {
                            wallet: 'private',
                            index: 0,
                        },
                    },
                    {
                        name: 'rinkeby',
                        data: {
                            wallet: 'external',
                            index: 0,
                        },
                    },
                    {
                        name: 'ropsten',
                        data: {
                            wallet: 'external',
                            index: 0,
                        },
                    },
                    {
                        name: 'kovan',
                        data: {
                            wallet: 'external',
                            index: 0,
                        },
                    },
                    {
                        name: 'infuranet',
                        data: {
                            wallet: 'external',
                            index: 0,
                        },
                    },
                    {
                        name: 'mainnet',
                        data: {
                            wallet: 'external',
                            index: 0,
                        },
                    },
                ],
            },
        ];
        const files = project.files;
        const contracts = project.dappfile.contracts.map(contract => {
            return {
                source: contract.source,
                args: contract.args,
                blockchain: 'ethereum',
                name: contract.name,
            };
        });

        const newProject = {
            format: 'dapps1.0.0',
            dir: project.dir,
            inode: project.inode,
            files: files,
            dappfile: {
                environments: environments,
                wallets: wallets,
                accounts: accounts,
                contracts: contracts,
                project: project.dappfile.project,
            },
        };

        return newProject;
    };

    /**
     * Create a new file for a project.
     *
     */
    newFile = (inode, path, file, cb) => {
        const data =
            JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};

        if (!data.projects) data.projects = [];

        var project = data.projects.filter(item => {
            return item.inode == inode;
        })[0];

        if (!project) {
            setTimeout(() => cb(3), 1);
            return;
        }

        if (path[path.length - 1] != '/') {
            path = path + '/';
        }

        if (path[0] != '/') {
            setTimeout(() => cb(3), 1);
            return;
        }
        if (!project.files)
            project.files = { '/': { type: 'd', children: {} } };
        const parts = path.split('/');
        var folder = project.files['/'];
        for (var index = 1; index < parts.length - 1; index++) {
            var folder2 = folder.children[parts[index]];
            if (!folder2) {
                folder2 = { type: 'd', name: parts[index], children: {} };
                folder.children[parts[index]] = folder2;
            }
            folder = folder2;
        }
        var type = 'f';
        if (file[file.length - 1] == '/') {
            type = 'd';
            file = file.substring(0, file.length - 1);
        }
        if (folder.children[file]) {
            setTimeout(() => cb(3), 1);
            return;
        }
        folder.children[file] = {
            type: type,
            children: type == 'd' ? {} : null,
        };
        localStorage.setItem(DAPP_FORMAT_VERSION, JSON.stringify(data));
        setTimeout(() => cb(0), 1);
    };

    /**
     * Create a new folder for a project.
     *
     */
    newFolder = (inode, path, file, cb) => {
        // NOTE: Appending a "/" at the end of the name to make sure it is treated as a folder (backend.js requirement)
        const formattedFileName = file.concat('/');

        this.newFile(inode, path, formattedFileName, cb);
    };

    /**
     * Move a file/folder within a project.
     *
     */
    moveFile = (inode, pathA, pathB, cb) => {
        if (pathA[pathA.length - 1] == '/') {
            pathA = pathA.substr(0, pathA.length - 1);
        }
        if (pathB[pathB.length - 1] == '/') {
            pathB = pathB.substr(0, pathB.length - 1);
        }
        const a = pathA.match('^(.*)/([^/]+)$');
        const b = pathB.match('^(.*)/([^/]+)$');

        if (!a || !b) {
            setTimeout(() => cb(2), 1);
            return;
        }

        var partsA = a[1];
        if (partsA[0] == '/') {
            partsA = partsA.substr(1);
        }

        var partsB = b[1];
        if (partsB[0] == '/') {
            partsB = partsB.substr(1);
        }

        const data =
            JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};

        if (!data.projects) data.projects = [];

        var project = data.projects.filter(item => {
            return item.inode == inode;
        })[0];

        if (!project) {
            setTimeout(() => cb(3), 1);
            return;
        }

        if (!project.files)
            project.files = { '/': { type: 'd', children: {} } };

        // Find the source folder
        var parts = partsA.split('/');
        if (parts.length == 1 && parts[0] == '') {
            parts = [];
        }
        var sourceFolder = project.files['/'];
        for (let index = 0; index < parts.length; index++) {
            let folder2 = sourceFolder.children[parts[index]];
            if (!folder2) {
                setTimeout(() => cb(4), 1);
                return;
            }
            sourceFolder = folder2;
        }

        if (!sourceFolder.children[a[2]]) {
            setTimeout(() => cb(5), 1);
            return;
        }

        // Find the target folder
        var parts = partsB.split('/');
        if (parts.length == 1 && parts[0] == '') {
            parts = [];
        }
        var targetFolder = project.files['/'];
        for (let index = 0; index < parts.length; index++) {
            let folder2 = targetFolder.children[parts[index]];
            if (!folder2) {
                folder2 = { type: 'd', name: parts[index], children: {} };
                targetFolder.children[parts[index]] = folder2;
            }
            targetFolder = folder2;
        }

        try {
            if (targetFolder.children[b[2]]) {
                setTimeout(() => cb(6), 1);
                return;
            }

            const o = sourceFolder.children[a[2]];
            o.name = b[2];

            delete sourceFolder.children[a[2]];

            targetFolder.children[b[2]] = o;

            localStorage.setItem(DAPP_FORMAT_VERSION, JSON.stringify(data));
            setTimeout(() => cb(0), 1);
        } catch(e) {
            setTimeout(() => cb(6), 1);
            return;
        }
    };

    /**
     * Delete a file in a project.
     *
     */
    deleteFile = (inode, path, cb) => {
        const data =
            JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};

        if (!data.projects) data.projects = [];

        var project = data.projects.filter(item => {
            return item.inode == inode;
        })[0];

        if (!project) {
            if (cb) setTimeout(() => cb(3), 1);
            return;
        }
        if (path[path.length - 1] == '/')
            path = path.substring(0, path.length - 1);
        if (path[0] != '/') {
            if (cb) setTimeout(() => cb(3), 1);
            return;
        }
        if (!project.files)
            project.files = { '/': { type: 'd', children: {} } };
        const parts = path.split('/');
        var folder = project.files['/'];
        for (var index = 1; index < parts.length - 1; index++) {
            var folder2 = folder.children[parts[index]];
            if (!folder2) {
                folder2 = { type: 'd', name: parts[index], children: {} };
                folder[parts[index]] = folder2;
            }
            folder = folder2;
        }
        delete folder.children[parts[parts.length - 1]];
        localStorage.setItem(DAPP_FORMAT_VERSION, JSON.stringify(data));
        if (cb) setTimeout(() => cb(0), 1);
    };

    /**
     * List files below a path at one level within a project.
     *
     */
    listFiles = (inode, path, cb) => {
        const data =
            JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};

        if (!data.projects) data.projects = [];

        var project = data.projects.filter(item => {
            return item.inode == inode;
        })[0];

        if (!project) {
            setTimeout(() => cb(1), 1);
            return;
        }

        if (path[path.length - 1] != '/') {
            path = path + '/';
        }
        if (path[0] == '/') {
            path = path.substr(1);
        }
        if (!project.files)
            project.files = { '/': { type: 'd', children: {} } };
        const parts = path.split('/');
        var folder = project.files['/'];
        for (var index = 0; index < parts.length - 1; index++) {
            var folder2 = folder.children[parts[index]];
            if (!folder2) {
                setTimeout(() => cb(2), 1);
                return;
            }
            folder = folder2;
        }
        const files = [];
        const dirs = [];
        const keys = Object.keys(folder.children);
        for (var index = 0; index < keys.length; index++) {
            const key = keys[index];
            const file = folder.children[key];
            if (file.type == 'f') files.push({ name: key, type: file.type });
            if (file.type == 'd') dirs.push({ name: key, type: file.type });
        }
        setTimeout(() => cb(0, dirs.concat(files)), 1);
    };

    /**
     * Delete a project by its inode.
     *
     */
    deleteProject = (inode, cb) => {
        const data =
            JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};
        if (!data.projects) data.projects = [];

        const projects = data.projects.filter(item => {
            return item.inode != inode;
        });

        data.projects = projects;
        localStorage.setItem(DAPP_FORMAT_VERSION, JSON.stringify(data));
        cb();
    };

    /**
     * Load the light versions of all projects.
     *
     */
    loadProjects = cb => {
        const data =
            JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};
        const projects = [];
        (data.projects || []).map(project => {
            // We need to parse the `/dappfile.json`
            var name, title;
            try {
                const dappfile = JSON.parse(
                    project.files['/'].children['dappfile.json'].contents
                );
                title = dappfile.project.info.title;
                name = dappfile.project.info.name;
            } catch (e) {}
            projects.push({
                inode: project.inode,
                name: name || '<unknown>',
                title: title || '<unknown>',
            });
        });
        setTimeout(() => cb(0, projects), 1);
    };

    createProject = (files, cb) => {
        const data =
            JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};

        if (!data.projects) data.projects = [];

        const inode = Math.floor(Math.random() * 10000000);
        // TODO: check if project with this inode already exists.
        const project = {
            inode: inode,
            files: files,
        };
        data.projects.push(project);
        try {
            localStorage.setItem(DAPP_FORMAT_VERSION, JSON.stringify(data));
        }
        catch(e) {
            alert("Error: The browser local storage exceeded it's quota. Please delete some projects to make room for new ones.");
            setTimeout(() => cb(1), 1);
            return;
        }
        setTimeout(() => cb(0), 1);
    };

    /**
     * Save the contents of a file within a project.
     *
     */
    saveFile = (inode, payload, cb) => {
        const data =
            JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};

        if (!data.projects) data.projects = [];

        var project = data.projects.filter(item => {
            return item.inode == inode;
        })[0];

        if (!project) {
            setTimeout(() => cb({ status: 3 }), 1);
            return;
        }
        const path = payload.path;
        if (path[0] != '/') {
            setTimeout(() => cb({ status: 3 }), 1);
            return;
        }
        if (!project.files)
            project.files = { '/': { type: 'd', children: {} } };
        const parts = path.split('/');
        var folder = project.files['/'];
        for (var index = 1; index < parts.length - 1; index++) {
            var folder2 = folder.children[parts[index]];
            if (!folder2) {
                folder2 = { type: 'd', children: {} };
                folder.children[parts[index]] = folder2;
            }
            folder = folder2;
        }
        folder.children[parts[parts.length - 1]] = {
            type: 'f',
            contents: payload.contents,
        };
        try {
            localStorage.setItem(DAPP_FORMAT_VERSION, JSON.stringify(data));
        } catch (e) {
            console.error(e);
            setTimeout(() => cb({ status: 1 }), 1);
            return;
        }
        setTimeout(() => cb({ status: 0 }), 1);
    };

    /**
     * Load the contents of a file within a project.
     *
     */
    loadFile = (inode, path, cb) => {
        const data =
            JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};

        if (!data.projects) data.projects = [];

        var project = data.projects.filter(item => {
            return item.inode == inode;
        })[0];

        if (!project) {
            setTimeout(() => cb({ status: 3 }), 1);
            return;
        }

        if (path[0] != '/') {
            setTimeout(() => cb({ status: 3 }), 1);
            return;
        }
        if (!project.files)
            project.files = { '/': { type: 'd', children: {} } };
        const parts = path.split('/');
        var folder = project.files['/'];
        for (var index = 1; index < parts.length - 1; index++) {
            var folder2 = folder.children[parts[index]];
            if (!folder2) {
                folder2 = { type: 'd', name: parts[index], children: {} };
                folder[parts[index]] = folder2;
            }
            folder = folder2;
        }
        const file = folder.children[parts[parts.length - 1]];
        if (file)
            setTimeout(
                () => cb({ status: 0, contents: file.contents || '' }),
                1
            );
        else setTimeout(() => cb({ status: 1 }), 1);
    };

    downloadProject = (item, keepState) => {
        const exportName = 'superblocks_project_' + item.getName() + '.zip';

        const zip = new JSZip();

        const data =
            JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};

        if (!data.projects) data.projects = [];

        var project = data.projects.filter(item2 => {
            return item.getInode() == item2.inode;
        })[0];

        if (!project) {
            setTimeout(() => cb({ status: 3 }), 1);
            return;
        }

        if (!project.files)
            project.files = { '/': { type: 'd', children: {} } };

        var node = project.files['/'];

        const fn = (node, path) => {
            return new Promise( (resolve) => {
                if (path == "build/" && !keepState) {
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
                                zip.file(path + childKey, child.contents);
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
            zip.generateAsync({type: "blob"})
                .then( (blob) => {
                    FileSaver.saveAs(blob, exportName);
            });
        });
    };

    unZip = (data) => {
        return new Promise( (resolve, reject) => {
            const zip = new JSZip();
            zip.loadAsync(data).then( () => {
                // Create a files object containing all files in the project object.
                const files = {
                    '/': {
                        children: {}
                    },
                };
                const project = {
                    files: files,
                };
                const createFile = (path, contents) => {
                    const a = path.split('/');
                    var node = files['/'];

                    while (a.length > 0) {
                        const nodeName = a.shift();
                        if (a.length > 0) {
                            // Dir
                            if (!node.children[nodeName]) {
                                // Create dir
                                node.children[nodeName] = {
                                    type: 'd',
                                    children: {},
                                };
                            }
                            node = node.children[nodeName];
                        }
                        else {
                            // The file
                            node.children[nodeName] = {
                                type: 'f',
                                contents: contents,
                            };
                        }
                    }
                };

                const keys = Object.keys(zip.files);
                const fn = () => {
                    return new Promise( resolve => {
                        const key = keys.pop();
                        if (!key) {
                            resolve();
                            return;
                        }
                        const node = zip.files[key];
                        if (!node.dir) {
                            // Create file
                            node.async('string').then( content => {
                                createFile(key, content);
                                fn().then(resolve);
                            });
                        }
                        else {
                            fn().then(resolve);
                        }
                    });
                };

                fn().then( () => {
                    resolve(project);
                });
            })
            .catch( (e) => {
                reject();
            });
        });
    }
}
