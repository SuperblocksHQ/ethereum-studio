import { Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import style from './style';
import { Dropdown, DropdownContainer } from '../dropdown';
import {
    IconTransactions,
    IconDownload,
    IconTrash,
    IconConfigure,
    IconHelp,
    IconProjectSelector,
    IconDropdown,
    IconTelegram,
    IconCheck
} from '../icons';

class HelpDropdownAction extends Component {
    render() {
        return (
            <div class={style.action}>
                <button class={classNames([style.container, "btnNoBg"])}>
                    <IconHelp />
                    <span>Help</span>
                </button>
            </div>
        )
    }
}

class HelpDropdownDialog extends Component {
    render() {
        return (
            <div class={classNames([style.helpMenu])}>
                <div class={style.title}>General</div>
                <ul>
                    <li>
                        <a href="">Help Center</a>
                    </li>
                    <li>
                        <div class={style.container}>
                            <a href="">Join our Community!</a>
                            <span class={style.telegramIcon}>
                                <IconTelegram color="#0088cc"/>
                            </span>
                        </div>

                    </li>
                    <li>
                        <a href="">What’s new 🚀</a>
                    </li>
                </ul>
            </div>
        );
    }
}

class ProjectSelector extends Dropdown {

    openProject = (e, project, cb) => {
        e.preventDefault();
        this.props.router.control.openProject(project, cb);
    };

    openProjectConfig = (e, project) => {
        this.openProject(e, project, (status) => {
            if (status == 0) {
                this.props.router.control.openProjectConfig(project);
            }
        });
    };

    downloadProject = (e, project) => {
        e.preventDefault();

        const keepState = confirm("Do you also want to save the project state (current contract addresse, ABI's, etc)?");
        this.props.router.control.downloadProject(project, keepState);
    };

    importProject = (e) => {
        e.preventDefault();
        var uploadAnchorNode = document.createElement('input');
        uploadAnchorNode.setAttribute("id", "importFileInput");
        uploadAnchorNode.setAttribute("type", "file");
        uploadAnchorNode.onchange=this.importProject2;
        document.body.appendChild(uploadAnchorNode); // required for firefox
        uploadAnchorNode.click();
        uploadAnchorNode.remove();
    };

    importProject2 = (e) => {
        var file = e.target.files[0];
        var reader = new FileReader();

        reader.onloadend = (evt) => {
            var dappfileJSONObj;
            if (evt.target.readyState == FileReader.DONE) {
                try {
                    const obj = JSON.parse(evt.target.result);
                    if (!obj.dappfile || !obj.files) {
                        alert('Error: Invalid project file');
                        return;
                    }
                    dappfileJSONObj = obj;
                } catch (e) {
                    alert('Error: Invalid JSON file.');
                    return;
                }

                this.importProject3(dappfileJSONObj);
            }
        }
        var blob = file.slice(0, file.size);
        reader.readAsBinaryString(blob);
    }

    importProject3 = (dappfileJSONObj) => {
        var title;
        var name = dappfileJSONObj.dir || "";
        if(dappfileJSONObj.dappfile.project && dappfileJSONObj.dappfile.project.info) {
            title = dappfileJSONObj.dappfile.project.info.title || "";
        }

        do {
            var name2 = prompt("Please give the project a name.", name);
            if(!name2) {
                alert("Import cancelled.");
                return;
            }
            if(!name2.match(/^([a-zA-Z0-9-]+)$/) || name2.length > 20) {
                alert('Illegal projectname. Only A-Za-z0-9 and dash (-) allowed. Max 20 characters.');
                continue;
            }
            name = name2;
            break;
        } while (true);

        do {
            var title2 = prompt("Please give the project a snappy title.", title);
            if(!title2) {
                alert("Import cancelled.");
                return;
            }
            if (title2.match(/([\"\'\\]+)/) || title2.length > 20) {
                alert('Illegal title. No special characters allowed. Max 20 characters.');
                continue;
            }
            title = title2;
            break;
        } while (true);

        const cb = (ret) => {
            if(ret.status == 1) {
                alert("A project by that name already exists, please choose a different name.");
                this.importProject3(dappfileJSONObj);
                return;
            }
            this.props.router.control._reloadProjects(null, (status) => {
                const item=this.props.router.control._projectsList[this.props.router.control._projectsList.length-1];
                if(item) {
                    this.props.router.control.openProject(item);
                }
            });
        };

        dappfileJSONObj.dappfile.project = {info:{title: title}};
        dappfileJSONObj.dir = name;

        this.props.router.control.backend.saveProject(name, {dappfile:dappfileJSONObj.dappfile}, cb, true, dappfileJSONObj.files);
    };

    deleteProject = (e, project) => {
        e.preventDefault();
        this.props.router.control.deleteProject(project);
    };

    getProjectItems = () => {
        if(this.props.router.control) {
            const openProject = this.props.router.control.getActiveProject();
            const items=this.props.router.control.getProjects().slice(0).reverse().map((project)=>{
                const isActive = openProject === project;
                // TODO: implement icon for isActive flag.
                return (
                    <li class={style.projSwitcherItem}>
                        <div class={classNames([style.projSwitcherRow, style.container])}>
                            { isActive ? (
                                <div class={style.active}>
                                    <IconCheck />
                                </div>
                                ) : (null)
                            }
                            <a href="#" class={style.container} onClick={(e)=>{this.openProject(e, project)}}>
                                <div>{project.props.state.data.dappfile.getObj().project.info.title || ""} - </div>
                                <div>&nbsp;{project.props.state.data.dir}</div>
                            </a>
                            <div class={classNames([style.projSwitcherRowActions, style.container])}>
                                <button class="btnNoBg" onClick={(e)=>{this.openProjectConfig(e, project)}}>
                                    <IconConfigure />
                                    </button>
                                <button class="btnNoBg" onClick={(e)=>{this.downloadProject(e, project)}}>
                                    <IconDownload />
                                </button>
                                <button class="btnNoBg" onClick={(e)=>{this.deleteProject(e, project)}}>
                                    <IconTrash />
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
            <div class={classNames([style.projectMenu, "modal"])}>
                <div class={style.tabs}>
                    <div class={classNames([style.tabList, style.container])}>
                        <button class={style.tab}>
                            Personal
                        </button>
                    </div>
                    <div class={classNames([style.paneList, style.container])}>
                        <div class={style.pane}>
                            <ul class={style.projectSwitcherList}>
                                {projectItems}
                            </ul>
                        </div>
                    </div>
                </div>
                <div class={style.actions}>
                    <button class="btnNoBg" onClick={this.props.router.control._newDapp}>Create New</button>
                    <div class={style.separator} />
                    <button class="btnNoBg" onClick={this.importProject}>Import</button>
                </div>
            </div>
        )
    }
}

const ActionOpenTransactions = ( { onClick } = this.props) => {
    return (
        <div class={style.action}>
            <button class={classNames([style.container, "btnNoBg"])} onClick={onClick}>
                <IconTransactions class={style.icon} alt="Open the transactions log screen"/>
                <span>Transactions</span>
            </button>
        </div>
    )
}

ActionOpenTransactions.propTypes = {
    onClick: PropTypes.func.isRequired
}

export default class TopBar extends Component {
    constructor(props) {
        super(props);

        this.onTransactionsClicked = this.onTransactionsClicked.bind(this);
    }

    onTransactionsClicked(e) {
        e.preventDefault();
        this.props.router.control.openTransactionHistory();
    }

    render() {
        var title="";
        if(this.props.router.control) {
            const openProject = this.props.router.control.getActiveProject();
            if(openProject) {
                title = openProject.props.state.data.dappfile.getObj().project.info.title;
            }
        }
        return (
            <div class={style.topbar}>
                <img class={style.logo} src="/static/img/img-studio-logo.svg" alt="Superblocks Studio logo"></img>
                <div class={style.tools}>
                    <ActionOpenTransactions onClick={this.onTransactionsClicked}/>
                </div>
                <button class={classNames([style.projectButton, style.container, "btnNoBg"])} onClick={this.showMenu}>
                    <IconProjectSelector class={style.icon}/>
                    <span class={style.projectText}>{title}</span>
                    <IconDropdown class={classNames([style.dropDown, "dropDown"])}/>
                </button>
                {
                    this.state.showMenu ? (
                        <ProjectSelector router={this.props.router} />
                    ) : (null)
                }
                <DropdownContainer
                    class={style.elementsRight}
                    dropdownContent={<HelpDropdownDialog />}
                >
                    <HelpDropdownAction />
                </DropdownContainer>
            </div>
        );
    }
}
