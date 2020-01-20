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

import { previewActions, explorerActions, deployerActions, projectsActions } from '../actions';
import { AnyAction } from 'redux';
import { findItemByPath } from './explorerLib';
import { ProjectItemTypes } from '../models';
import { projectSelectors, previewSelectors } from '../selectors';

const initialState = {
    disableWeb3: false,
    htmlToRender: '',
    exportableHtml: undefined
};

function getProviderHTML(endpoint: string, accounts: string[], disableWeb3?: boolean) {
    return disableWeb3 ? '' :
        `<script type="text/javascript" src="${window.location.origin}/static/js/web3provider.js?ts=${Date.now()}"></script>
         <script type="text/javascript">
            window.web3={currentProvider:new DevKitProvider.provider("${endpoint}"), eth:{ accounts:${JSON.stringify(accounts)} }};
            console.log("Using Superblocks web3 provider for endpoint: ${endpoint}");
         </script>`;
}

function getInnerContent(html: string, style: string, js: string, endpoint?: string, accounts?: string[], disableWeb3?: boolean) {
    const js2 = ((endpoint && endpoint !== null) && (accounts && accounts !== null) ? getProviderHTML(endpoint, accounts, disableWeb3) : '') + `<script type="text/javascript">${js}</script>`;

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

export default function previewReducer(state = initialState, action: AnyAction, rootState: any) {
    switch (action.type) {
        case deployerActions.DEPLOY_SUCCESS:
        case explorerActions.INIT_EXPLORER_SUCCESS:
        case projectsActions.SET_ENVIRONMENT_SUCCESS:
        case previewActions.REFRESH_CONTENT:
            let htmlToRender;
            let exportableHtml;
            const tree = rootState.explorer.tree;
            const addresses = [projectSelectors.getSelectedAccount(rootState).address];
            const disableWeb3 = previewSelectors.getDisableWeb3(rootState);

            const html = findItemByPath(tree, [ 'app', 'app.html' ], ProjectItemTypes.File);
            const css = findItemByPath(tree, [ 'app', 'app.css' ], ProjectItemTypes.File);
            const js = findItemByPath(tree, [ 'app', 'app.js' ], ProjectItemTypes.File);

            let contractJs = '';
            const contractListFolder = findItemByPath(tree, [ 'build', 'contracts' ], ProjectItemTypes.Folder);
            if (contractListFolder && contractListFolder.children.length > 0) {
                for (const contractFolder of contractListFolder.children) {
                    const contractFiles = contractFolder.children.filter((file) => file.name.includes(`${rootState.projects.selectedEnvironment.name}.js`));
                    for (const file of contractFiles) {
                        contractJs += file.code + '\n';
                    }
                }
            }

            if ((!html || !css || !js || !html.code || !css.code || !js.code)) {
                htmlToRender = errorHtml('There was an error rendering your project');
            } else {
                htmlToRender = getInnerContent(html.code, css.code, contractJs + '\n' + js.code, rootState.projects.selectedEnvironment.endpoint, addresses, disableWeb3);
                exportableHtml = getInnerContent(html.code, css.code, contractJs + '\n' + js.code);
            }

            return {
                ...state,
                htmlToRender,
                exportableHtml
            };
        case previewActions.HIDE_MODALS:
            return {
                ...state,
                showCannotExportModal: false,
                showNoExportableContentModal: false,
                showDownloadModal: false
            };
        case previewActions.TOGGLE_WEB3:
            return {
                ...state,
                disableWeb3: !state.disableWeb3
            };
        default:
            return state;
    }
}
