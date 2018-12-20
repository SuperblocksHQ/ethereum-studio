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

import React, { Component } from 'react';
import classNames from 'classnames';
import style from './style.less';
import Control from './control';
import Panes from './panes';
import TopBar from '../topbar';
import BottomBar from '../bottomBar';
import ContactContainer from '../contactContainer';
import TransactionLogPanel from '../blockexplorer/transactionlogPanel';
import { IconTransactions, IconClose } from '../icons';

export default class ProjectEditor extends Component {
    state = {
        controlPanelWidth: 280,
        minSize: 280,
        dragging: false
    }

    constructor(props) {
        super(props);

        this.props.router.register('main', this);

        // Mute defalt ctrl-s behavior.
        window.addEventListener(
            'keydown',
            function(e) {
                if (
                    e.keyCode == 83 &&
                    (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)
                ) {
                    e.preventDefault();
                }
            },
            false
        );
    }

    // we could get away with not having this (and just having the listeners on
    // our div), but then the experience would be possibly be janky. If there's
    // anything w/ a higher z-index that gets in the way, then you're toast,
    // etc.
    componentDidUpdate(props, state) {
        if (this.state.dragging && !state.dragging) {
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
        } else if (!this.state.dragging && state.dragging) {
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);
        }
    }

    redraw = all => {
        if (this.props.router.control) {
            this.props.router.control.redraw();
        }
        if (this.props.router.app) {
            this.props.router.app.redraw(all);
        }
        if (this.props.router.panes) {
            this.props.router.panes.redraw(all);
        }
        this.forceUpdate();
    }

    onMouseMove = e => {
        e.stopPropagation();
        e.preventDefault();
        const { dragging, minSize } = this.state;
        const maxSize = screen.width * 0.35;
        if (!dragging) return;
        if (e.pageX < maxSize && e.pageX > minSize) {
            this.setState({
                controlPanelWidth: e.pageX
            });
        } else if (e.pageX <= minSize - 150) {
            this.setState({
                controlPanelWidth: 0
            });
        } else if (e.pageX >= maxSize || e.pageX <= minSize) {
            return null;
        } else {
            this.onMouseUp(e);
        }
    }

    onMouseUp = e => {
        e.stopPropagation();
        e.preventDefault();

        this.setState({ dragging: false });
    };

    onMouseDown = e => {
        e.stopPropagation();
        e.preventDefault();

        // only left mouse button
        if (e.button !== 0) return;
        this.setState({
            dragging: true,
        });
    };

    onDoubleClick = e => {
        e.stopPropagation();
        e.preventDefault();
        const { minSize } = this.state;

        // only left mouse button
        if (e.button !== 0) return;

        this.setState({
            controlPanelWidth: minSize
        });
    }

    onShowHideTransactionsClicked = () => {
        const { toggleTransactionsHistoryPanel } = this.props;
        toggleTransactionsHistoryPanel();
    };

    onProjectSelectedHandle = () => {
        const { closeTransactionsHistoryPanel } = this.props;
        closeTransactionsHistoryPanel();
    };

    render() {
        var endpoint = '';
        var project;
        if (this.props.router && this.props.router.control) {
            project =
                this.props.router.control &&
                this.props.router.control.getActiveProject();
            if (project) {
                const network = project.getEnvironment();
                endpoint = (
                    this.props.functions.networks.endpoints[network] || {}
                ).endpoint;
            }
        }
        const { controlPanelWidth } = this.state;
        const { displayTransactionsPanel } = this.props;
        return (
            <div className={style.projecteditor} id="main_container">
                <TopBar
                    router={this.props.router}
                    functions={this.props.functions}
                    onProjectSelected={this.onProjectSelectedHandle}
                />
                <div style={{display: "flex", height: "100%"}}>
                    <div
                        key="main_control"
                        id="main_control"
                        className={style.control}
                        style={{ width: controlPanelWidth }}
                    >
                        <Control
                            router={this.props.router}
                            functions={this.props.functions}
                        />
                        <ContactContainer />
                    </div>
                    <span
                        className="resizer vertical"
                        onMouseDown={this.onMouseDown}
                        onDoubleClick={this.onDoubleClick}
                    />
                    <div style={{ position: "relative", width: "100%" }}>
                        <div
                            key="main_panes"
                            id="main_panes"
                            className={style.panescontainer}
                        >
                            <Panes
                                router={this.props.router}
                                functions={this.props.functions}
                                isActionPanelShowing={displayTransactionsPanel}
                            />
                            {displayTransactionsPanel ? (
                                <div className={style.actionContainer}>
                                    <div className={style.header}>
                                        <div className={style.panelIcon}>
                                            <IconTransactions/>
                                        </div>
                                        <span className={style.title}>
                                            Transactions History
                                        </span>
                                        <button
                                            className={classNames([
                                                style.icon,
                                                'btnNoBg',
                                            ])}
                                            onClick={this.onShowHideTransactionsClicked}
                                        >
                                            <IconClose />
                                        </button>
                                    </div>
                                    <TransactionLogPanel
                                        router={this.props.router}
                                    />
                                </div>
                            ) : null}
                        </div>
                        <div className={style.actionPanel}>
                            <div className={style.actions}>
                                <button
                                    className={classNames([
                                        style.action,
                                        'btnNoBg',
                                    ])}
                                    onClick={this.onShowHideTransactionsClicked}
                                >
                                    <IconTransactions />
                                    <span className={style.verticalText}>
                                        Transactions
                                    </span>
                                </button>
                            </div>
                        </div>
                        <BottomBar
                            endpoint={endpoint}
                        />
                </div>
                </div>
            </div>
        );
    }
}
