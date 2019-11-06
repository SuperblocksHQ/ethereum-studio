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
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AnalyticsDialog from '../analyticsDialog';
import { OnlyIf } from '../common';
import ToastContainer from '../toasts/toastcontainer';
import LoadProject from '../loadProject';
import * as embedUtils from '../../utils/embed';
import ModalContainer from '../common/modal/modalContainer';
import { LogLevel } from '../../models';
import ProjectEditor from '../projectEditor';

interface IProps {
    showTrackingAnalyticsDialog: boolean;
    isTemplateModalShowing: boolean;
    router: any;
    knownWalletSeed: string;
    notifyAppStart: (isIframe: boolean) => void;
    addMessageLogRow: (logLevel: LogLevel, msg: string) => void;
}

export default class App extends Component<IProps> {
    isImportedProject: boolean;
    router: any;
    functions: {
        session: {
            start_time: number;
        }
    };

    constructor(props: IProps) {
        super(props);

        this.isImportedProject = false;
        this.router = this.props.router;
        this.router.register('app', this);

        this.functions = {
            session: {
                start_time: Date.now(),
            }
        };
    }

    componentDidMount() {
        const { notifyAppStart, knownWalletSeed, addMessageLogRow }  = this.props;

        // The development wallets seed is well known and the first few addresses are seeded
        // with ether in the genesis block.
        addMessageLogRow(LogLevel.LOG, 'Known development Ethereum seed is: ' + knownWalletSeed);

        // Make sure we fire this event in order to let other parst of the app configure depending
        // on the initial state (per example turning on/off analytics)
        notifyAppStart(embedUtils.isIframe());
    }

    renderProject = ({ match }: any) => {
        const { knownWalletSeed } = this.props;
        return (
            <LoadProject
                projectIdToLoad={match.params.projectId}
                knownWalletSeed={knownWalletSeed}
            />
        );
    }

    render() {
        const { showTrackingAnalyticsDialog, isTemplateModalShowing } = this.props;

        return (
            <Router>
                <div id='app'>
                    <div id='app_content'>
                        <div className='maincontent'>
                            <Route path='/' exact render={(props) => <ProjectEditor showTemplateModal={true} {...props} />} />
                            <Switch>
                                <Route path='/:projectId' exact component={this.renderProject} />
                            </Switch>
                        </div>
                    </div>
                    <OnlyIf test={showTrackingAnalyticsDialog && !isTemplateModalShowing}>
                        <AnalyticsDialog />
                    </OnlyIf>
                    <ToastContainer />
                    <ModalContainer />
                </div>
            </Router>
        );
    }
}
