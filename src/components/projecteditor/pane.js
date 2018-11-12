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
import { Window, WindowComponent } from './window';

const paneDimensions = {
    default: {
        height: '50%',
        width: '50%'
    },
    onlyHeight: {
        height: '50%',
    }
}

export class PaneComponent extends Component {
    constructor(props) {
        super(props);
        this.obj = props.obj;
    }

    componentDidMount() {
        this.obj.component = this;
    }

    redraw = () => {
        this.forceUpdate();
    };

    render() {
        const windows = this.obj.renderWindows();
        return (
            <div key="windows" className="full">
                {windows}
            </div>
        );
    }
}

export class Pane {
    constructor(props) {
        this.props = props;
        this.id = props.id;
        this.windows = [];
        this.component;
        this.activeWindowId = null;
    }

    windowsCount = () => {
        return this.windows.length;
    };

    addWindow = props => {
        if (props.item.props.state._tag) {
            // Check if a window with the tag already exists,
            // if so try to close it.
            var win = this.getWindowByTag(props.item.props.state._tag);
            if (win) {
                this._closeWindow(win.getItemId());
            }
        }
        props.parent = this;
        var win = new Window(props);
        if (win) {
            this.windows.push(win);
            /*if(this.windows.length==1)*/ this.activeWindowId = win.getItemId();
            return win.getItemId();
        }
    };

    closeAll = (cb, silent) => {
        //                                 _       _
        // A recursive callback function... \_(~)_/
        const fn = (status, cb) => {
            if (status != 0) {
                cb(status);
                return;
            }
            if (this.windows.length == 0) {
                cb(0);
                return;
            }
            const win = this.windows[0];
            this.closeWindow(
                win.getItemId(),
                status => {
                    fn(status, cb);
                },
                silent
            );
        };
        fn(0, cb);
    };

    closeWindow = (winId, cb, silent) => {
        if (silent) {
            // On silent we don't check, we just close the window.
            this._closeWindow(winId);
            if (cb) cb(0);
            return;
        }

        // Check if window can close
        const win = this.getWindow(winId);
        win.canClose(status => {
            if (status == 0) {
                this._closeWindow(winId);
            }
            if (cb) cb(status);
        }, silent);
    };

    _closeWindow = winId => {
        this.windows = this.windows.filter(obj => {
            return obj.getItemId() != winId;
        });
        if (this.windows.length > 0) {
            this.focusWindow(this.windows[0].getItemId());
        } else {
            this.props.parent.closePane(this.id);
        }
        this.props.parent.redraw();
    };

    focusWindow = (winId, rePerform, cb) => {
        this.activeWindowId = winId;
        this.getWindow(winId).focus(rePerform, cb);
    };

    getWindow = id => {
        var win = null;
        for (var winIndex = 0; winIndex < this.windows.length; winIndex++) {
            var win2 = this.windows[winIndex];
            if (win2.getItemId() == id) {
                win = win2;
                break;
            }
        }
        return win;
    };

    getWindowByTag = tag => {
        var win = null;
        for (var winIndex = 0; winIndex < this.windows.length; winIndex++) {
            var win2 = this.windows[winIndex];
            if (win2.props.item.props.state._tag == tag) {
                win = win2;
                break;
            }
        }
        return win;
    };

    getWindowByItem = item => {
        var win = null;
        for (var winIndex = 0; winIndex < this.windows.length; winIndex++) {
            var win2 = this.windows[winIndex];
            //if(win2.keys.length==keys.length && win2.keys.every((v,i)=> v === keys[i])) {
            if (win2.getItemId() == item.getId()) {
                win = win2;
                break;
            }
        }
        return win;
    };

    getActiveWindow = () => {
        return this.getWindow(this.activeWindowId);
    };

    redraw = props => {
        for (var winIndex = 0; winIndex < this.windows.length; winIndex++) {
            var win = this.windows[winIndex];
            win.redraw(props);
        }
        if (this.component) this.component.redraw();
    };

    getTitle = () => {
        var win = this.getActiveWindow();
        if (win) {
            return win.getTitle();
        }
        return '[ untitled ]';
    };

    getIcon = () => {
        var win = this.getActiveWindow();
        if (win) {
            return win.getIcon();
        }
    };

    _naiveLayout = () => {
        const default1 = style.window;
        const height = 100 / this.windows.length || 1;
        const html = this.windows.map((win, index) => {
            const cls = {};
            cls[default1] = true;
            const key = 'win_' + win.getItemId();
            const stl = { height: height + '%' };
            return (
                <div style={stl} key={key} className={classnames(cls)}>
                    <WindowComponent obj={win} />
                </div>
            );
        });
        return <div className="full">{html}</div>;
    };

    _tripleLayout = () => {
        const wins = this.windows.concat();
        wins.sort((a, b) => {
            const tagA = a.props.item.props.state._tag || 0;
            const tagB = b.props.item.props.state._tag || 0;
            return tagA - tagB;
        });
        const default1 = style.window;
        const cls = {};
        cls[default1] = true;
        const key1 = 'win_' + wins[0].getItemId();
        const key2 = 'win_' + wins[1].getItemId();
        const key3 = 'win_' + wins[2].getItemId();
        const html = (
            <div className="full">
                <div style={paneDimensions.onlyHeight} key={key1} className={classnames(cls)}>
                    <WindowComponent obj={wins[0]} />
                </div>
                <div
                    style={paneDimensions.default}
                    key={key2}
                    className={classnames(cls)}
                >
                    <WindowComponent obj={wins[1]} />
                </div>
                <div
                    style={paneDimensions.default}
                    key={key3}
                    className={classnames(cls)}
                >
                    <WindowComponent obj={wins[2]} />
                </div>
            </div>
        );
        return html;
    };

    _quadrupleLayout = () => {
        const wins = this.windows.concat();
        wins.sort((a, b) => {
            const tagA = a.props.item.props.state._tag || 0;
            const tagB = b.props.item.props.state._tag || 0;
            return tagA - tagB;
        });
        const default1 = style.window;
        const cls = {};
        cls[default1] = true;
        const key1 = 'win_' + wins[0].getItemId();
        const key2 = 'win_' + wins[1].getItemId();
        const key3 = 'win_' + wins[2].getItemId();
        const key4 = 'win_' + wins[3].getItemId();
        const html = (
            <div className="full">
                <div
                    style={paneDimensions.default}
                    key={key1}
                    className={classnames(cls)}
                >
                    <WindowComponent obj={wins[0]} />
                </div>
                <div
                    style={paneDimensions.default}
                    key={key2}
                    className={classnames(cls)}
                >
                    <WindowComponent obj={wins[1]} />
                </div>
                <div
                    style={paneDimensions.default}
                    key={key3}
                    className={classnames(cls)}
                >
                    <WindowComponent obj={wins[2]} />
                </div>
                <div
                    style={paneDimensions.default}
                    key={key4}
                    className={classnames(cls)}
                >
                    <WindowComponent obj={wins[3]} />
                </div>
            </div>
        );
        return html;
    };

    renderWindows = () => {
        if (this.windows.length <= 2) return this._naiveLayout();
        if (this.windows.length == 3) return this._tripleLayout();
        if (this.windows.length == 4) return this._quadrupleLayout();
        return this._naiveLayout();
    };
}
