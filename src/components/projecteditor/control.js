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

import { h, Component } from 'preact';
import classnames from 'classnames';
import style from './control.less';
import Item from './item.js';
import Backend from  './backend';
import Dappfile from './dappfile';
import NewDapp from '../newdapp';
import Modal from '../modal';
import TransactionLogData from '../blockexplorer/transactionlogdata.js';

import FaIcon  from '@fortawesome/react-fontawesome';
import iconTrash from '@fortawesome/fontawesome-free-regular/faTrashAlt';
import iconGem from '@fortawesome/fontawesome-free-regular/faGem';
import iconFile from '@fortawesome/fontawesome-free-solid/faFile';
import iconFileAlt from '@fortawesome/fontawesome-free-regular/faFileAlt';
import iconFolder from '@fortawesome/fontawesome-free-solid/faFolder';
import iconFolderOpen from '@fortawesome/fontawesome-free-solid/faFolderOpen';
import iconAngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight';
import iconAngleDown from '@fortawesome/fontawesome-free-solid/faAngleDown';
import iconCubes from '@fortawesome/fontawesome-free-solid/faCubes';
import iconCube from '@fortawesome/fontawesome-free-solid/faCube';
import iconTh from '@fortawesome/fontawesome-free-solid/faTh';
import iconPlus from '@fortawesome/fontawesome-free-solid/faPlusSquare';
import iconSync from '@fortawesome/fontawesome-free-solid/faSync';
import iconBug from '@fortawesome/fontawesome-free-solid/faBug';
import iconBook from '@fortawesome/fontawesome-free-solid/faBook';
import iconCog from '@fortawesome/fontawesome-free-solid/faCog';
import iconCompile from '@fortawesome/fontawesome-free-solid/faPuzzlePiece';
import iconDeploy from '@fortawesome/fontawesome-free-regular/faPlayCircle';
import iconTest from '@fortawesome/fontawesome-free-solid/faFlask';
import iconUp from '@fortawesome/fontawesome-free-solid/faArrowUp';
import iconDown from '@fortawesome/fontawesome-free-solid/faArrowDown';
import iconClone from '@fortawesome/fontawesome-free-solid/faClone';
import iconDollar from '@fortawesome/fontawesome-free-solid/faDollarSign';
import iconWrench from '@fortawesome/fontawesome-free-solid/faWrench';
import iconGlobe from '@fortawesome/fontawesome-free-solid/faGlobe';
import iconChess from '@fortawesome/fontawesome-free-solid/faChess';
import iconYT from '@fortawesome/fontawesome-free-brands/faYoutube';
import iconDownload from '@fortawesome/fontawesome-free-solid/faDownload';
import iconUpload from '@fortawesome/fontawesome-free-solid/faUpload';

export default class DevkitProjectEditorControl extends Component {
    constructor(props) {
        super(props);
        this.backend = new Backend();
        this._projectsList=[
        ];
        this._menuChildren=[
            this._newItem({type: "toolbox", title: "Tutorials", toggable: true, icon:null, onClick: this._angleClicked, state:{open: false, children: [
                //this._newItem({type: "tutorials", type2: "online", title: "Online", classes: [], icon:iconYT, onClick: this._openItem}),
                this._newItem({type: "tutorials", type2: "manual", title: "Manual", classes: [], icon:iconBook, onClick: this._openItem}),
            ]}}),
            this._newItem({type: "project_select", title: "DApps", render:this._menuProjects, classes: ["menuprojects"], icon:null, state:{data: {projects: this._projectsList}}}),
        ];
        var menu=this._newItem({type: "top", title: "Top menu", render:this._menuTop, classes: ["menutop"], icon:null, toggable: false, state: {children: (item) => {
            var children=[];
            this._menuChildren.forEach((obj) => {
                children.push(obj);
            });
            this._projectsList.forEach((project) => {
                if(project.props.state.status=='active') children.push(project);
            });
            return children;
        }}});
        this.setState({
            menu: menu
        });
        props.router.register("control", this);
    }

    componentDidMount() {
        this._reloadProjects();
    }

    _saveProject = (projectItem, cb) => {
        this.backend.saveProject(projectItem.props.state.data.dir, {
            dappfile:projectItem.props.state.data.dappfile.getObj(),
            hash:projectItem.props.state.data.dappfile_hash,
        }, (body) => {
            if(body.status==0) {
                projectItem.props.state.data.dappfile_hash = body.hash;
            }
            else if(body.status==2) {
                alert('Project Dappfile.yaml has changed on disk. You need to reload the project now!');
            }
            else {
                alert('Project could not be saved.');
            }
            this.props.router.main.redraw();
            if(cb) cb(body.status);
        });
    };

    _renameFile = (project, path, file, cb) => {
        if(project._filecache && project._filecache[path]) {
            cb(1);
            return;
        }
        this.backend.renameFile(project.dir, path, file, cb);
    };

    _deleteFile = (project, file, cb) => {
        if(project._filecache && project._filecache[file]) {
            if(project._filecache[file].openCount>0) {
                cb(1);
                return;
            }
            delete project._filecache[file];
        }
        this.backend.deleteFile(project.dir, file, cb);
    };

    _closeFile = (project, file) => {
        if(project._filecache[file]) {
            project._filecache[file].openCount--;
            if(project._filecache[file].openCount==0) {
                delete project._filecache[file];
            }
        }
    };

    _loadFile = (project, file, cb, reload, stealth) => {
        project._filecache = project._filecache || [];
        if(!reload && project._filecache[file] != null) {
            const body=project._filecache[file];
            if(!stealth) body.openCount++;
            cb(body);
            return;
        }
        this.backend.loadFile(project.dir, file, (body) => {
            if(!stealth) {
                if(body.openCount===undefined) body.openCount=1;
                project._filecache[file]=body;
            }
            if(body.status==0) {
                body.state=0;
            }
            else {
                body.state=-1;
            }
            cb(body);
        });
    };

    _saveFile = (project, file, cb, overwrite) => {
        project._filecache = project._filecache || [];
        var body=project._filecache[file];
        this.backend.saveFile(project.dir, {contents:body.contents,hash:body.hash,overwrite:overwrite,path:file}, (ret) => {
            if(ret.status==0) {
                body.state=0;
                body.status=0;
                body.hash=ret.hash;
            }
            else if(ret.status==2) {
                alert('File ' + file + ' could not be saved since it has been changed on disk.');
            }
            else {
                alert('File ' + file + ' could not be saved.');
            }
            cb(ret);
        });
    };

    _constantsReplace=(project,text)=>{
        var text2;
        for(var i=0;i<100;i++) {
            text2=text.replace(/<constant>(.*)<\/constant>/g, (a,b,c)=>{
                if(b=="NOW()") return Date.now()+"";
                if(b=="SESSION_START_TIME()") return this.props.functions.session.start_time()+"";
                var constant = project.props.state.data.dappfile.getItem("constants", [{name: b}]);
                if(constant==null) {console.warn("Constant "+b+" is undefined."); return "";}
                const value = constant.get('value', project.props.state.data.env);
                if(value===undefined) console.warn("Constant "+b+" is undefined.");
                return value || "";
            });
            if(text2==text) break;
            text=text2;
        }
        return text2;
    };

    _newProject = (project) => {
        delete project.files;  // Files are handled by backend
        var children=[];
        var state={
            open: true,
            status: 'idle',
            data: {
            },
            children: children,
            txlog: new TransactionLogData({functions:this.props.functions}),
        };
        var projectItem = this._newItem({
            inode: project.inode,
            render: this._renderProjectTitle,
            type: "project",
            icon: null,
            toggable: true,
            classes: ["project"],
            state: state,
        });
        projectItem.props._project=projectItem;

        projectItem.save=(cb) => {this._saveProject(projectItem, cb)};
        projectItem.loadFile=(file, cb, stealth) => {this._loadFile(project, file, cb, false, stealth)};
        projectItem.saveFile=(file, cb) => {this._saveFile(project, file, cb)};
        projectItem.closeFile=(file) => {this._closeFile(project, file)};
        projectItem.deleteFile=(file, cb) => {this._deleteFile(project, file, cb)};
        projectItem.renameFile=(path, file, cb) => {this._renameFile(project, path, file, cb)};
        projectItem.constantsReplace=(text)=>{return this._constantsReplace(projectItem, text)};

        var transactionlog=this._newItem({title: "Transaction history", type: "transaction_log", icon:iconCube,onClick:this._openItem, _project: projectItem});
        children.push(transactionlog);

        var contractsChildren=(item) => {
            // Upvalue: state.
            var contracts=state.data.dappfile.contracts();
            var children=[];
            var _children=item.props.state._children || [];
            for(var index=0;index<contracts.length;index++) {
                var contract=contracts[index];

                const contractChildChildren=[];
                var contractChild=this._newItem({title: contract.name, _index: index, _nrContracts: contracts.length, _key: contract.name+":"+contract.source, render: this._renderContractTitle, icon: iconFileAlt, _project: projectItem, _contract: contract, type: "file", type2: "contract", file: contract.source, toggable: true, state:{_tag: 0, open:false, children: contractChildChildren}});

                var contractConfig=this._newItem({title: "Configure", _contract: contract.name, _project: projectItem, type: "contract", type2: "configure", onClick: this._openItem, icon: iconCog, state: {_tag: 1}});
                var contractInteract=this._newItem({title: "Interact", _parentItem: contractChild, _contract: contract.name, _project: projectItem, type: "contract", type2: "interact", onClick: this._openItem, icon: iconChess, state: {_tag: 2}});
                var contractCompile=this._newItem({title: "Compile", _contract: contract.name, _project: projectItem, type: "contract", type2: "compile", onClick: this._openItem, icon: iconCompile, state: {_tag: 3}});
                var contractDeploy=this._newItem({title: "Deploy", _parentItem: contractChild, _contract: contract.name, _project: projectItem, type: "contract", type2: "deploy", onClick: this._openItem, icon: iconDeploy, state: {_tag: 4}});

                contractChildChildren.push(contractConfig);
                contractChildChildren.push(contractCompile);
                contractChildChildren.push(contractDeploy);
                contractChildChildren.push(contractInteract);
                children.push(contractChild);
            }
            // Add invisible items
            const invsMake=this._newItem({title: "Make", icon: iconDeploy, _project: projectItem, _key: "make", type: "make", type2: "contracts", _hidden: true});
            children.push(invsMake);
            this._copyState(children, _children);
            item.props.state._children=children;
            return children;
        };
        var contracts=this._newItem({title: "Contracts", type: "folder", type2: "contracts", _project: projectItem, render: this._renderContractsTitle, toggable: true, state: {open: true, children: contractsChildren}});
        children.push(contracts);

        var constantsChildren=(item) => {
            // Upvalue: state.

            // Cached children, we want to keep the state.
            var _children=item.props.state._children || [];

            // Newly generated children, which we copy state over to.
            var children=[];
            var constants=state.data.dappfile.constants();
            for(var index=0;index<constants.length;index++) {
                var constant=constants[index];
                var childItem = this._newItem({title: constant.name, _key: constant.name, _index: index, _project: projectItem, _constant: constant.name, icon:iconGem, onClick:this._openItem, render: this._renderConstantTitle, type: "constant"});
                children.push(childItem);
            }
            this._copyState(children, _children);

            // Cache generated.
            item.props.state._children=children;
            return children;
        };

        var accountsChildren=(item) => {
            // Upvalue: state.

            // Cached children, we want to keep the state.
            var _children=item.props.state._children || [];

            // Newly generated children, which we copy state over to.
            var children=[];
            var accounts=state.data.dappfile.accounts();
            for(var index=0;index<accounts.length;index++) {
                var account=accounts[index];
                var childItem = this._newItem({title: account.name, _key: account.name, _index: index, _project: projectItem, _account: account.name, icon:iconGem, onClick: this._openItem, render: this._renderAccountTitle, type: "account"});
                children.push(childItem);
            }
            this._copyState(children, _children);

            // Cache generated.
            item.props.state._children=children;
            return children;
        };
        var app=this._newItem({title: "App", type: "app", type2: "composite", onClick: this._openAppComposite, _project: projectItem, toggable: true, icon:iconCog, state:{open: false, children: [
            this._newItem({title: "app.html", _project: projectItem, type: "file", type2: 'html', _project: projectItem, file: "/app/app.html",onClick: this._openItem, state:{_tag:0}}),
            this._newItem({title: "app.js", _project: projectItem, type: "file", type2: 'js', _project: projectItem, file:'/app/app.js', onClick: this._openItem, state:{_tag:3}}),
            this._newItem({title: "app.css", _project: projectItem, type: "file", type2: 'css', _project: projectItem, file: '/app/app.css', onClick: this._openItem, state:{_tag:2}}),
            this._newItem({title: "View", _project: projectItem, type: "app", type2: "view", _project: projectItem, onClick: this._openItem, state:{_tag:1}}),

        ]}});
        children.push(app);

        var constants=this._newItem({classes: ["hidden"], title: "Constants", type: "folder", type2: "constants", _project: projectItem, render:this._renderConstantsTitle ,toggable: true, state:{open: false, children: constantsChildren}});
        children.push(constants);

        var accounts=this._newItem({title: "Accounts", type: "folder", type2: "accounts", _project: projectItem, render:this._renderAccountsTitle ,toggable: true, state:{open: false, children: accountsChildren}});
        children.push(accounts);

        var files=this._newItem({classes: ["hidden"], title: "Files", type: "folder", type2: "files", _project: projectItem, _level: 0, _lazy:true, _path: '/', _key: '/', toggable: true, render: this._renderFileTitle, state:{open: false, children: this._renderFilesChildren}});
        children.push(files);

        if(!this._updateProject(projectItem, project)) return null;
        return projectItem;
    };

    _renderFilesChildren = (item) => {
        if(item.props.type=='folder') {
            this.backend.listFiles(item.props._project.props.state.data.dir, item.props._path, (status, list) => {
                if(status==0) {
                    const children=[];
                    list.map((file)=>{
                        if(file.type=="d") {
                            children.push(this._newItem({title: file.name, type: "folder", type2: "listing", _lazy: true,
                                _path: item.props._path + file.name + "/", _key: item.props._key + file.name+"/",
                                _project: item.props._project,
                                render: this._renderFileTitle,
                                _level: item.props._level+1, toggable: true, state: {open:false, children: this._renderFilesChildren}
                            }));
                        }
                        else if(file.type=="f") {
                            children.push(this._newItem({title: file.name, type: "file", type2: "listing", _key: item.props._key + file.name+"/",
                                _path: item.props._path + file.name,
                                file: item.props._path + file.name,
                                _project: item.props._project,
                                onClick: this._openItem,
                                render: this._renderFileTitle,
                                _level: item.props._level+1, state: {}
                            }));
                        }
                    });
                    this._copyState(children, item.props.state._children || []);
                    item.props.state._children=children;
                    this.redraw()
                }
            });
        }
        return [];
    };

    _shortenSourceName = (path) => {
        return path.match("([^/]*)$")[0];
    };

    // Find same Item and copy the state.
    _copyState = (target, source) => {
        var ret=[];
        for(var index=0;index<target.length;index++) {
            var targetChild=target[index];
            for(var index2=0;index2<source.length;index2++) {
                var sourceChild=source[index2];
                // Compare properties.
                if(this._cmpItem(targetChild.props, sourceChild.props)) {
                    targetChild.props.state=sourceChild.props.state;
                }
            }
        }
    };

    _cmpItem = (item1, item2) => {
        return (item1._key === item2._key);
        //var same=true;
        //Object.keys(item1).map((key) => {
            //var value=item1[key];
            //if(value instanceof Array) return;
            //if(value instanceof Object) return;
            //if(value instanceof Function) return;
            //if(value!=item2[key]) same=false;
        //});
        //return same;
    };

    _updateProject = (item, project) => {
        item.props.title = project.dir;
        item.props.state.data.dir = project.dir;
        item.props.state.data.dappfile = new Dappfile({dappfile:project.dappfile});
        //this._testar(item.props.state.data.dappfile);
        item.props.state.data.dappfile_hash = project.dappfile_hash;

        // Set a default env.
        if(item.props.state.data.dappfile.environments().length == 0) {
            return false
        }
        var defenv = item.props.state.data.dappfile.environments()[0].name;
        var found=false;
        for(var index=0;index<item.props.state.data.dappfile.environments().length;index++) {
            if(item.props.state.data.dappfile.environments()[index].name == item.props.state.data.env) {
                found=true;
                break;
            }
        }
        if(!found) {
            item.props.state.data.env = defenv;
        }

        // Refresh the file explorer.
        const itemFiles=this._filterItem(item, {type2: "files"});
        var crazyRecurser;
        crazyRecurser= (item) =>{
            const childrn=item.props.state._children || [];
            for(var index=0;index<childrn.length;index++) {
                crazyRecurser(childrn[index]);
            }
            if(childrn.length>0 || item.props.state.open) {
                item.getChildren(true);
            }
        };
        crazyRecurser(itemFiles);
        return true;
    };

    _newItem = (props) => {
        if(props.state == null) props.state={};
        if(props.state.id == null) props.state.id=this.props.functions.generateId();
        if(props.toggable && props.state.open == null) props.state.open=true;
        return new Item(props);
    };

    _openAppComposite=(e,item)=>{
        e.preventDefault();
        if(!this.props.router.panes) return;
        var item2=this._filterItem(item, {type2: "html"});
        if(!this.props.router.panes.openItem(item2)) return;
        var {pane, winId} = this.props.router.panes.getWindowByItem(item2);
        var item2=this._filterItem(item, {type2: "js"});
        this.props.router.panes.openItem(item2, pane.id);
        var item2=this._filterItem(item, {type2: "css"});
        this.props.router.panes.openItem(item2, pane.id);
        var item2=this._filterItem(item, {type2: "view"});
        this.props.router.panes.openItem(item2, pane.id);
    };
    _openItem = (e, item) => {
        e.preventDefault();
        if(this.props.router.panes) this.props.router.panes.openItem(item);
    };

    redraw = () => {
        this.setState();
    };

    _newDapp = (e) => {
        e.preventDefault();
        const cb=(status, code) => {
            if(code==0) {
                this._reloadProjects(null, (status)=>{
                const item=this._projectsList[this._projectsList.length-1];
                if(item) this._addProjectToExplorer(item);
                const data={
                    title: "Create new DApp successful",
                    body: "Your DApp has been successfully created.",
                    buttons: []
                };
                this.props.functions.modal.show({render: () => {return (<Modal functions={this.props.functions} data={data} />)}});
                });
            }
            else {
                alert("A DApp with that name already exists, choose a different name.");
            }
        };
        const cancel=(modal) =>{
        };
        const modal={};
        modal.render=() => {return (<NewDapp backend={this.backend} functions={this.props.functions} modal={modal} cb={cb} />)};
        this.props.functions.modal.show(modal);
    };

    _menuTop = (level, index, item) => {
        return (
            <div>
                <div>
                    <a href="#" class={style.btn1} onClick={this._newDapp}  title="New Dapp">
                        <FaIcon icon={iconPlus} />
                    </a>
                    <a href="#" class={style.btn1}  onClick={this._downloadWorkspace} title="Download Workspace">
                        <FaIcon icon={iconDownload} />
                    </a>
                    <input id="wsFileInput" type="file" style="display: none;" onChange={e => this._uploadWorkspace(e)} ref={w => this.wsFileInput=w} />
                    <a href="#" class={style.btn1}  onClick={e => this._clickWorkspace(e)} title="Upload Workspace">
                        <FaIcon icon={iconUpload} />
                    </a>
                </div>
                <div class={style.notefiles}>
                    Note: all files are stored in the browser only, download to backup.
                </div>
            </div>
        );
    };

    _downloadWorkspace = e => {
        e.preventDefault();
        this.backend.downloadWorkspace(e);
    }

    _clickWorkspace = (e) => {
        e.preventDefault();
        document.querySelector('#wsFileInput').dispatchEvent(new MouseEvent('click')); // ref does not work fhttps://github.com/developit/preact/issues/477
    }
    _uploadWorkspace = (e) => {
        e.preventDefault();
        var files = document.querySelector('#wsFileInput').files;
        var file = files[0];

        const uploadConfirm = e => {
            e.preventDefault()
            this.backend.uploadWorkspace(file, err => {
                if(err) {
                    alert(err);
                    this.props.functions.modal.close();
                }
                else this._reloadProjects(e, this.props.functions.modal.close)
            });
        }
        
        const body=(
            <div>
                <p>Warning, this will overwrite the entire workspace, press 'Import' to confirm.</p>
                <div style="margin-top: 10px;">
                    <a class="btn2" style="float: left; margin-right: 30px;" onClick={this.props.functions.modal.cancel}>Cancel</a>
                    <a class="btn2 filled" style="float: left;" onClick={uploadConfirm}>Import</a>
                </div>
            </div>
        );
        const modalData={
            title: "Import Saved Workspace",
            body: body,
            style: {"text-align":"center",height:"400px"},
        };
        const modal=(<Modal data={modalData} />);
        this.props.functions.modal.show({render: () => {return modal;}});

        e.target.value = '';
    }

    _menuProjects = (level, index, item) => {
        var index=-1;
        return (
            <div>
                <select onChange={this._selectProject}>
                    <option selected={true}>DApps</option>
                    {item.props.state.data.projects.map((item) => {
                        index++;
                        return <option value={index}>{item.getTitle()}</option>
                    })}
                </select>
            </div>
        );
    };

    _selectProject = (e) => {
        e.preventDefault();
        var item=this._projectsList[e.target.value];
        if(item) this._addProjectToExplorer(item);
    };

    _openProjectConfig = (e, item) => {
        e.preventDefault();
        this.backend.loadProject(item.props.state.data.dir, (status, project)=>{
            if(status==0) {
                item.props._dappfilejson=project;
                if(this.props.router.panes) this.props.router.panes.openItem(item);
            }
        });
    };

    _selectEnvironment = (item, e) => {
        var env=e.target.value;
        if(env) {
            item.props.state.data.env=env;
            if(this.props.router.panes) this.props.router.panes.redraw(true);
            this.setState();
        }
    };

    _renderConstantsTitle = (level, index, item) => {
        var projectItem = item.props._project;
        return (<div class={style.projectContractsTitle}>
            <div class={style.title}>
                <a href="#" onClick={(e)=>this._angleClicked(e, item)}>{item.getTitle()}</a>
            </div>
            <div class={style.buttons}>
                <a href="#" title="New constant" onClick={(e)=>{this._clickNewConstant(e, projectItem);}}>
                    <FaIcon icon={iconGem} />
                </a>
            </div>
        </div>);
    };

    _renderAccountsTitle = (level, index, item) => {
        var projectItem = item.props._project;
        return (<div class={style.projectContractsTitle}>
            <div class={style.title}>
                <a href="#" onClick={(e)=>this._angleClicked(e, item)}>{item.getTitle()}</a>
            </div>
            <div class={style.buttons}>
                <a href="#" title="New account" onClick={(e)=>{this._clickNewAccount(e, projectItem);}}>
                    <FaIcon icon={iconGem} />
                </a>
            </div>
        </div>);
    };

    _openContractMake = (e, item) => {
        e.preventDefault();
        const item2=this._filterItem(item, {type: "make"});
        if(item2 && this.props.router.panes) this.props.router.panes.openItem(item2);
    };

    _filterItem = (root, filter) => {
        return root.getChildren().filter((item)=>{
            const keys=Object.keys(filter);
            for(var index=0;index<keys.length;index++) {
                const key=keys[index];
                if(item.props[key] != filter[key]) return false;
            }
            return true;
        })[0];
    };

    _renderContractsTitle = (level, index, item) => {
        var projectItem = item.props._project;
        return (<div class={style.projectContractsTitle}>
            <div class={style.title}>
                <a href="#" onClick={(e)=>this._angleClicked(e, item)}>{item.getTitle()}</a>
            </div>
            <div class={style.buttons}>
                <a href="#" title="New contract" onClick={(e)=>{this._clickNewContract(e, projectItem);}}>
                    <FaIcon icon={iconFileAlt} />
                </a>
            </div>
        </div>);
    };
            /*
                <a href="#" title="Deploy contracts..." onClick={(e)=>this._openContractMake(e, item)}>
                    <FaIcon icon={iconDeploy} />
                </a>
                <a href="#" title="Test contracts...">
                    <FaIcon icon={iconTest} />
                </a>
                */

    _clickNewConstant = (e, projectItem) => {
        e.preventDefault();

        var name;
        for(var index=0;index<100000;index++) {
            name="CONSTANT"+index;
            if(projectItem.props.state.data.dappfile.constants().filter((c)=>{
                return c.name==name;
            }).length==0) {
                break;
            }
        }
        projectItem.props.state.data.dappfile.constants().push({
            name: name,
            value: '',
        });
        projectItem.save((status)=>{
            if(status==0) {
                // TODO: this lookup is bad.
                const cnsts=projectItem.props.state.children[2].props.state._children;
                const constant=cnsts[cnsts.length-1];
                if(this.props.router.panes) this.props.router.panes.openItem(constant);
            }
        });
        this.setState();
    };

    _clickNewAccount = (e, projectItem) => {
        e.preventDefault();

        var name;
        for(var index=0;index<100000;index++) {
            name="Account"+index;
            if(projectItem.props.state.data.dappfile.accounts().filter((c)=>{
                return c.name==name;
            }).length==0) {
                break;
            }
        }
        const wallet=projectItem.props.state.data.dappfile.wallets()[0].name;
        projectItem.props.state.data.dappfile.accounts().push({
            name: name,
            blockchain: "ethereum",
            wallet: wallet,
            index: '0',
        });
        projectItem.save((status)=>{
            if(status==0) {
                // TODO: this lookup is bad.
                const accnts=projectItem.props.state.children[3].props.state._children;
                const account=accnts[accnts.length-1];
                if(this.props.router.panes) this.props.router.panes.openItem(account);
            }
        });
        this.setState();
    };

    _clickNewContract = (e, projectItem) => {
        e.preventDefault();

        var name;
        for(var index=0;index<100000;index++) {
            name="Contract"+index;
            if(projectItem.props.state.data.dappfile.contracts().filter((c)=>{
                return c.name==name;
            }).length==0) {
                break;
            }
        }
        var account="";
        if(projectItem.props.state.data.dappfile.accounts().length>0) account=projectItem.props.state.data.dappfile.accounts()[0].name
        projectItem.props.state.data.dappfile.contracts().push({
            name: name,
            account: account,
            source: "/contracts/"+name+".sol",
            blockchain: "ethereum",
            network: "browser",
            _environments: [
                {
                    name: "browser",
                    data: {
                        network: "browser"
                    }
                },
                {
                    name: "local",
                    data: {
                        network: "local"
                    }
                },
            ]
        });
        projectItem.save((status)=>{
            if(status==0) {
                // TODO: this lookup is bad.
                const ctrs=projectItem.props.state.children[0].props.state._children;
                const contract=ctrs[ctrs.length-2];
                const item=contract.props.state.children[0];
                if(this.props.router.panes) this.props.router.panes.openItem(item);
            }
        });
        this.setState();
    };

    _clickDeleteContract = (e, projectItem, contractIndex) => {
        e.preventDefault();
        if(!confirm("Really delete contract?")) return;
        const contract=projectItem.props.state.data.dappfile.contracts()[contractIndex];
        projectItem.deleteFile(contract.source, (status)=>{
            if(status>0) {
                alert("Could not delete contract, close editor and try again.");
                return;
            }
            projectItem.props.state.data.dappfile.contracts().splice(contractIndex,1);
            projectItem.save();
            this.setState();
        });
    };

    _clickDownContract = (e, projectItem, contractIndex) => {
        e.preventDefault();
        const c1 = projectItem.props.state.data.dappfile.contracts()[contractIndex];
        const c2 = projectItem.props.state.data.dappfile.contracts()[contractIndex+1];
        projectItem.props.state.data.dappfile.contracts()[contractIndex] = c2;
        projectItem.props.state.data.dappfile.contracts()[contractIndex+1] = c1;
        projectItem.save();
        this.setState();
    };

    _clickUpContract = (e, projectItem, contractIndex) => {
        e.preventDefault();
        const c1 = projectItem.props.state.data.dappfile.contracts()[contractIndex];
        const c2 = projectItem.props.state.data.dappfile.contracts()[contractIndex-1];
        projectItem.props.state.data.dappfile.contracts()[contractIndex] = c2;
        projectItem.props.state.data.dappfile.contracts()[contractIndex-1] = c1;
        projectItem.save();
        this.setState();
    };

    _clickDeleteConstant = (e, projectItem, constantIndex) => {
        e.preventDefault();
        projectItem.props.state.data.dappfile.constants().splice(constantIndex,1);
        projectItem.save();
        this.setState();
    };

    _clickDeleteAccount = (e, projectItem, accountIndex) => {
        e.preventDefault();
        projectItem.props.state.data.dappfile.accounts().splice(accountIndex,1);
        projectItem.save();
        this.setState();
    };

    _renderConstantTitle = (level, index, item) => {
        var projectItem=item.props._project;
        var constantIndex=item.props._index;
        return (<div class={style.projectContractsTitle}>
            <div class={style.title}>
                <a href="#" onClick={(e)=>this._openItem(e, item)}>
                    {item.getTitle()}
                </a>
            </div>
            <div class={style.buttons}>
                <a href="#" title="Delete constant" onClick={(e)=>{this._clickDeleteConstant(e, projectItem, constantIndex);}}>
                    <FaIcon icon={iconTrash} />
                </a>
            </div>
        </div>);
    };

    _renderAccountTitle = (level, index, item) => {
        var projectItem=item.props._project;
        var accountIndex=item.props._index;
        return (<div class={style.projectContractsTitle}>
            <div class={style.title}>
                <a href="#" onClick={(e)=>this._openItem(e, item)}>
                    {item.getTitle()}
                </a>
            </div>
            <div class={style.buttons}>
                <a href="#" title="Delete account" onClick={(e)=>{this._clickDeleteAccount(e, projectItem, accountIndex);}}>
                    <FaIcon icon={iconTrash} />
                </a>
            </div>
        </div>);
    };

    _renderContractTitle = (level, index, item) => {
        var projectItem=item.props._project;
        var contractIndex=item.props._index;
        return (<div class={style.projectContractsTitle}>
            <div class={style.title}>
                <a href="#" onClick={(e)=>this._openItem(e, item)}>
                    {item.getTitle()}
                </a>
            </div>
            <div class={style.buttons}>
                {contractIndex>0&&
                <a href="#" title="Move up" onClick={(e)=>{this._clickUpContract(e, projectItem, contractIndex);}}>
                    <FaIcon icon={iconUp} />
                </a> ||
                    <div style="opacity:0.3;display:inline;">
                        <FaIcon icon={iconUp} />
                    </div>
                }
                {contractIndex<item.props._nrContracts-1 &&
                <a href="#" title="Move down" onClick={(e)=>{this._clickDownContract(e, projectItem, contractIndex);}}>
                    <FaIcon icon={iconDown} />
                </a> ||
                    <div style="opacity:0.3;display:inline;">
                        <FaIcon icon={iconDown} />
                    </div>
                }
                <a href="#" title="Delete contract" onClick={(e)=>{this._clickDeleteContract(e, projectItem, contractIndex);}}>
                    <FaIcon icon={iconTrash} />
                </a>
            </div>
        </div>);
    };

    _clickNewFile = (e, item) => {
        e.preventDefault();
        var projectItem=item.props._project;
        if(item.props.type=="folder") {
            const file = prompt("Enter new name of file or folder. If folder last character must be a slash (/).");
            if(file) {
                if(!file.match("(^[a-zA-Z0-9-_\.]+[/]?)$")) {
                    alert("Illegal filename.");
                    return false;
                }
                this.backend.newFile(projectItem.props.state.data.dir, item.props._path, file, (status) => {
                    if(status==0) {
                        this._reloadProjects();
                    }
                    else {
                        alert("Could not create file/folder.");
                    }
                });
            }
        }
    };

    _clickDeleteFile = (e, item) => {
        e.preventDefault();
        var projectItem=item.props._project;
        if(!confirm("Are you sure to delete " + item.props._path + "?")) return false;
        this.backend.deleteFile(projectItem.props.state.data.dir, item.props._path, (status) => {
            if(status==0) {
                this._reloadProjects();
            }
            else {
                alert("Could not delate file/folder.");
            }
        });
    };

    _clickRenameFile = (e, item) => {
        e.preventDefault();
        var projectItem=item.props._project;
        const file = prompt("Enter new name.", item.props.title);
        if(file) {
            if(!file.match("(^[a-zA-Z0-9-_\.]+)$")) {
                alert("Illegal filename.");
                return false;
            }
            this.backend.renameFile(projectItem.props.state.data.dir, item.props._path, file, (status) => {
                if(status==0) {
                    this._reloadProjects();
                }
                else {
                    alert("Could not rename file/folder.");
                }
            });
        }
    };

    _renderFileTitle = (level, index, item) => {
        var projectItem=item.props._project;
        if(item.props.type=="file") {
            return (<div class={style.projectContractsTitle}>
                <div class={style.title}>
                    <a title={item.getTitle()} href="#" onClick={(e)=>this._openItem(e, item)}>
                        {item.getTitle()}
                    </a>
                </div>
                <div class={style.buttons}>
                    <a href="#" title="Rename file" onClick={(e)=>{this._clickRenameFile(e, item);}}>
                        <FaIcon icon={iconClone} />
                    </a>
                    <a href="#" title="Delete file" onClick={(e)=>{this._clickDeleteFile(e, item);}}>
                        <FaIcon icon={iconTrash} />
                    </a>
                </div>
            </div>);
        }
        else if(item.props.type=="folder") {
            return (<div class={style.projectContractsTitle}>
                <div class={style.title} title={item.getTitle()}>
                    <a href="#" onClick={(e)=>this._angleClicked(e, item)}>{item.getTitle()}</a>
                </div>
                <div class={style.buttons}>
                    <a href="#" title="New..." onClick={(e)=>{this._clickNewFile(e, item);}}>
                        <FaIcon icon={iconFile} />
                    </a>
                    {item.props._path != "/" &&
                    <div style="display: inline;">
                        <a href="#" title="Rename directory" onClick={(e)=>{this._clickRenameFile(e, item);}}>
                            <FaIcon icon={iconClone} />
                        </a>
                        <a href="#" title="Delete directory" onClick={(e)=>{this._clickDeleteFile(e, item);}}>
                            <FaIcon icon={iconTrash} />
                        </a>
                    </div>
                    }
                </div>
            </div>);
        }
    };

    _renderProjectTitle = (level, index, item) => {
        var options = item.props.state.data.dappfile.environments().map((option) => {
            return (<option selected={option.name==item.props.state.data.env} value={option.name}>{option.name}</option>);
        });
        return (<div class={style.projectSelect}>
            <div class={style.title}>
                <a href="#" onClick={(e)=>this._angleClicked(e, item)}>{item.getTitle()}</a>
            </div>
            <div class={style.select}>
                <select title="Environment" onChange={(e) =>this._selectEnvironment(item, e)}>
                    {options}
                </select>
            </div>
            <div class={style.buttons}>
                <a href="#" title="Configure project" onClick={(e)=>this._openProjectConfig(e, item)}>
                    <FaIcon icon={iconCog} />
                </a>
            </div>
        </div>);
    };

    _addProjectToExplorer = (projectItem) => {
        projectItem.props.state.status='active';
        this.setState();
    };

    _validateProject = (project) => {
        if(! (project.dappfile.environments instanceof Array)) {
            return false;
        }
        return true;
    };

    _reloadProjects = (e, cb) => {
        if(e) e.preventDefault();
        this.backend.loadProjects((status, projects) => {
            if(status!=0) {
                alert('Could not load projects.');
                return;
            }

            for(var index=0;index<projects.length;index++) {
                var project=projects[index];
                if(!this._validateProject(project)) {
                    continue;
                }
                var found=false;
                for(var index2=0;index2<this._projectsList.length;index2++) {
                    var existingItem=this._projectsList[index2];
                    if(project.inode == existingItem.props.inode) {
                        // Update object, keep state.
                        this._updateProject(existingItem, project);
                        found=true;
                        break;
                    }
                }
                if(!found) {
                    var newProject = this._newProject(project);
                    if(newProject) {
                        this._projectsList.push(newProject);
                    }
                }
            }

            for(var index2=0;index2<this._projectsList.length;index2++) {
                var existingItem=this._projectsList[index2];
                var found=false;
                for(var index=0;index<projects.length;index++) {
                    var project=projects[index];
                    if(project.inode == existingItem.props.inode) {
                        found=true;
                        break;
                    }
                }
                if(!found) {
                    this._removeProject(existingItem);
                }
            }

            if(cb) cb(0);
            this.props.router.main.redraw();
        });
    };

    _removeProject = (item) => {
        item.props.state.status='removed';
        const index=this._projectsList.indexOf(item);
        if(index>-1) {
            this._projectsList.splice(index,1);
        }
    };

    _renderIcons = (level, index, item) => {
        var caret;
        var isToggable=item.props.toggable && (item.getChildren().length>0 || item.props._lazy);
        if(isToggable) {
            var caretIcon=iconAngleRight;
            if(item.props.state.open) {
                caretIcon=iconAngleDown;
            }
            caret = (<div class={style.caret}>
                    <a href="#" onClick={(e)=>this._angleClicked(e, item)}>
                        <FaIcon icon={caretIcon} />
                    </a>
                </div>);
        }
        else {
            caret = (<div class={style.nocaret}></div>);
        }

        var iconOpen;
        var iconCollapsed;
        if(item.props.icon !== undefined) {
            iconOpen=item.props.icon;
            iconCollapsed=item.props.iconCollapsed || iconOpen;
        }
        else {
            if(item.props.type=="folder") {
                iconOpen=iconFolderOpen;
                iconCollapsed=iconFolder;
            }
            else if(item.props.type2=="contract") {
                iconOpen=iconFileAlt;
                iconCollapsed=iconFileAlt;
            }
            else {
                iconOpen=iconFile;
                iconCollapsed=iconFile;
            }
        }

        var icon;
        if(iconOpen == null) {
            icon = (<div class={style.noicon}></div>);
        }
        else {
            var iconIcon=iconCollapsed;;
            if(item.props.state.open) {
                iconIcon = iconOpen;
            }
            if(isToggable) {
                icon = (<div class={style.icon}>
                        <a href="#" onClick={(e)=>this._angleClicked(e, item)}>
                            <FaIcon icon={iconIcon} />
                        </a>
                    </div>);
            }
            else {
                if(item.props.onClick) {
                    icon = (<div class={style.icon}>
                            <a href="#" onClick={(e)=>{item.props.onClick(e,item)}}><FaIcon icon={iconIcon} /></a>
                        </div>);
                }
                else {
                    icon = (<div class={style.icon}>
                        <FaIcon icon={iconIcon} />
                    </div>);
                }
            }
        }

        return (<div class={style.icons}>{caret}{icon}</div>);
    };

    _angleClicked = (e, item) => {
        e.preventDefault();
        item.props.state.open = !item.props.state.open;
        if(item.props.state.open && item.props._lazy) item.getChildren(true);
        this.setState();
    };

    _getClasses = (level, index, item) => {
        const cls={};
        cls[style.item]=true;
        if(style["level"+level]) cls[style["level"+level]]=true;
        if(style["index"+index]) cls[style["index"+index]]=true;
        if(item.getChildren().length>0 || item.props._lazy) cls[style.haschildren]=true;
        for(var i=0;i<(item.props.classes||[]).length;i++) {
            var classs=item.props.classes[i];
            if(style[classs]) {
                cls[style[classs]]=true;
            }
            else {
                cls[classs]=true;
            }
        }
        return cls;
    };

    _packageChildren = (level, index, item, renderedChildren) => {
        if(renderedChildren.length==0) return;
        const cls={};
        cls[style.children]=true;
        if(item.props.state.open==false) cls[style.collapsed]=true;
        return (
            <div className={classnames(cls)}>
                {renderedChildren}
            </div>
        );
    };

    _defaultRender = (level, index, item) => {
        if(item.props.onClick) {
            return (<div title={item.props.title2} class={style.title}><a href="#" onClick={(e)=>{item.props.onClick(e, item)}}>{item.getTitle()}</a></div>);
        }
        return (<div title={item.props.title2} class={style.title}>{item.getTitle()}</div>);
    };

    _renderItem = (level, index, item, renderedChildren) => {
        if(item.props._hidden) return;
        var output;
        if(item.props.render) {
            output = item.props.render(level, index, item);
        }
        else {
            output = this._defaultRender(level, index, item);
        }
        const icons=this._renderIcons(level, index, item);
        const childrenPkg=this._packageChildren(level, index, item, renderedChildren);
        const classes=this._getClasses(level, index, item);
        return (
            <div className={classnames(classes)}>
                <div class={style.header}>
                    {icons}
                    {output}
                </div>
                {childrenPkg}
            </div>
        );
    };

    renderItem = (level, index, item) => {
        const renderedChildren = item.getChildren().map((item, index2) => {
            return this.renderItem(level+1, index2, item);
        });
        return this._renderItem(level, index, item, renderedChildren);
    };

    render() {
        const item=this.renderItem(0, 0, this.state.menu);
        item.key="controltree";
        return (
            <div class="full">
                <div class={style.treemenu}>
                    {item}
                </div>
            </div>
        );
    }
}
