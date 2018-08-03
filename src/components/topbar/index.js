import { Component } from 'preact';
import PropTypes from 'prop-types';
import style from './style';
import classNames from 'classnames';
import {
    IconTransactions,
    IconDownload,
    IconTrash,
    IconConfigure,
    IconCollaborate,
    IconProjectSelector,
    IconDropdown,
    IconTelegram
} from '../icons';

class DropDownDialog extends Component {
    constructor() {
        super();

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
                <button class={classNames([style.container, "btnNoBg"])} onClick={this.showMenu}>
                    <img class={style.icon} src="/static/img/icon-help.svg" alt="Open transactions screen"></img>
                    <div>Help</div>
                </button>
                {
                    this.state.showMenu ? (
                        <div class={style.helpMenu}>
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
                    ) : (null)
                }
            </div>
        );
    }
}

export default class TopBar extends DropDownDialog {
    constructor() {
        super();

        this.onTransactionsClicked = this.onTransactionsClicked.bind(this);
    }

    onTransactionsClicked() {
        this.props.router.control._openAppShowPreview();
    }

    render() {
        return (
            <div class={style.topbar}>
                <img class={style.logo} src="/static/img/img-studio-logo.svg" alt="Superblocks Studio logo"></img>
                <div class={style.tools}>
                    <button class={classNames([style.left, style.container, "btnNoBg"])} onClick={this.onTransactionsClicked}>
                        <IconTransactions class={style.icon} alt="Open the transactions log screen"/>
                        <div>Transactions</div>
                    </button>
                </div>
                <button class={classNames([style.projectButton, style.container, "btnNoBg"])} onClick={this.showMenu}>
                    <IconProjectSelector class={style.icon}/>
                    <span class={style.projectText}>My super project</span>
                    <IconDropdown class={classNames([style.dropdown])}/>
                </button>
                {
                    this.state.showMenu ? (
                        <div class={style.projectMenu}>
                            <div class={style.tabs}>
                                <div class={classNames([style.tabList, style.container])}>
                                    <button class={style.tab}>
                                        Personal
                                    </button>
                                </div>
                                <div class={classNames([style.paneList, style.container])}>
                                    <div class={style.pane}>
                                        <ul class={style.projectSwitcherList}>
                                            <li class={style.projSwitcherItem}>
                                                <div class={classNames([style.projSwitcherRow, style.container])}>
                                                    <a href="#" class={style.container}>
                                                        <div>My Project - </div>
                                                        <div>&nbsp;myproject</div>
                                                    </a>
                                                    <div class={classNames([style.projSwitcherRowActions, style.container])}>
                                                        <button class="btnNoBg">
                                                            <IconConfigure />
                                                        </button>
                                                        <button class="btnNoBg">
                                                            <IconDownload />
                                                        </button>
                                                        <button class="btnNoBg">
                                                            <IconTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class={style.actions}>
                                <button class="btnNoBg">Create New</button>
                                <div class={style.separator} />
                                <button class="btnNoBg">Import</button>
                            </div>
                        </div>
                    ) : (null)
                }
                <HelpDropdownDialog class={style.right}/>
            </div>
        );
    }
}

TopBar.PropTypes = {
    onTransactionSelected: PropTypes.func.isRequired
}

// _menuTop = (level, index, item) => {
//     return (
//         <div>
//             <div>
//                 <a href="#" class={style.btn1} onClick={this._newDapp}  title="New Dapp">
//                     <FaIcon icon={iconPlus} />
//                 </a>
//                 <a href="#" class={style.btn1}  onClick={this._downloadWorkspace} title="Download Workspace">
//                     <FaIcon icon={iconDownload} />
//                 </a>
//                 <input id="wsFileInput" type="file" style="display: none;" onChange={e => this._uploadWorkspace(e)} ref={w => this.wsFileInput=w} />
//                 <a href="#" class={style.btn1}  onClick={e => this._clickWorkspace(e)} title="Upload Workspace">
//                     <FaIcon icon={iconUpload} />
//                 </a>
//             </div>
//         </div>
//     );
// };
