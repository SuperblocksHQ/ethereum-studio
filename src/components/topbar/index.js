import { Component } from 'preact';
import PropTypes from 'prop-types';
import style from './style';
import classNames from 'classnames';
import { IconDownload, IconTrash, IconConfigure } from '../icons';

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

        this.setState({ showMenu: true });
        // this.setState({ showMenu: true }, () => {
        //   document.addEventListener('click', this.closeMenu);
        // });
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
                        <img class={style.icon} src="/static/img/icon-transactions.png" alt="Open transactions screen"></img>
                        <div>Transactions</div>
                    </div>
                    <div class={classNames([style.left, style.container])}>
                        <img class={classNames([style.icon, style.collaborateIcon])} src="/static/img/icon-collaborate.png" alt="Open the transactions screen"></img>
                        <div>Collaborate</div>
                    </div>
                </div>
                <div class={classNames([style.project, style.container])} onClick={this.showMenu}>
                    <img class={style.icon} src="/static/img/icon-project-selector.svg" alt="Open transactions screen"></img>
                    <div class={style.projectText}>My super project</div>
                    <img class={style.dropdown} src="/static/img/icon-dropdown.svg" alt="Open transactions screen"></img>

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
                                                            <div>myproject</div>
                                                        </a>
                                                        <div class={classNames([style.projSwitcherRowActions, style.container])}>
                                                            <button>
                                                                <IconConfigure />
                                                            </button>
                                                            <button>
                                                                <IconDownload />
                                                            </button>
                                                            <button>
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
                                    <a href="">Create New</a>
                                    <div class={style.separator} />
                                    <a href="">Import</a>
                                </div>
                            </div>
                        ) : (null)
                    }

                </div>
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
