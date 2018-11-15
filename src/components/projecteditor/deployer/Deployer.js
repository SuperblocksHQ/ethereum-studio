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
import styleConsole from '../style-console.less';
import style from './style.less';
import Modal from '../../modal';
import MainnetWarning from './mainnetWarning';
import DeployerRunner from '../../../deployer';
import Toolbar from '../toolbar';

export default class Deployer extends Component {

    state = {
        deployToMainnetConfirmed: false,
        consoleRows: [],
        status: ''
    }

    constructor(props) {
        super(props);

        this.id = props.id + '_deployer';
        this.props.parent.childComponent = this;
        const recompile = this.props.recompile || false;
        const redeploy = this.props.redeploy || false;

        this.deployer = new DeployerRunner(props, recompile, redeploy, this.redraw,
            this.updateStatus, this.showExternalProviderModal, this.closeExternalProviderModal, this.showMainnetWarning,
            this.props.networkPreferences, this.props.item, this.log);
    }

    componentDidMount() {
        this.deploy();
    }

    canClose = (cb) => {
        cb(0);
    }

    focus = (rePerform) => {
        if (rePerform) {
            if (!this.deployer.isRunning) {
                this.deploy();
            }
        }
    }

    updateStatus = (msg) => {
        this.setState({
            status: msg ? msg : ""
        });
    }

    onRedeployClickHandle = () => {
        this.deploy();
    }

    getHeight = () => {
        const a = document.getElementById(this.id);
        const b = document.getElementById(this.id+"_header");
        if(!a) return 99;
        return (a.offsetHeight - b.offsetHeight);
    };

    getWait = () => {
        if(this.state.consoleRows.length == 0) {
            return <div className={styleConsole.loading}>
                    <span>Loading...</span>
                </div>;
        }
    }

    redraw = () => {
        this.forceUpdate();
    }

    log = (msg, channel) => {
        this.setState(prevState => ({
            consoleRows: [...prevState.consoleRows, {msg, channel}]
        }));
    }

    showExternalProviderModal = () => {
        var modalData = {
            title: "WARNING: Invoking external account provider",
            body: "Please understand that Superblocks Lab has no power over which network is targeted when using an external provider. It is your responsibility that the network is the same as it is expected to be.",
            class: style.externalProviderWarning,
        }

        const modal=(<Modal data={modalData} />);
        this.props.functions.modal.show({cancel: () => { return false }, render: () => { return modal }});
    }

    closeExternalProviderModal = () => {
        this.props.functions.modal.close();
    }

    onDeployToMainnetConfirmed = () => {
        this.props.functions.modal.close();
        this.resolveShowMainnetWarning();
    }

    onMainnetCloseHandle = () => {
        this.props.functions.modal.close();
        this.rejectShowMainnetWarning(new Error("Mainnet deployment aborted"));
    }

    showMainnetWarning = () => {
        var self = this;
        return new Promise((resolve, reject) => {

            // NOTE: We shouldn't be doing things like this but atm I can't think any other way to
            // make this functionality work
            self.resolveShowMainnetWarning = resolve;
            self.rejectShowMainnetWarning = reject;

            const modal = (
                <MainnetWarning
                    onCloseClick={this.onMainnetCloseHandle}
                    onDeployConfirmed={this.onDeployToMainnetConfirmed}
                    />
            );
            self.props.functions.modal.show({
                cancel: () => {
                    return false;
                },
                render: () => {
                    return modal;
                }
            });
        });
    }

    deploy() {
        // Make sure to reset the state to its intial values
        this.setState({
            deployToMainnetConfirmed: false,
            consoleRows: [],
            status: ''
        },
        () => this.deployer.run());
    }

    renderContents = () => {
        const waiting = this.getWait();
        const scrollId = "scrollBottom_" + this.props.id;
        const { consoleRows } = this.state;
        return (
            <div className={styleConsole.console}>
                <div className={styleConsole.terminal} id={scrollId}>
                    {waiting}
                    {consoleRows.map((row, index) => {
                        return row.msg.split("\n").map(i => {
                            var cl = styleConsole.std1;
                            if (row.channel == 2)
                                cl = styleConsole.std2;
                            else if (row.channel == 3)
                                cl = styleConsole.std3;
                            return <div key={row} className={cl}>{i}</div>;
                        })
                    })}
                </div>
            </div>
        );
    };

    render() {
        const contents = this.renderContents();
        const height = this.getHeight();
        const maxHeight = {
            height: height + "px"
        };

        return (
          <div className="full" id={this.id}>
            <Toolbar
                id={this.id}
                status={this.state.status}
                contractPath={this.props.item.getParent().getSource()}
                onTriggerActionClick={this.onRedeployClickHandle}
                isRunning={this.deployer.isRunning}
                iconTitle="Redeploy"
                infoTitle="Deploy"
            />
            <div id={this.id+"_scrollable"} className="scrollable-y" style={maxHeight}>
                {contents}
            </div>
          </div>
        );
    }
}
