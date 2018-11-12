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
import style from './style.less';

export default class DevkitConsole extends Component {
    constructor(props) {
        super(props);
        this.state.consoleRows = [];
        this.state.running = false;
        this.state.buffer = '';
        this.state.channels = {
            1: [],
            2: [],
        };
        this.state.code = 0;
        this.run = this.run.bind(this);
        this.state.args = this.props.console.args || '';
        this.handleArgsChange = this.handleArgsChange.bind(this);
        this.getWait = this.getWait.bind(this);
    }

    componentDidMount() {
        if (this.props.console.autostart) {
            this.run();
        }
    }

    run(evt) {
        if (evt) evt.preventDefault();
        if (this.state.running) return;
        this.setState({ running: true });
        this.state.consoleRows = [];

        var self = this;
        var url = this.props.console.url;

        var regex = /-e ([^=]+)=([^ ]+)/g;
        var m = [];
        var params = '?';
        while ((m = regex.exec(this.state.args))) {
            params = params + m[1] + '=' + escape(m[2]) + '&';
        }
        var posargs = this.state.args.match('-- (.*)');
        if (posargs) {
            params = params + 'posargs=' + escape(posargs[1]);
        }

        var ws = new WebSocket(url + params);
        ws.onopen = function() {};
        ws.onmessage = function(evt) {
            self.bufferMessage(evt.data);
            self.decodeMessage();
            self.setState();
        };
        ws.onclose = function() {
            if (self.state.running) {
                self.done(1);
            }
        };
        ws.onerror = function() {
            if (self.state.running) {
                self.state.code = 255;
                self.done(1);
            }
        };
    }

    componentDidUpdate() {
        const node = document.getElementById('scrollBottom_' + this.props.id);
        node.scrollTop = node.scrollHeight;
    }

    bufferMessage(msg) {
        this.state.buffer = this.state.buffer + msg;
    }

    decodeMessage() {
        var m = this.state.buffer.match(/([^\n]+)\n([^\n]+)\n((.|\n)*)/);
        if (m == null) {
            return;
        }
        var channel = parseInt(m[1]);
        var channelextra = parseInt(m[2]);
        var msg = '';
        if (channel == 1 || channel == 2) {
            msg = m[3].slice(0, channelextra);
            this.addToChannel(channel, msg);
        } else if (channel == 0) {
            this.done();
        } else {
            console.log(
                'Console could not decode message buffer.',
                this.state.buffer
            );
            return;
        }
        this.state.buffer = m[3].slice(msg.length);

        if (this.state.buffer.length > 0) {
            return this.decodeMessage();
        }
    }

    done(status) {
        this.setState({ running: false });
        if (this.props.console.callback) {
            this.props.console.callback(status, this.state.code);
        } else {
            if (status == 1) {
                alert('Something went wrong with the websocket.');
            }
        }
    }

    addToChannel(channel, msg) {
        var msglist = this.state.channels[channel];
        if (
            msglist.length == 0 ||
            msglist[msglist.length - 1].msg.slice(-1).charCodeAt(0) == 10
        ) {
            var row = { msg: '', channel: channel };
            msglist.push(row);
            this.state.consoleRows.push(row);
        }
        msglist[msglist.length - 1].msg += msg;
    }

    handleArgsChange(event) {
        this.setState({ args: event.target.value });
    }

    getWait() {
        if (this.state.running && this.state.consoleRows.length == 0) {
            return <div className={style.waiting}>Loading...</div>;
        } else if (!this.state.running && this.state.consoleRows.length == 0) {
            return (
                <div className={style.ready}>
                    <p>Click Run to start</p>
                </div>
            );
        }
    }

    render() {
        const waiting = this.getWait();
        var commands = this.props.console.command.map((item, index) => {
            return <div className={style.command}>{item}</div>;
        });
        if (this.props.console.command0) {
            commands += '<div>' + this.props.console.command0 + '</div>';
        }
        const status = 'Exit code: 0 (success)';
        const scrollId = 'scrollBottom_' + this.props.id;
        return (
            <div className={style.console}>
                <div className={style.title}>{this.props.console.title}</div>
                <div className={style.heading}>
                    <div className={style.commands}>{commands}</div>
                    <div className={style.run}>
                        <a
                            disabled={this.state.running}
                            onClick={this.run}
                            href="#"
                            className="btn2"
                        >
                            {(this.state.running && 'Running') || 'Run'}
                        </a>
                    </div>
                </div>
                <div className={style.status} />
                <div className={style.terminal} id={scrollId}>
                    {waiting}
                    {this.state.consoleRows.map((row, index) => {
                        return row.msg.split('\n').map(i => {
                            var cl = style.std1;
                            if (row.channel == 2) cl = style.std2;
                            return <div className={cl}>{i}</div>;
                        });
                    })}
                </div>
            </div>
        );
    }
}
