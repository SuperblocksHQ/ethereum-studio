// Copyright 2019 Superblocks AB
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

import React from 'react';
import style from './style.less';
import { IconRefresh, IconDownloadDApp, IconMore } from '../../../icons';
import { DropdownContainer, Tooltip } from '../../../common';
import OnlyIf from '../../../onlyIf';
import { previewService } from '../../../../services';
import { CannotExportModal } from './cannotExportModal';
import { DownloadModal } from './downloadModal';
import { NoExportableContentModal } from './noExportableContentModal';

function getIframeSrc() {
    if (window.location.hostname === 'localhost') {
        return `${window.location.protocol}//${window.location.host}/app-view.html`;
    } else {
        return `${window.location.protocol}//${window.location.host.replace('lab', 'lab-dapp')}/app-view.html`;
    }
}

const IFRAME_ID = 'appViewIframe';

export class Preview extends React.Component {
    constructor(props) {
        super(props);
        previewService.initSuperProvider(IFRAME_ID);
    }

    componentDidMount() {
        previewService.superProvider._attachListener();
    }

    componentWillUnmount() {
        previewService.superProvider._detachListener();
    }

    refresh() {
        const iframe = document.getElementById(IFRAME_ID);
        iframe.contentWindow.location.replace(getIframeSrc());
    }

    tryDownload() {
        // TODO: parameters should not be passed here, but obtained from redux app state
        this.props.onTryDownload(previewService.hasExportableContent, this.props.selectedEnvironment);
    }

    toggleWeb3Accounts() {
        this.props.onToggleWeb3Accounts();
        this.refresh();
    }

    renderMoreDropdown() {
        return (
            <div className={style.moreContainer} onClick={ e => e.stopPropagation() }>
                <div className={style.heading}>
                    <p>Disable Web3 Accounts</p>
                    <input type="checkbox"
                        checked={this.props.disableAccounts}
                        onChange={() => this.toggleWeb3Accounts()} />
                </div>
                <div className={style.description}>Simulate that no Web3 accounts are available</div>
            </div>
        );
    }

    render() {
        const isProjectOpen = Boolean(previewService.projectItem);

        return (
            <OnlyIf test={isProjectOpen}>
                <div className={style.appview}>
                    <div className={style.toolbar}>
    
                        <button className="btnNoBg" title="Refresh" onClick={() => this.refresh()}>
                            <Tooltip title="Refresh Page"><IconRefresh /></Tooltip>
                        </button>

                        <button className="btnNoBg" title="Download" onClick={() => this.tryDownload()}>
                            <Tooltip title="Download DApp"><IconDownloadDApp /></Tooltip>
                        </button>

                        <div className={style.urlBar}>{getIframeSrc()}</div>
                        
                        <DropdownContainer dropdownContent={this.renderMoreDropdown()}>
                            <button className="btnNoBg" title="Settings">
                                <Tooltip title="Settings"><IconMore /></Tooltip>
                            </button>
                        </DropdownContainer>
                        
                    </div>
                    <iframe id={IFRAME_ID} src={getIframeSrc()}></iframe>
                </div>

                {this.props.showNoExportableContentModal &&
                <NoExportableContentModal onClose={this.props.onHideModals} />
                }
                {this.props.showCannotExportModal &&
                <CannotExportModal onClose={this.props.onHideModals} />
                }
                {this.props.showDownloadModal &&
                <DownloadModal 
                    environment={this.props.selectedEnvironment}
                    onClose={this.props.onHideModals}
                    onDownload={this.props.onDownload} />
                }
            </OnlyIf>
        );
    }
}
