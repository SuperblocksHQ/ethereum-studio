import { Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import style from './style';
import { DropdownContainer } from '../dropdown';
import Backend from  '../projecteditor/control/backend';
import Modal from '../modal';
import {
    IconDownload,
    IconTrash,
    IconConfigure,
    IconHelp,
    IconProjectSelector,
    IconDropdown,
    IconTelegram,
    IconCheck
} from '../icons';

const HelpDropdownAction = () => (
    <div class={style.action}>
        <button class={classNames([style.container, "btnNoBg"])}>
            <IconHelp />
            <span>Help</span>
        </button>
    </div>
);

const HelpDropdownDialog = () => (
    <div class={style.helpMenu}>
        <div class={style.title}>General</div>
        <ul>
            <li>
                <a href="https://www.superblocks.com" target="_blank" rel="noopener noreferrer">Help Center</a>
            </li>
            <li>
                <div class={style.container}>
                    <a href="https://www.superblocks.com" target="_blank" rel="noopener noreferrer">Join our Community!</a>
                    <span class={style.telegramIcon}>
                        <IconTelegram color="#0088cc"/>
                    </span>
                </div>

            </li>
            <li>
                <a href="https://www.superblocks.com" target="_blank" rel="noopener noreferrer">What’s new 🚀</a>
            </li>
        </ul>
    </div>
);

const ProjectSelector = ({ title } = props) => (
    <div class={style.action}>
        <button class="btnNoBg">
            <IconProjectSelector class={style.icon}/>
            <span class={style.projectText}>{title}</span>
            <IconDropdown class={classNames([style.dropDown, "dropDown"])}/>
        </button>
    </div>

);

class ProjectDialog extends Component {

    openProject = (e, project, cb) => {
        this.props.router.control.openProject(project, cb);
        this.props.onProjectSelected();
    };

    openProjectConfig = (e, project) => {
        e.stopPropagation();

        this.openProject(e, project, (status) => {
            if (status == 0) {
                this.props.router.control.openProjectConfig(project);
            }
        });
    };

    downloadProject = (e, project) => {
        e.stopPropagation();

        const keepState = prompt("Do you also want to save the project state (current contract addresses, ABIs, etc)?", "yes");
        if(!keepState) {
            return;
        }
        const s = keepState.toLowerCase();
        if (s != "yes" && s != "no") {
            alert("Download aborted. Yes or No answer expected.");
            return;
        }
        this.props.router.control.downloadProject(project, keepState.toLowerCase() == "yes");
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

    importProject3 = (project) => {
        const backend = new Backend();
        backend.convertProject(project, (status, project2) => {
            if (status == 1) {
                const modalData={
                    title: "Project converted",
                    body: (
                        <div>
                            <div>
                                The imported project has been converted to the new Superblocks Lab format.<br />
                                You might need to reconfigure your accounts and contract arguments due to these
                                changes. We are sorry for any inconvenience.
                            </div>
                            <div>
                                Please see the Superblocks Lab help center for more information on this topic.
                            </div>
                        </div>
                    ),
                    style: {width:"680px"},
                };
                const modal=(<Modal data={modalData} />);
                this.props.functions.modal.show({cancel:()=>{this.importProject4(project2);return true;}, render: () => {return modal;}});
            }
            else {
                this.importProject4(project);
            }
        });
    };

    importProject4 = (dappfileJSONObj) => {
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
        e.stopPropagation();

        this.props.router.control.deleteProject(project);
    };

    getProjectItems = () => {
        if (this.props.router.control) {
            const openProject = this.props.router.control.getActiveProject();

            const items = this.props.router.control
            .getProjects()
            .slice(0)
            .reverse()
            .map((project) => {
                const isActive = openProject === project;
                return (
                    <li class={style.projSwitcherItem} onClick={(e)=>{this.openProject(e, project)}}>
                        <div class={classNames([style.projSwitcherRow, style.container])}>
                            { isActive ? (
                                <div class={style.active}>
                                    <IconCheck />
                                </div>
                                ) : (null)
                            }
                            <div class={style.container}>
                                <div class={style.overflowText}>{project.props.state.data.dappfile.getObj().project.info.title || ""} - &nbsp;{project.props.state.data.dir}</div>
                            </div>
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

ProjectDialog.propTypes = {
    onProjectSelected: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    functions: PropTypes.object.isRequired
}

export default class TopBar extends Component {

    render() {
        var title="";

        if (this.props.router.control) {
            const openProject = this.props.router.control.getActiveProject();
            if (openProject) {
                title = openProject.props.state.data.dappfile.getObj().project.info.name;
            }
        }

        return (
            <div class={style.topbar}>
                <img class={style.logo} src="/static/img/img-lab-logo.svg" alt="Superblocks Lab logo"></img>
                <DropdownContainer
                    class={style.projectButton}
                    dropdownContent={<ProjectDialog functions={this.props.functions} router={this.props.router} onProjectSelected={this.props.onProjectSelected} />}
                >
                    <ProjectSelector title={title}/>
                </DropdownContainer>

                <DropdownContainer
                    class={style.actionsRight}
                    dropdownContent={<HelpDropdownDialog />} >
                        <HelpDropdownAction />
                </DropdownContainer>
            </div>
        );
    }
}

TopBar.propTypes = {
    onProjectSelected: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    functions: PropTypes.object.isRequired
}
