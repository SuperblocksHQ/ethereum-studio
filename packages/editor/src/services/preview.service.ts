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

import SuperProvider from '../components/superProvider';
import Networks from '../networks';
import { IEnvironment, IAccount } from '../models/state';
import { TransactionType } from '../models';

// let exportableDappHtml: string;
let iframeId: string;
let disableAccounts = false;

export const previewService = {
    superProvider: <any>null,
    selectedEnvironment: <IEnvironment | null>null,
    selectedAccount: <IAccount | null>null,
    htmlToRender: <string | null>null,

    handleMessage: (e: any) => {
        if (e.data.type === 'window-ready') {
            // // exportableDappHtml = builtProject.exportableContent;
            if (e.source) {
                e.source.postMessage({ type: 'set-content', payload: previewService.htmlToRender }, '*');
                previewService.superProvider.initIframe(document.getElementById(iframeId));
            }
        }
    },

    init(htmlToRender: string) {
        this.htmlToRender = htmlToRender;
        window.addEventListener('message', this.handleMessage);
    },

    updateHtmlToRender(htmlToRender: string) {
        this.htmlToRender = htmlToRender;
    },

    clear() {
        window.removeEventListener('message', this.handleMessage);
    },

    initSuperProvider(_iframeId: string, environment: IEnvironment, account: IAccount, knownWalletSeed: string, notifyTx: (transactionType: TransactionType, hash: string) => void) {
        iframeId = _iframeId;
        this.superProvider = new SuperProvider(iframeId, environment, account, knownWalletSeed, (hash: string, endpoint: string) => {
            notifyTx(TransactionType.Preview, hash);
        });
    },

    setAccount(account: IAccount) {
        this.selectedAccount = account;
        if (this.superProvider) {
            this.superProvider.setAccount(account);
        }
    },

    setEnvironment(environment: IEnvironment) {
        this.selectedEnvironment = environment;
        if (this.superProvider) {
            this.superProvider.setEnvironment(environment);
        }
    },

    get disableAccounts() { return disableAccounts; },
    set disableAccounts(value) { disableAccounts = value; },

    // get hasExportableContent() { return Boolean(exportableDappHtml); },

    downloadDapp() {
        // if (!exportableDappHtml) {
        //     return;
        // }

        // TODO
        // const exportName = 'superblocks_dapp_' + this.projectItem.getName() + '.html';
        // const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportableDappHtml);
        // const downloadAnchorNode = document.createElement('a');
        // downloadAnchorNode.setAttribute('href', dataStr);
        // downloadAnchorNode.setAttribute('download', exportName);
        // document.body.appendChild(downloadAnchorNode); // required for firefox
        // downloadAnchorNode.click();
        // downloadAnchorNode.remove();
    }
};
