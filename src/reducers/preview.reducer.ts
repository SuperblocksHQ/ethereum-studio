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

import { previewActions, explorerActions, panesActions } from '../actions';
import Networks from '../networks';
import { AnyAction } from 'redux';
import { findItemByPath } from './explorerLib';
import { ProjectItemTypes } from '../models';

const initialState = {
    showNoExportableContentModal: false,
    showCannotExportModal: false,
    showDownloadModal: false,
    disableAccounts: false,
    htmlToRender: ''
};

function getProviderHTML(endpoint: string, accounts: string[]) {
    const js =
        `<script type="text/javascript" src="${window.location.origin}/static/js/web3provider.js?ts=${Date.now()}"></script>
         <script type="text/javascript">
            window.web3={currentProvider:new DevKitProvider.provider("${endpoint}"), eth:{ accounts:${JSON.stringify(accounts)} }};
            console.log("Using Superblocks web3 provider for endpoint: ${endpoint}");
         </script>`;
    return js;
}

function getInnerContent(html: string, style: string, js: string, endpoint: string, accounts: string[]) {
    const js2 = (endpoint !== null && accounts !== null ? getProviderHTML(endpoint, accounts) : '') + `<script type="text/javascript">${js}</script>`;

    const style2 = `<style type="text/css">${style}</style>`;
    html = html.replace('<!-- STYLE -->', style2);
    html = html.replace('<!-- JAVASCRIPT -->', js2);
    return html;
}

function errorHtml(message: string) {
    return `
    <html>
        <head>
        <style type="text/css">body {background-color: #fff; color: #333;text-align:center;}</style></head>
        <body>
            <h1>${message}</h1>
        </body>
    </html>`;
}

// function makeFileName(path: string, networkName: string, suffix: string) {
//     const a = path.match(/^(.*\/)([^/]+)$/);
//     const dir = a[1];
//     const filename = a[2];
//     const contractName = filename.match(/^(.+)[.][Ss][Oo][Ll]$/)[1];
//     return `/build${dir}${contractName}/${contractName}.${networkName}.${suffix}`;
// }

export default function previewReducer(state = initialState, action: AnyAction, rootState: any) {
    switch (action.type) {
        case explorerActions.INIT_EXPLORER_SUCCESS:
        case panesActions.SAVE_FILE_SUCCESS:
        case previewActions.REFRESH_CONTENT:
            let htmlToRender;
            const tree = rootState.explorer.tree;

            // TODO
            const addresses = [''];
            const html = findItemByPath(tree, [ 'app', 'app.html' ], ProjectItemTypes.File);
            const css = findItemByPath(tree, [ 'app', 'app.css' ], ProjectItemTypes.File);
            const js = findItemByPath(tree, [ 'app', 'app.js' ], ProjectItemTypes.File);

            console.log(html);

            // TODO - Improve all this to make sure we can render
            if ((html === null || css === null || js === null || !html.code || !css.code || !js.code)) {
                htmlToRender = errorHtml('There was an error rendering your project');
            } else {
                htmlToRender = getInnerContent(html.code, css.code, js.code, rootState.projects.selectedEnvironment.endpoint, addresses);
            }

            return {
                ...state,
                htmlToRender
            };
        case previewActions.HIDE_MODALS:
            return {
                ...state,
                showTransactionsHistory: false,
                preview: {
                    ...state,
                    showCannotExportModal: false,
                    showNoExportableContentModal: false,
                    showDownloadModal: false
                }
            };
        case previewActions.TRY_DOWNLOAD: {
            let showNoExportableContentModal = false;
            let showCannotExportModal = false;
            let showDownloadModal = false;

            if (!action.data.hasExportableContent) {
                showNoExportableContentModal = true;
            } else if (action.data.currentEnvironment === Networks.browser.name) {
                showCannotExportModal = true;
            } else {
                showDownloadModal = true;
            }

            return {
                ...state,
                preview: { ...state, showNoExportableContentModal, showCannotExportModal, showDownloadModal }
            };
        }
        case previewActions.TOGGLE_WEB3_ACCOUNTS:
            return {
                ...state,
                preview: { ...state, disableAccounts: !state.disableAccounts }
            };
        default:
            return state;
    }
}
