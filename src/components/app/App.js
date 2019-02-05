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
import Backend from '../projecteditor/control/backend';
import Modal from '../modal';
import ProjectEditor from '../projecteditor';
import { Wallet } from '../projecteditor/wallet';
import Solc from '../solc';
import EVM from '../evm';
import Networks from '../../networks';
import { previewService, ipfsService } from '../../services';
import AnalyticsDialog from '../analyticsDialog';
import OnlyIf from '../onlyIf';
import ToastContainer from "../toasts/toastcontainer";
import * as embedUtils from '../../utils/embed';

export default class App extends Component {

    state = {
        modals: [],
        isReady: false
    };

    constructor(props) {
        super(props);
        this.idCounter = 0;
        this.isImportedProject = false;
        this.backend = new Backend();

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
            },
            networks: {
                endpoints: Networks,
            },
            generateId: this.generateId,
        };
        this.knownWalletSeed =
            'butter toward celery cupboard blind morning item night fatal theme display toy';
        this.functions.wallet = new Wallet({
            functions: this.functions,
            length: 30,
        });

        // The development wallets seed is well known and the first few addresses are seeded
        // with ether in the genesis block.
        console.log(
            'Known development Ethereum wallet seed is: ' + this.knownWalletSeed
        );
    }

    componentDidMount() {
        const { notifyAppStart }  = this.props;

        // Make sure we fire this event in order to let other parst of the app configure depending
        // on the initial state (per example turning on/off analytics)
        notifyAppStart(embedUtils.isIframe());

        this._convertProjects(status => {
            this.setState({ isReady: true })
            this._init();
        });
    }

    _convertProjects = cb => {
        this.backend.convertProjects(status => {
            if (status == 1) {
                const modalData = {
                    title: 'Projects converted',
                    body: (
                        <div>
                            <div>
                                Your projects have been converted to the new
                                Superblocks Lab format.
                                <br />
                                You might need to reconfigure your accounts and
                                contract arguments due to these changes. We are
                                sorry for any inconvenience.
                            </div>
                            <div>
                                Please see the Superblocks Lab help center for
                                more information on this topic.
                            </div>
                        </div>
                    ),
                    style: { width: '680px' },
                };
                const modal = <Modal data={modalData} />;
                this.functions.modal.show({
                    cancel: () => {
                        cb(0);
                        return true;
                    },
                    render: () => {
                        return modal;
                    },
                });
            } else {
                cb(0);
            }
        });
    };

    redraw = all => {
        this.forceUpdate();
    };

    _init = () => {
        let { appVersion } = this.props;
        const modalData = {
            title: 'Loading Superblocks Lab',
            body:
                'Initializing Wallet and Ethereum Virtual Machine...',
            style: { textAlign: 'center' },
        };
        const modal = <Modal data={modalData} />;
        this.functions.modal.show({
            cancel: () => {
                return false;
            },
            render: () => {
                return modal;
            },
        });
        this.functions.compiler = new Solc({ id: this.generateId() });
        this.functions.EVM = new EVM({ id: this.generateId() });

        previewService.init(this.functions.wallet);
        ipfsService.init(this.backend);

        const fn = () => {
            if (this.functions.compiler && this.functions.EVM) {
                console.log('Superblocks Lab ' + appVersion + ' Ready.');
                this.functions.modal.close();
                this._checkIpfsOnUrl();
            } else {
                setTimeout(fn, 500);
            }
        };
        fn();
    };

    _checkIpfsOnUrl = () => {
        const a = document.location.href.match("^.*/ipfs/([a-zA-Z0-9]+)");
        if (a) {
            // TODO: pop modal about importing being processed.
            this.isImportedProject = true;
            this.props.importProjectFromIpfs(a[1]);
        }
    };

    session_start_time = () => {
        return this.session.start_time;
    };

    generateId = () => {
        return ++this.idCounter;
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
        if (index == null) index = this.state.modals.length - 1;
        var modal = this.state.modals[index];
        this.state.modals.splice(index, 1);
        this.forceUpdate();
    };

    getModal = () => {
        return this.state.modals.map((elm, index) => {
            const stl = { position: 'absolute' };
            stl['zIndex'] = index;
            if (index < this.state.modals.length - 1) stl['opacity'] = '0.33';
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
        if (modal.cancel && modal.cancel(modal) === false) return;
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

    render() {
        const { isReady } = this.state;
        const { showTrackingAnalyticsDialog } = this.props;
        const modalContent = this.getModal();

        return (
            <div id="app" className={this.getClassNames()}>
                <div id="app_content">
                    <div className="maincontent">
                        <OnlyIf test={isReady}>
                            <ProjectEditor
                                key="projedit"
                                router={this.router}
                                functions={this.functions}
                                knownWalletSeed={this.knownWalletSeed}
                                isImportedProject={this.isImportedProject}
                            />
                            <OnlyIf test={showTrackingAnalyticsDialog}>
                                <AnalyticsDialog />
                            </OnlyIf>
                            <ToastContainer />
                        </OnlyIf>
                    </div>
                </div>
                <div id="app_modal" onClick={this.modalOutside}>
                    {modalContent}
                </div>
            </div>
        );
    }
}

App.propTypes = {
    router: PropTypes.object.isRequired,
    appVersion: PropTypes.string.isRequired,
    notifyAppStart: PropTypes.func.isRequired
}
