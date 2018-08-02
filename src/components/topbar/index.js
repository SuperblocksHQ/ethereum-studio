import { Component } from 'preact';
import PropTypes from 'prop-types';
import style from './style';
import classNames from 'classnames';
import { IconTransactions, IconDownload, IconTrash, IconConfigure, IconCollaborate, IconProjectSelector, IconDropdown } from '../icons';

export default class TopBar extends Component {
    constructor() {
        super();

        this.state = {
            showMenu: false,
        }

        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.onTransactionsClicked = this.onTransactionsClicked.bind(this);
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

    onTransactionsClicked() {
        this.props.router.control._openAppShowPreview();
    }

    render() {
        return (
            <div class={style.topbar}>
                <img class={style.logo} src="/static/img/img-studio-logo.svg" alt="Superblocks Studio logo"></img>
                <div class={style.tools}>
                    <div class={classNames([style.left, style.container])} onClick={this.onTransactionsClicked}>
                        <IconTransactions class={style.icon} alt="Open the transactions log screen"/>
                        <div>Transactions</div>
                    </div>
                    <div class={classNames([style.left, style.container])}>
                        <IconCollaborate class={classNames([style.icon, style.collaborateIcon])} alt="Start collaborating"/>
                        <div>Collaborate</div>
                    </div>
                </div>
                <button class={classNames([style.projectButton, style.container])} onClick={this.showMenu}>
                    <IconProjectSelector class={style.icon}/>
                    <span class={style.projectText}>My super project</span>
                    <IconDropdown class={style.icon}/>
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
                                                    <a href="" class={style.container}>
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
                <div class={classNames([style.right, style.container])}>
                    <img class={style.icon} src="/static/img/icon-help.svg" alt="Open transactions screen"></img>
                    <div>Help</div>
                </div>
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
