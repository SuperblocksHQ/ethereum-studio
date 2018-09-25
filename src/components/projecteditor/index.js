// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import { Component } from 'preact';
import classNames from 'classnames';
import style from './style';
import Control from './control';
import Panes from './panes';
import TopBar from '../topbar';
import ContactContainer from '../contactContainer';
import TransactionLogPanel from '../blockexplorer/transactionlogPanel';
import { IconTransactions, IconClose } from '../icons';

export default class ProjectEditor extends Component {

    state = {
        controlPanelWidth: 280,
        draggin: false,
        showTransactions: false,
    }

    constructor(props) {
        super(props);

        this.props.router.register("main", this);

        // Mute defalt ctrl-s behavior.
        window.addEventListener("keydown", function(e) {
            if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
            }
        }, false);
    }

    // we could get away with not having this (and just having the listeners on
    // our div), but then the experience would be possibly be janky. If there's
    // anything w/ a higher z-index that gets in the way, then you're toast,
    // etc.
    componentDidUpdate(props, state) {
        if (this.state.dragging && !state.dragging) {
            document.addEventListener('mousemove', this.onMouseMove)
            document.addEventListener('mouseup', this.onMouseUp)
        } else if (!this.state.dragging && state.dragging) {
            document.removeEventListener('mousemove', this.onMouseMove)
            document.removeEventListener('mouseup', this.onMouseUp)
        }
    }

    redraw = (all) => {
        if(this.props.router.control) {
            this.props.router.control.redraw();
        }
        if(this.props.router.app) {
            this.props.router.app.redraw(all);
        }
        if(this.props.router.panes) {
            this.props.router.panes.redraw(all);
        }
    }

    onMouseMove = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const { dragging } = this.state;
        const maxSize = screen.width * 0.35;
        if (!dragging) return;
        if (e.pageX < maxSize) {
            this.setState({
                controlPanelWidth: e.pageX
            });
        } else if (e.pageX >= maxSize) {
            return null;
        } else {
            this.onMouseUp(e);
        }
    }

    onMouseUp = (e) => {
        e.stopPropagation();
        e.preventDefault();

        this.setState({ dragging: false });
    }

    onMouseDown = (e) => {
        e.stopPropagation();
        e.preventDefault();

        // only left mouse button
        if (e.button !== 0) return;
        this.setState({
            dragging: true,
        });
    }

    onShowHideTransactionsClicked = () => {
        this.setState({
            showTransactions: !this.state.showTransactions
        });
        this.redraw(true);
    }

    onProjectSelectedHandle = () => {
        this.setState({
            showTransactions: false
        });
    }

    render() {
        var endpoint="";
        var project;
        if (this.props.router && this.props.router.control) {
            project = this.props.router.control && this.props.router.control.getActiveProject();
            if (project) {
                const network = project.props.state.data.env;
                endpoint = (this.props.functions.networks.endpoints[network] || {}).endpoint;
            }
        }
        const { controlPanelWidth, showTransactions } = this.state;
        return (
            <div class={style.projecteditor} id="main_container">
                <TopBar router={this.props.router} functions={this.props.functions} onProjectSelected={this.onProjectSelectedHandle} />
                <div style="display: flex; height: 100%">
                    <div key="main_control" id="main_control" class={style.control} style={{width: controlPanelWidth}}>
                        <Control router={this.props.router} functions={this.props.functions} />
                        <ContactContainer />
                    </div>
                    <span class="resizer vertical" onMouseDown={this.onMouseDown}></span>
                    <div style="position: relative; width: 100%">
                        <div key="main_panes" id="main_panes" class={style.panescontainer} >
                            <Panes router={this.props.router} functions={this.props.functions} isActionPanelShowing={showTransactions} />
                            {
                                showTransactions ?
                                    <div class={style.actionContainer} >
                                        <div class={style.header}>
                                            <span class={style.title}>Transactions History</span>
                                            <button class={classNames([style.icon, "btnNoBg"])} onClick={this.onShowHideTransactionsClicked}>
                                                <IconClose />
                                            </button>
                                        </div>
                                        <TransactionLogPanel router={this.props.router} />
                                    </div>
                                : null
                            }
                        </div>
                        <div class={style.actionPanel}>
                            <div class={style.actions}>
                                <button class={classNames([style.action, "btnNoBg"])} onClick={this.onShowHideTransactionsClicked}>
                                    <IconTransactions />
                                    <span class={style.verticalText}>Transactions</span>
                                </button>
                            </div>
                        </div>
                        <div class="bottom-status-bar">
                            <span class="left">
                                <span class="note">Note</span>
                                <span class="note-text">All files are stored in the browser only, download to backup</span>
                            </span>
                            <span class="right">{endpoint}</span>
                        </div>
                </div>
                </div>
            </div>
        );
    }
}
