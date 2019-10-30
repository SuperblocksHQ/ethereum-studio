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

import { ofType } from 'redux-observable';
import { projectsActions } from '../../actions';
import { withLatestFrom, switchMap } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ProjectItemTypes } from '../../models';
import { traverseTree } from '../../reducers/explorerLib';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { empty } from 'rxjs';

function pathToString(path: string[]) {
    return '/' + path.join('/');
}

export const exportProject = (action$: AnyAction, state$: any) => action$.pipe(
    ofType(projectsActions.EXPORT_PROJECT),
    withLatestFrom(state$),
    switchMap(([, state]) => {
        const files = state.explorer.tree;
        const zip = new JSZip();
        const fileName = state.projects.project.name.trim().toLowerCase().replace(/ /g, '_') + '_' + Date.now();

        const promptResult = prompt(
            'Do you also want to save the project state (current contract addresses, ABIs, etc...)?',
            'yes'
        );
        if (!promptResult) {
            return empty();
        }
        const promptResultLowerCase = promptResult.toLowerCase();
        if (promptResultLowerCase !== 'yes' && promptResultLowerCase !== 'no') {
            alert('Download aborted. Yes or No answer expected.');
            return empty();
        }
        const includeBuildFiles = promptResultLowerCase === 'yes';

        // Add all files to zip variable
        traverseTree(files, (file, path) => {
            if (!includeBuildFiles && path()[0] === 'build') {
                return;
            }
            if (file.type !== ProjectItemTypes.Folder) {
                zip.file(pathToString(path()), file.code);
            } else if (file.type === ProjectItemTypes.Folder && !file.children.length) {
                zip.folder(pathToString(path()), file.name);
            }
        });

        // Generate zip and show pop up
        zip.generateAsync({type: 'blob'})
            .then((content: any) => {
                FileSaver.saveAs(content, `${fileName}.zip`);
            });

        return [projectsActions.exportProjectSuccess()];
    })
);
