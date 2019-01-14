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

import { buildProjectHtml } from './utils/buildProjectHtml';
import SuperProvider from '../components/superprovider';
import Networks from '../networks';

let projectItem = null;
let exportableDappHtml = null;
let iframeId = null;
let disableAccounts = false;

export const previewService = {
    superProvider: null,

    init(wallet) {
        window.addEventListener('message', async (e) => {
            if (e.data.type === 'window-ready' && this.projectItem) {
                const builtProject = await buildProjectHtml(this.projectItem, wallet, this.disableAccounts);
                exportableDappHtml = builtProject.exportableContent;
                if (e.source) {
                    e.source.postMessage({ type: 'set-content', payload: builtProject.content }, '*');
                    this.superProvider.initIframe(document.getElementById(iframeId));
                }
            }
        });
    },

    initSuperProvider(_iframeId) {
        iframeId = _iframeId;
        this.superProvider = new SuperProvider(iframeId, previewService.projectItem, (hash, endpoint) => {
            const network = Object.keys(Networks).find(key => Networks[key].endpoint === endpoint);
            this.projectItem.getTxLog().addTx({
                hash: hash,
                context: 'Contract interaction',
                network
            });
        });
    },

    get projectItem() { return projectItem; },
    set projectItem(value) {
        projectItem = value;
        exportableDappHtml = null;
    },

    get disableAccounts() { return disableAccounts; },
    set disableAccounts(value) { disableAccounts = value; },

    get hasExportableContent() { return Boolean(exportableDappHtml); },

    downloadDapp() {
        if (!exportableDappHtml) {
            return;
        }

        const exportName = 'superblocks_dapp_' + this.projectItem.getName() + '.html';
        var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportableDappHtml);
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', exportName);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
};
