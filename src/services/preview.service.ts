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
import { IEnvironment } from '../models/state';

const exportableDappHtml: string | null = null;
let iframeId: string;
let disableAccounts = false;
let environment: IEnvironment;

export const previewService = {
    superProvider: null,

    init(wallet: any) {
        window.addEventListener('message', async (e) => {
            if (e.data.type === 'window-ready') {
                // const builtProject = await buildProjectHtml(this.projectItem, wallet, this.disableAccounts, environment);
                // exportableDappHtml = builtProject.exportableContent;
                // if (e.source) {
                //     e.source.postMessage({ type: 'set-content', payload: builtProject.content }, '*');
                //     this.superProvider.initIframe(document.getElementById(iframeId));
                // }
            }
        });
    },

    initSuperProvider(_iframeId: string) {
        iframeId = _iframeId;
        // this.superProvider = new SuperProvider(iframeId, previewService.projectItem, (hash, endpoint) => {
        //     const network = Object.keys(Networks).find(key => Networks[key].endpoint === endpoint);
        //     // this.projectItem.getTxLog().addTx({
        //     //     hash: hash,
        //     //     context: 'Contract interaction',
        //     //     network
        //     // });
        // }, () => environment.name);
    },

    setEnvironment(value: IEnvironment) {
        environment = value;
    },

    get disableAccounts() { return disableAccounts; },
    set disableAccounts(value) { disableAccounts = value; },

    get hasExportableContent() { return Boolean(exportableDappHtml); },

    downloadDapp() {
        if (!exportableDappHtml) {
            return;
        }

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
