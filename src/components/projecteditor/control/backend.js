// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Studio.
//
// Superblocks Studio is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Studio is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Studio.  If not, see <http://www.gnu.org/licenses/>.

const DAPP_FORMAT_VERSION = "dapps2.0";
export default class Backend {
    constructor() {
    }

    // Make sure projects created for an older version are converted to the current format.
    convertProjects = (cb) => {
        if(!localStorage.getItem(DAPP_FORMAT_VERSION)) {
            if(localStorage.getItem("dapps1.0")) {
                // Convert from 1.0 to 2.0
                const data=JSON.parse(localStorage.getItem("dapps1.0"));
                const newProjects=[];
                for(let i=0; i<data.projects.length; i++) {
                    const project=data.projects[i];
                    const newProject=this._convertProject1_0to2_0(project);
                    if(newProject) {
                        newProjects.push(newProject);
                    }
                    else {
                        alert("A project could not be converted into the new format.");
                    }
                }
                // store projects.
                const newData={projects:newProjects};
                localStorage.setItem(DAPP_FORMAT_VERSION, JSON.stringify(newData));
                cb(1);  // Indicate that there are converted projects.
            }
        }
        else {
            // Already converted.
            cb(0);
        }
    };

    _convertProject1_0to2_0 = (project) => {
        const environments = [
            {
                "name": "browser"
            },
            {
                "name": "custom"
            },
            {
                "name": "rinkeby"
            },
            {
                "name": "ropsten"
            },
            {
                "name": "kovan"
            },
            {
                "name": "infuranet"
            },
            {
                "name": "mainnet"
            }
        ];
        const wallets = [
            {
                "desc": "This is a wallet for local development",
                "name": "development",
                "blockchain": "ethereum"
            },
            {
                "desc": "A private wallet",
                "name": "private",
                "blockchain": "ethereum"
            },
            {
                "desc": "External wallet integrating with Metamask and other compatible wallets",
                "name": "external",
                "blockchain": "ethereum",
                "type": "external"
            }
        ];
        const accounts = [
            {
                "name": "Default",
                "blockchain": "ethereum",
                "_environments": [
                    {
                        "name": "browser",
                        "data": {
                            "wallet": "development",
                            "index": 0,
                        }
                    },
                    {
                        "name": "custom",
                        "data": {
                            "wallet": "private",
                            "index": 0,
                        }
                    },
                    {
                        "name": "rinkeby",
                        "data": {
                            "wallet": "external",
                            "index": 0,
                        }
                    },
                    {
                        "name": "ropsten",
                        "data": {
                            "wallet": "external",
                            "index": 0,
                        }
                    },
                    {
                        "name": "kovan",
                        "data": {
                            "wallet": "external",
                            "index": 0,
                        }
                    },
                    {
                        "name": "infuranet",
                        "data": {
                            "wallet": "external",
                            "index": 0,
                        }
                    },
                    {
                        "name": "mainnet",
                        "data": {
                            "wallet": "external",
                            "index": 0,
                        }
                    },
                ],
            },
        ];
        const files = project.files;
        const contracts = project.dappfile.contracts.map((contract) => {
            return {
                source: contract.source,
                args: contract.args,
                blockchain: "ethereum",
                name: contract.name,
            };
        });

        const newProject = {
            dir: project.dir,
            inode: project.inode,
            files: files,
            dappfile: {
                environments: environments,
                wallets: wallets,
                accounts: accounts,
                contracts: contracts,
                project: project.dappfile.project,
            }
        };

        return newProject;
    };

    newFile = (name, path, file, cb) => {
        const data=JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};
        if(!data.projects) data.projects=[];
        var project=data.projects.filter((item)=>{
            return item.dir==name;
        })[0];
        if(!project) {
            setTimeout(()=>cb(3),1);
            return;
        }
        if(path[0] != '/') {
            setTimeout(()=>cb(3),1);
            return;
        }
        if(!project.files) project.files={"/":{type:"d",children:{}}};
        const parts=path.split("/");
        var folder=project.files["/"];
        for(var index=1;index<parts.length-1;index++) {
            var folder2=folder.children[parts[index]];
            if(!folder2) {
                folder2={type:"d",name:parts[index],children:{}};
                folder[parts[index]]=folder2;
            }
            folder=folder2;
        }
        var type="f";
        if(file[file.length-1]=='/') {
            type="d";
            file=file.substring(0,file.length-1);
        }
        if(folder.children[file]) {
            setTimeout(()=>cb(3),1);
            return;
        }
        folder.children[file]={type:type,children:(type=="d"?{}:null)};
        localStorage.setItem(DAPP_FORMAT_VERSION, JSON.stringify(data));
        setTimeout(()=>cb(0),1);
    };

    renameFile = (name, path, file, cb) => {
        const data=JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};
        if(!data.projects) data.projects=[];
        var project=data.projects.filter((item)=>{
            return item.dir==name;
        })[0];
        if(!project) {
            setTimeout(()=>cb(3),1);
            return;
        }
        if(path[path.length-1]=="/") path=path.substring(0, path.length-1);
        if(path[0] != '/') {
            setTimeout(()=>cb(3),1);
            return;
        }
        if(!project.files) project.files={"/":{type:"d",children:{}}};
        const parts=path.split("/");
        var folder=project.files["/"];
        for(var index=1;index<parts.length-1;index++) {
            var folder2=folder.children[parts[index]];
            if(!folder2) {
                setTimeout(()=>cb(4),1);
                return;
            }
            folder=folder2;
        }
        if(folder.children[file]) {
            setTimeout(()=>cb(3),1);
            return;
        }
        const o=folder.children[parts[parts.length-1]];
        if(!o) {
            setTimeout(()=>cb(4),1);
            return;
        }
        delete folder.children[parts[parts.length-1]];
        folder.children[file]=o;
        localStorage.setItem(DAPP_FORMAT_VERSION, JSON.stringify(data));
        setTimeout(()=>cb(0),1);
    };

    deleteFile = (name, path, cb) => {
        const data=JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};
        if(!data.projects) data.projects=[];
        var project=data.projects.filter((item)=>{
            return item.dir==name;
        })[0];
        if(!project) {
            if(cb) setTimeout(()=>cb(3),1);
            return;
        }
        if(path[path.length-1]=="/") path=path.substring(0, path.length-1);
        if(path[0] != '/') {
            if(cb) setTimeout(()=>cb(3),1);
            return;
        }
        if(!project.files) project.files={"/":{type:"d",children:{}}};
        const parts=path.split("/");
        var folder=project.files["/"];
        for(var index=1;index<parts.length-1;index++) {
            var folder2=folder.children[parts[index]];
            if(!folder2) {
                folder2={type:"d",name:parts[index],children:{}};
                folder[parts[index]]=folder2;
            }
            folder=folder2;
        }
        delete folder.children[parts[parts.length-1]];
        localStorage.setItem(DAPP_FORMAT_VERSION, JSON.stringify(data));
        if(cb) setTimeout(()=>cb(0),1);
    };

    listFiles = (name, path, cb) => {
        const data=JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};
        if(!data.projects) data.projects=[];
        var project=data.projects.filter((item)=>{
            return item.dir==name;
        })[0];
        if(!project) {
            setTimeout(()=>cb(1),1);
            return;
        }
        if(!project.files) project.files={"/":{type:"d",children:{}}};
        const parts=path.split("/");
        var folder=project.files["/"];
        for(var index=1;index<parts.length-1;index++) {
            var folder2=folder.children[parts[index]];
            if(!folder2) {
                folder2={type:"d",name:parts[index],children:{}};
                folder[parts[index]]=folder2;
            }
            folder=folder2;
        }
        const files=[];
        const dirs=[];
        const keys=Object.keys(folder.children);
        for(var index=0;index<keys.length;index++) {
            const key=keys[index];
            const file=folder.children[key];
            if(file.type=="f") files.push({name:key, type:file.type});
            if(file.type=="d") dirs.push({name:key, type:file.type});

        }
        setTimeout(()=>cb(0,dirs.concat(files)),1);
    };

    loadProject = (dir, cb) => {
        const data=JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};
        for(var index=0;index<data.projects.length;index++) {
            if(data.projects[index].dir==dir) {
                setTimeout(()=>cb(0, data.projects[index]),1);
                return;
            }
        }
        setTimeout(()=>{cb(1)},1);
    }

    deleteProject = (name, cb) => {
        const data=JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};
        if(!data.projects) data.projects=[];
        var projects=data.projects.filter((item)=>{
            return item.dir!=name;
        });
        data.projects=projects;
        localStorage.setItem(DAPP_FORMAT_VERSION, JSON.stringify(data));
        cb();
    }

    loadProjects = (cb) => {
        const data=JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};
        setTimeout(()=>cb(0, data.projects || []),1);
    }

    saveProject = (name, payload, cb, isNew, files) => {
        const data=JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};
        if(!data.projects) data.projects=[];
        var project=data.projects.filter((item)=>{
            return item.dir==name;
        })[0];
        if(isNew && project) {
            setTimeout(()=>cb({status:1,code:1}),1);
            return;
        }
        if(!project) {
            project={
                dir: name,
                inode: Math.floor(Math.random()*10000000),
                files:files
            };
            data.projects.push(project);
        }
        project.dappfile=payload.dappfile;
        localStorage.setItem(DAPP_FORMAT_VERSION, JSON.stringify(data));
        setTimeout(()=>cb({status:0,code:0}),1);
    };

    saveFile = (name, payload, cb) => {
        const data=JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};
        if(!data.projects) data.projects=[];
        var project=data.projects.filter((item)=>{
            return item.dir==name;
        })[0];
        if(!project) {
            setTimeout(()=>cb({status:3}),1);
            return;
        }
        const path=payload.path;
        if(path[0] != '/') {
            setTimeout(()=>cb({status:3}),1);
            return;
        }
        if(!project.files) project.files={"/":{type:"d",children:{}}};
        const parts=path.split("/");
        var folder=project.files["/"];
        for(var index=1;index<parts.length-1;index++) {
            var folder2=folder.children[parts[index]];
            if(!folder2) {
                folder2={type:"d",children:{}};
                folder.children[parts[index]]=folder2;
            }
            folder=folder2;
        }
        folder.children[parts[parts.length-1]]= {type:"f",contents:payload.contents};
        localStorage.setItem(DAPP_FORMAT_VERSION, JSON.stringify(data));
        setTimeout(()=>cb({status:0, hash:""}),1);
    };

    loadFile = (name, path, cb) => {
        const data=JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};
        if(!data.projects) data.projects=[];
        var project=data.projects.filter((item)=>{
            return item.dir==name;
        })[0];
        if(!project) {
            setTimeout(()=>cb({status:3}),1);
            return;
        }
        if(path[0] != '/') {
            setTimeout(()=>cb({status:3}),1);
            return;
        }
        if(!project.files) project.files={"/":{type:"d",children:{}}};
        const parts=path.split("/");
        var folder=project.files["/"];
        for(var index=1;index<parts.length-1;index++) {
            var folder2=folder.children[parts[index]];
            if(!folder2) {
                folder2={type:"d",name:parts[index],children:{}};
                folder[parts[index]]=folder2;
            }
            folder=folder2;
        }
        const file = folder.children[parts[parts.length-1]];
        if(file) setTimeout(()=>cb({status:0, contents:file.contents || "", hash:""}),1);
        else setTimeout(()=>cb({status:1, contents:"", hash:""}),1);
    };

    downloadWorkspace = () => {
        const exportName = 'superblocks_workspace.json';
        const workspace=JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};
        var exportObj = workspace;
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    downloadProject = (projectName) => {
        const exportName = "superblocks_project_" + projectName;
        const workspace = JSON.parse(localStorage.getItem(DAPP_FORMAT_VERSION)) || {};
        var project = workspace.projects.filter((item) => {
            return item.dir==projectName;
        })[0];

        // Return on empty project
        if(Object.keys(project).length <= 0) {
            console.warn("Unable to locate project: " + projectName);
            return;
        }

        var exportObj = project;
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    uploadWorkspace = (file, cb) => {
        var reader = new FileReader();

        reader.onloadend = (evt) => {
          if (evt.target.readyState == FileReader.DONE) {
            try {
              const obj = JSON.parse(evt.target.result);
              if (!obj.projects) {
                cb('invalid workspace file');
                return;
              }
            } catch (e) {
              cb('invalid JSON');
              return;
            }
            localStorage.setItem(DAPP_FORMAT_VERSION,evt.target.result)
            cb()
          }
        };

        var blob = file.slice(0, file.size);
        reader.readAsBinaryString(blob);
    }

    uploadProject = (project, file, handler, cb) => {
        var reader = new FileReader();

        reader.onloadend = (evt) => {
            var dappfileJSONObj;
            if (evt.target.readyState == FileReader.DONE) {
                try {
                    const obj = JSON.parse(evt.target.result);
                    if (!obj.dir) {
                        cb('invalid project file');
                        return;
                    }
                    dappfileJSONObj = obj;
                } catch (e) {
                    cb('invalid JSON');
                    return;
                }
                this.saveProject(project, {dappfile:dappfileJSONObj.dappfile}, (o)=>{handler(o.status,o.code)}, true, dappfileJSONObj.files)
                cb();
            }
        };

        var blob = file.slice(0, file.size);
        reader.readAsBinaryString(blob);
    }
}
