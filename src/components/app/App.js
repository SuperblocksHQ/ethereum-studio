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
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { previewService } from '../../services';
import AnalyticsDialog from '../analyticsDialog';
import OnlyIf from '../onlyIf';
import ToastContainer from "../toasts/toastcontainer";
import Dashboard from '../dashboard';
import LoadProject from '../loadProject';
import * as embedUtils from '../../utils/embed';

export default class App extends Component {

    state = {
        modals: []
    };

    constructor(props) {
        super(props);
        this.idCounter = 0;
        this.isImportedProject = false;

        this.session = {
            start_time: Date.now(),
        };

        this.router = this.props.router;
        this.router.register('app', this);

        this.functions = {
            modal: {
                show: this.showModal,
                close: this.closeModal,
                cancel: this.cancelModal,
                getCurrentIndex: this.getCurrentModalIndex,
            },
            session: {
                start_time: this.session_start_time,
            }
        };
        this.knownWalletSeed = 'butter toward celery cupboard blind morning item night fatal theme display toy';

        // The development wallets seed is well known and the first few addresses are seeded
        // with ether in the genesis block.
        console.log('Known development Ethereum seed is: ' + this.knownWalletSeed);
    }

    componentDidMount() {
        const { notifyAppStart }  = this.props;

        // Make sure we fire this event in order to let other parst of the app configure depending
        // on the initial state (per example turning on/off analytics)
        notifyAppStart(embedUtils.isIframe());

        // TODO - Make sure all this is working correctly
        this._init();
    }


    redraw = all => {
        // this.forceUpdate();
        console.error('YOoo, someone calls redraw!!!')
    };

    _init = () => {
        previewService.init(null);
    };

    session_start_time = () => {
        return this.session.start_time;
    };

    getClassNames = () => {
        return classNames({
            modals: this.state.modals.length > 0,
        });
    };

    getCurrentModalIndex = () => {
        return this.state.modals.length - 1;
    };

    showModal = modal => {
        this.state.modals.push(modal);
        this.forceUpdate();
    };

    closeModal = index => {
        if (index === null) { index = this.state.modals.length - 1; }
        var modal = this.state.modals[index];
        this.state.modals.splice(index, 1);
        this.forceUpdate();
    };

    getModal = () => {
        return this.state.modals.map((elm, index) => {
            const stl = { position: 'absolute' };
            stl['zIndex'] = index;
            if (index < this.state.modals.length - 1) { stl['opacity'] = '0.33'; }
            return (
                <div
                    key={index}
                    id={'app_modal_' + index}
                    style={stl}
                    className="full"
                    onClick={this.modalOutside}
                >
                    {elm.render()}
                </div>
            );
        });
    };

    cancelModal = e => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const index = this.state.modals.length - 1;
        var modal = this.state.modals[index];
        if (modal.cancel && modal.cancel(modal) === false) { return; }
        this.state.modals.splice(index, 1);
        this.forceUpdate();
    };

    modalOutside = e => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (e.target.id.indexOf('app_modal') === 0) {
            this.cancelModal();
        }
    };

    renderProject = ({match}) => (
        <LoadProject
            projectId={match.params.projectId}
            router={this.router}
            functions={this.functions}
            knownWalletSeed={this.knownWalletSeed}
            isImportedProject={this.isImportedProject}
        />
    )

    render() {
        const { showTrackingAnalyticsDialog } = this.props;
        const modalContent = this.getModal();

        return (
            <Router>
                <div id="app" className={this.getClassNames()}>
                    <div id="app_content">
                        <div className="maincontent">
                            <Route path="/" exact render={(props) => <Dashboard {...props} functions={this.functions} />} />
                            <Switch>
                                <Route path="/dashboard" exact render={(props) => <Dashboard {...props} functions={this.functions} />} />
                                <Route path="/:projectId" exact component={this.renderProject} />
                            </Switch>
                        </div>
                    </div>
                    <OnlyIf test={showTrackingAnalyticsDialog}>
                        <AnalyticsDialog />
                    </OnlyIf>
                    <ToastContainer />
                    <div id="app_modal" onClick={this.modalOutside}>
                        {modalContent}
                    </div>
                </div>
            </Router>
        );
    }
}

App.propTypes = {
    router: PropTypes.object.isRequired,
    appVersion: PropTypes.string.isRequired,
    notifyAppStart: PropTypes.func.isRequired
}
