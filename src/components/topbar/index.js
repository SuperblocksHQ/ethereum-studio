import { Component } from 'preact';
import PropTypes from 'prop-types';
import style from './style';
import classNames from 'classnames';
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

class DropDownDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showMenu: false,
        }

        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }

    showMenu(event) {
        event.preventDefault();
        event.stopPropagation();

        this.setState({ showMenu: true }, () => {
            document.addEventListener('click', this.closeMenu);
        });
      }

    closeMenu() {
        this.setState({ showMenu: false }, () => {
            document.removeEventListener('click', this.closeMenu);
        });
    }
}

class HelpDropdownDialog extends DropDownDialog {
    render() {
        let { ...props } = this.props;

        return (
            <div {...props}>
                <div class={style.action}>
                    <button class={classNames([style.container, "btnNoBg"])} onClick={this.showMenu}>
                        <IconHelp />
                        <span>Help</span>
                    </button>
                </div>
                <div class={classNames([style.helpMenu], {[style.show]: this.state.showMenu })}>
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
            </div>
        );
    }
}

class ProjectSelector extends Component {

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
                    <button class="btnNoBg">Import</button>
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

export default class TopBar extends DropDownDialog {
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
                <HelpDropdownDialog class={style.elementsRight}/>
            </div>
        );
    }
}
