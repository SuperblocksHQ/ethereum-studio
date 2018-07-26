import { Component } from 'preact';
import style from './style';
import classNames from 'classnames';

export default class TopBar extends Component {
    render() {
        const collaborateClasses={};
        collaborateClasses[style.icon]=true;
        collaborateClasses[style.collaborate]=true;

        return (
            <div class={style.topbar}>
                <img class={style.logo} src="/static/img/img-studio-logo.svg" alt="Superblocks Studio logo"></img>
                <span class={style.tools}>
                    <span class={style.left}>
                        <img class={style.icon} src="/static/img/icon-transactions.png" alt="Open transactions screen"></img>
                        <span>Transactions</span>
                    </span>
                    <span class={style.left}>
                        <img class={classNames(collaborateClasses)} src="/static/img/icon-collaborate.png" alt="Open the transactions screen"></img>
                        <span>Collaborate</span>
                    </span>
                </span>
                <span class={style.project}>
                    <img class={style.icon} src="/static/img/icon-project-selector.svg" alt="Open transactions screen"></img>
                    <span class={style.projecttext}>My super project</span>
                    <img class={style.dropdown} src="/static/img/icon-dropdown.svg" alt="Open transactions screen"></img>
                </span>
                <span class={style.right}>
                    <img class={style.icon} src="/static/img/icon-help.svg" alt="Open transactions screen"></img>
                    <span>Help</span>
                </span>
            </div>
        );
    }
}
