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

export default class Backend {
    constructor() {
    }

    newFile = (name, path, file, cb) => {
        const data=JSON.parse(localStorage.getItem("dapps1.0")) || {};
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
        localStorage.setItem("dapps1.0", JSON.stringify(data));
        setTimeout(()=>cb(0),1);
    };

    renameFile = (name, path, file, cb) => {
        const data=JSON.parse(localStorage.getItem("dapps1.0")) || {};
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
        localStorage.setItem("dapps1.0", JSON.stringify(data));
        setTimeout(()=>cb(0),1);
    };

    deleteFile = (name, path, cb) => {
        const data=JSON.parse(localStorage.getItem("dapps1.0")) || {};
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
        localStorage.setItem("dapps1.0", JSON.stringify(data));
        if(cb) setTimeout(()=>cb(0),1);
    };

    listFiles = (name, path, cb) => {
        const data=JSON.parse(localStorage.getItem("dapps1.0")) || {};
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
        const data=JSON.parse(localStorage.getItem("dapps1.0")) || {};
        for(var index=0;index<data.projects.length;index++) {
            if(data.projects[index].dir==dir) {
                setTimeout(()=>cb(0, data.projects[index]),1);
                return;
            }
        }
        setTimeout(()=>{cb(1)},1);
    }

    loadProjects = (cb) => {
        const data=JSON.parse(localStorage.getItem("dapps1.0")) || {};
        setTimeout(()=>cb(0, data.projects || []),1);
    }

    saveProject = (name, payload, cb, isNew, files) => {
        const data=JSON.parse(localStorage.getItem("dapps1.0")) || {};
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
        localStorage.setItem("dapps1.0", JSON.stringify(data));
        setTimeout(()=>cb({status:0,code:0}),1);
    };

    saveFile = (name, payload, cb) => {
        const data=JSON.parse(localStorage.getItem("dapps1.0")) || {};
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
        localStorage.setItem("dapps1.0", JSON.stringify(data));
        setTimeout(()=>cb({status:0, hash:""}),1);
    };

    loadFile = (name, path, cb) => {
        const data=JSON.parse(localStorage.getItem("dapps1.0")) || {};
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

    loadSettings = (cb) => {
        const settings=JSON.parse(localStorage.getItem("settings1.0")) || {};
        if(cb) setTimeout(()=>cb(settings),1);
    };

    saveSettings = (settings, cb) => {
        localStorage.setItem("settings1.0", JSON.stringify(settings));
        if(cb) setTimeout(()=>cb(),1);
    };

    downloadWorkspace = () => {
        const exportName = 'superblocks_workspace.json';
        const workspace=JSON.parse(localStorage.getItem("dapps1.0")) || {};
        var exportObj = workspace;
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
            localStorage.setItem("dapps1.0",evt.target.result)
            cb()
          }
        };
      
        var blob = file.slice(0, file.size);
        reader.readAsBinaryString(blob);
    }



}
