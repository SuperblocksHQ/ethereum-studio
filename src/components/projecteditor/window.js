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
import classnames from 'classnames';
import style from './style.less';
import { Editor, ContractEditor, ProjectSettings, AccountEditor } from './editors';
import Compiler from './compiler';
import Deployer from './deployer';
import TutorialsManual from '../tutorials/manual';
import TutorialsOnline from '../tutorials/online';
import ContractInteraction from './contractinteraction';
import Welcome from './welcome';
import { IconClose } from '../icons';

export class WindowComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.obj.component = this;
    }

    redraw = () => {
        this.forceUpdate();
    };

    render() {
        const sub = this.props.obj.renderSub();
        return (
            <div key="window" className="full">
                <button
                    className={classnames([style.close_btn, 'btnNoBg'])}
                    onClick={this.props.obj.close}
                    title="Close"
                >
                    <IconClose />
                </button>
                {sub}
            </div>
        );
    }
}

export class Window {
    constructor(props) {
        this.props = props;
        this.subId = 'winitem_' + this.props.item.getId();
        this.component;
        this.childComponent; // Optionally registered by the sub component.
    }

    getItemId = () => {
        return this.props.item.getId();
    };

    focus = (rePerform, cb) => {
        if (cb) {
            this.callback = cb;
        }
        if (this.childComponent && this.childComponent.focus)
            this.childComponent.focus(rePerform);
    };

    _clickedUpon = () => {
        if (this.props.parent.activeWindowId != this.props.item.getId()) {
            this.props.parent.focusWindow(this.props.item.getId());
            this.props.parent.props.parent.redraw();
        }
    };

    renderSub = () => {
        if (this.props.item.getType() == 'file') {
            return (
                <div
                    className="full"
                    onClick={e => {
                        this._clickedUpon();
                    }}
                >
                    <Editor
                        id={this.subId}
                        key={this.subId}
                        router={this.props.router}
                        item={this.props.item}
                        parent={this}
                    />
                </div>
            );
        } else if (
            this.props.item.getType() == 'contract' &&
            this.props.item.getType2() == 'configure'
        ) {
            return (
                <ContractEditor
                    id={this.subId}
                    key={this.subId}
                    item={this.props.item}
                    parent={this}
                    router={this.props.router}
                />
            );
        } else if (this.props.item.getType() == 'project') {
            return (
                <ProjectSettings
                    id={this.subId}
                    key={this.subId}
                    item={this.props.item}
                    parent={this}
                    router={this.props.router}
                />
            );
        } else if (
            this.props.item.getType() == 'contract' &&
            this.props.item.getType2() == 'compile'
        ) {
            return (
                <div
                    className="full"
                    onClick={e => {
                        this._clickedUpon();
                    }}
                >
                    <Compiler
                        type="contract_compile"
                        id={this.subId}
                        key={this.subId}
                        functions={this.props.functions}
                        item={this.props.item}
                        parent={this}
                        router={this.props.router}
                    />
                </div>
            );
        } else if (
            this.props.item.getType() == 'contract' &&
            this.props.item.getType2() == 'deploy'
        ) {
            return (
                <div
                    className="full"
                    onClick={e => {
                        this._clickedUpon();
                    }}
                >
                    <Deployer
                        type="contract_deploy"
                        id={this.subId}
                        key={this.subId}
                        item={this.props.item}
                        functions={this.props.functions}
                        parent={this}
                        router={this.props.router}
                    />
                </div>
            );
        } else if (this.props.item.getType() == 'account') {
            return (
                <AccountEditor
                    id={this.subId}
                    key={this.subId}
                    item={this.props.item}
                    parent={this}
                    router={this.props.router}
                    functions={this.props.functions}
                />
            );
        } else if (
            this.props.item.getType() == 'tutorials' &&
            this.props.item.getType2() == 'manual'
        ) {
            return (
                <TutorialsManual
                    id={this.subId}
                    parent={this}
                    router={this.props.router}
                    functions={this.props.functions}
                />
            );
        } else if (
            this.props.item.getType() == 'tutorials' &&
            this.props.item.getType2() == 'online'
        ) {
            return (
                <TutorialsOnline
                    id={this.subId}
                    parent={this}
                    router={this.props.router}
                    functions={this.props.functions}
                />
            );
        } else if (
            this.props.item.getType() == 'contract' &&
            this.props.item.getType2() == 'interact'
        ) {
            return (
                <ContractInteraction
                    id={this.subId}
                    parent={this}
                    item={this.props.item}
                    router={this.props.router}
                    functions={this.props.functions}
                />
            );
        } else if (
            this.props.item.getType() == 'info' &&
            this.props.item.getType2() == 'welcome'
        ) {
            return <Welcome router={this.props.router} />;
        }
    };

    close = e => {
        if (e) e.preventDefault();
        this.props.parent.closeWindow(this.getItemId());
    };

    canClose = (cb, silent) => {
        if (this.childComponent && this.childComponent.canClose) {
            this.childComponent.canClose(status => {
                cb(status);
            }, silent);
            return;
        }
        cb(0);
    };

    getTitle = () => {
        if (this.props.item.getType() == 'contract') {
            switch (this.props.item.getType2()) {
                case 'configure':
                case 'interact':
                case 'compile':
                case 'deploy':
                    return this.props.item.props.state.__parent.props.state.title;
            }
        } else if (this.props.item.getType() === 'project') {
            return this.props.item.getHeaderTitle();
        }

        if (this.props.item.props.state.title)
            return this.props.item.props.state.title;

        if (this.childComponent && this.childComponent.getTitle)
            return this.childComponent.getTitle();

        return "<no name>";
    };

    /**
     * Returns file id if file is diplayed in the window
     */
    getFileId = () => {
        return this.props.item.getType() == 'file'
            ? this.props.item.props.state.id
            : null;
    };

    getIcon = () => {
        return this.props.item.getIcon();
    };

    redraw = props => {
        if (this.component) this.component.redraw();
        if (this.childComponent && this.childComponent.redraw) this.childComponent.redraw(props);
    };
}
