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
import { DropdownContainer, Tooltip, OnlyIf } from '../../../common';
import { previewService } from '../../../../services';
import { CannotExportModal } from './CannotExportModal';
import { DownloadModal } from './DownloadModal';
import { NoExportableContentModal } from './NoExportableContentModal';
import { IEnvironment, IAccount } from '../../../../models/state';
import { TransactionType } from '../../../../models';

function getIframeSrc() {
    if (window.location.hostname === 'localhost') {
        return `${window.location.protocol}//${window.location.host}/app-view.html`;
    } else {
        return `${window.location.protocol}//${window.location.host.replace('studio', 'studio-dapp')}/app-view.html`;
    }
}

const IFRAME_ID = 'appViewIframe';

interface IProps {
    onToggleWeb3: () => void;
    onHideModals: () => void;
    tryToDownload: () => void;
    notifyTx: (transactionType: TransactionType, hash: string) => void;
    download: () => void;
    refreshContent: () => void;
    disableWeb3: boolean;
    showNoExportableContentModal: boolean;
    showCannotExportModal: boolean;
    showDownloadModal: boolean;
    selectedEnvironment: IEnvironment;
    selectedAccount: IAccount;
    isProjectLoaded: boolean;
    htmlToRender: string;
    knownWalletSeed: string;
}

export class Preview extends React.Component<IProps> {

    componentDidUpdate(prevProps: IProps) {
        const { selectedAccount, htmlToRender } = prevProps;
        const { refreshContent } = this.props;

        if (selectedAccount.name !== this.props.selectedAccount.name) {
            previewService.setAccount(this.props.selectedAccount);
            refreshContent();
        }

        if (htmlToRender !== this.props.htmlToRender) {
            this.refreshIframe();
        }
    }

    componentDidMount() {
        const { selectedAccount, selectedEnvironment, htmlToRender, knownWalletSeed, notifyTx } = this.props;
        previewService.init(htmlToRender);
        previewService.initSuperProvider(IFRAME_ID, selectedEnvironment, selectedAccount, knownWalletSeed, notifyTx);
        previewService.superProvider.attachListener();
        this.refreshIframe();
    }

    componentWillUnmount() {
        previewService.superProvider.detachListener();
        previewService.clear();
    }

    refreshIframe() {
        const { htmlToRender } = this.props;
        previewService.updateHtmlToRender(htmlToRender);
        const iframe = document.getElementById(IFRAME_ID) as any;
        iframe.contentWindow.location.replace(getIframeSrc());
    }

    tryDownload() {
        const { tryToDownload: tryDownload } = this.props;
        tryDownload();
    }

    toggleWeb3() {
        const { onToggleWeb3, refreshContent } = this.props;
        onToggleWeb3();
        refreshContent();
    }

    renderMoreDropdown() {
        return (
            <div className={style.moreContainer} onClick={ e => e.stopPropagation() }>
                <div className={style.heading}>
                    <p>Disable Web3 Provider</p>
                    <input type='checkbox'
                        checked={this.props.disableWeb3}
                        onChange={() => this.toggleWeb3()} />
                </div>
                <div className={style.description}>Simulate that Superblocks Web3 provider is not available.</div>
            </div>
        );
    }

    render() {
        const {
            isProjectLoaded,
            showCannotExportModal,
            showNoExportableContentModal,
            showDownloadModal,
            selectedEnvironment,
            onHideModals,
            download,
            refreshContent
        } = this.props;

        return (
            <OnlyIf test={isProjectLoaded}>
                <div className={style.appview}>
                    <div className={style.toolbar}>

                        <button className='btnNoBg' onClick={() => refreshContent()}>
                            <Tooltip title='Refresh Page'><IconRefresh /></Tooltip>
                        </button>

                        <button className='btnNoBg' onClick={() => this.tryDownload()}>
                            <Tooltip title='Download DApp'><IconDownloadDApp /></Tooltip>
                        </button>

                        <div className={style.urlBar}>{getIframeSrc()}</div>

                        <DropdownContainer dropdownContent={this.renderMoreDropdown()}>
                            <button className='btnNoBg'>
                                <Tooltip title='Settings'><IconMore /></Tooltip>
                            </button>
                        </DropdownContainer>

                    </div>
                    <iframe id={IFRAME_ID} src={getIframeSrc()}></iframe>
                </div>

                <OnlyIf test={showNoExportableContentModal}>
                    <NoExportableContentModal onClose={onHideModals} />
                </OnlyIf>
                <OnlyIf test={showCannotExportModal}>
                    <CannotExportModal onClose={onHideModals} />
                </OnlyIf>
                <OnlyIf test={showDownloadModal}>
                    <DownloadModal
                        environment={selectedEnvironment}
                        onClose={onHideModals}
                        onDownload={download} />
                </OnlyIf>
            </OnlyIf>
        );
    }
}
