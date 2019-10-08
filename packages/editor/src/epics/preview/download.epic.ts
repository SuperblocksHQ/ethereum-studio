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

import { withLatestFrom, switchMap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { previewActions } from '../../actions';

export const downloadEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(previewActions.DOWNLOAD),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        if (state.preview.showDownloadModal) {

            const projectName = state.projects.project.name;
            const htmlToRender = state.preview.htmlToRender;

            const exportName = 'superblocks_dapp_' + projectName + '.html';
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(htmlToRender);
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute('href', dataStr);
            downloadAnchorNode.setAttribute('download', exportName);
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }

        return [previewActions.hideModals()];
    })
);
