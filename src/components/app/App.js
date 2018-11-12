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

import Backend from '../projecteditor/control/backend';
import Modal from '../modal';
import ProjectEditor from '../projecteditor';
import { Wallet } from '../projecteditor/wallet';
import Solc from '../solc';
import EVM from '../evm';

export default class App extends Component {

    state = {
        modals: [],
        isReady: false
    }

    constructor(props) {
        super(props);
        this.idCounter = 0;

        this.session = {
            start_time: Date.now(),
        };

        // Map network to endpoint.
        const endpoints = {
            browser: {
                endpoint: 'http://superblocks-browser',
                chainId: undefined,
                interval: 1000,
            },
            custom: {
                endpoint: 'http://localhost:8545/',
                chainId: undefined,
                interval: 2000,
            },
            infuranet: {
                endpoint: 'https://infuranet.infura.io/',
                chainId: 5810,
                interval: 5000,
            },
            kovan: {
                endpoint: 'https://kovan.infura.io/',
                chainId: 42,
                interval: 5000,
            },
            mainnet: {
                endpoint: 'https://mainnet.infura.io/',
                chainId: 1,
                interval: 10000,
            },
            ropsten: {
                endpoint: 'https://ropsten.infura.io/',
                chainId: 3,
                interval: 2500,
            },
            rinkeby: {
                endpoint: 'https://rinkeby.infura.io/',
                chainId: 4,
                interval: 2500,
            },
        };

        // Used to communicate between components, events is probably a better way of doing this.
        this.router = {
            register: this.register,
        };

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
                endpoints: endpoints,
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
        this._convertProjects(status => {
            this.setState({ isReady: true })
            this._init();
        });
    }

    _convertProjects = cb => {
        const backend = new Backend();
        backend.convertProjects(status => {
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

    register = (name, obj) => {
        this.router[name] = obj;
    };

    _init = () => {
        let { showSplash, appVersion } = this.props;
        const modalData = {
            title: 'Loading Superblocks Lab',
            body:
                'Initializing Wallet, Solidity compiler and Ethereum Virtual Machine...',
            style: { textAlign: 'center' },
        };
        var walletSeeded = false;
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

        // Need to init the compiler and EVM
        this.functions.compiler.init();
        this.functions.EVM.init();

        this.functions.wallet.openWallet(
            'development',
            this.knownWalletSeed,
            () => {
                walletSeeded = true;
            }
        );

        const fn = () => {
            if (this.functions.compiler.isReady()
                && this.functions.EVM.isReady()
                && walletSeeded) {
                console.log('Superblocks Lab ' + appVersion + ' Ready.');

                this.functions.modal.close();

                if (showSplash) {
                    this._showSplash();
                }
            } else {
                setTimeout(fn, 500);
            }
        };
        fn();
    };

    _showSplash = () => {
        let { showSplashNoMore } = this.props;

        const body = (
            <div className="splash">
                <p className="splash_text">
                    Let's watch a short video to help you get started.
                </p>
                <p className="splash_video">
                    <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube-nocookie.com/embed/KSF24hkf0-o?rel=0"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    />
                </p>
                <p className="splash_cancel">
                    <a
                        href="#"
                        onClick={() => {
                            // Idealy this should be inside the action and not here.
                            this.functions.modal.cancel();
                            showSplashNoMore();
                        }}
                    >
                        No thanks
                    </a>
                </p>
            </div>
        );
        const modalData = {
            title: 'Welcome to Superblocks Lab!',
            body: body,
            style: {
                width: '680px',
                xbackgroundColor: '#73618b',
                xcolor: '#fef7ff',
            },
        };
        const modal = <Modal data={modalData} />;
        this.functions.modal.show({
            render: () => {
                return modal;
            },
        });
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
        const modalContent = this.getModal();
        return (
            <div id="app" className={this.getClassNames()}>
                <div id="app_content">
                    <div className="maincontent">
                        {isReady && (
                            <ProjectEditor
                                key="projedit"
                                router={this.router}
                                functions={this.functions}
                            />
                        )}
                    </div>
                </div>
                <div id="app_modal" onClick={this.modalOutside}>
                    {modalContent}
                </div>
            </div>
        );
    }
}
