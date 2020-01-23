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

import { previewActions, explorerActions, deployerActions, projectsActions, panesActions } from '../actions';
import { AnyAction } from 'redux';
import { findItemByPath, findItemById } from './explorerLib';
import { ProjectItemTypes } from '../models';
import { projectSelectors } from '../selectors';

const initialState = {
    htmlToRender: ''
};

function getProviderHTML(endpoint: string, accounts: string[]) {
    return `<script type="text/javascript" src="${window.location.origin}/static/js/web3provider.js?ts=${Date.now()}"></script>
            <script type="text/javascript">
                window.web3={currentProvider:new DevKitProvider.provider("${endpoint}"), eth:{ accounts:${JSON.stringify(accounts)} }};
                console.log("Using Superblocks web3 provider for endpoint: ${endpoint}");
            </script>`;
}

function getInnerContent(html: string, style: string, js: string, endpoint?: string, accounts?: string[]) {
    const js2 = ((endpoint && endpoint !== null) && (accounts && accounts !== null) ? getProviderHTML(endpoint, accounts) : '') + `<script type="text/javascript">${js}</script>`;

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

function generateHtmlToRender(rootState: any) {
    const tree = rootState.explorer.tree;
    const addresses = [projectSelectors.getSelectedAccount(rootState).address];

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
        return errorHtml('There was an error rendering your project');
    } else {
        return getInnerContent(html.code, css.code, contractJs + '\n' + js.code, rootState.projects.selectedEnvironment.endpoint, addresses);
    }
}

export default function previewReducer(state = initialState, action: AnyAction, rootState: any) {
    switch (action.type) {
        case deployerActions.DEPLOY_SUCCESS:
        case explorerActions.INIT_EXPLORER_SUCCESS:
        case projectsActions.SET_ENVIRONMENT_SUCCESS:
        case previewActions.REFRESH_CONTENT:
            return {
                ...state,
                htmlToRender: generateHtmlToRender(rootState),
            };
        case panesActions.SAVE_FILE_SUCCESS:
            const result = findItemById(rootState.explorer.tree, action.data.fileId);
            // reload dapp file data if the file was updated
            if (result.item && (result.item.name.endsWith('.css') ||
                result.item.name.endsWith('.html') ||
                result.item.name.endsWith('.js'))) {
                return {
                    ...state,
                    htmlToRender: generateHtmlToRender(rootState),
                };
            } else {
                return state;
            }
        default:
            return state;
    }
}
