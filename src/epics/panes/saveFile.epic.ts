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

import { switchMap, map, catchError } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { panesActions, projectsActions } from '../../actions';
import { projectSelectors } from '../../selectors';
import { projectService } from '../../services';

export const saveFileEpic: Epic = (action$, state$) => action$.pipe(
    ofType(panesActions.SAVE_FILE),
    switchMap((action) => {
        const project = projectSelectors.getProject(state$.value);
        const { name, description, id } = project;

        const explorerState = state$.value.explorer;
        const files = explorerState.tree;
        const isOwnProject = state$.value.projects.isOwnProject;

        if (isOwnProject) {
            // TODO: this should be remove when save by file is implem
            const oldCode = state$.value.panes.items.find((i: any) => i.file.id === action.data.fileId).code;

            return projectService.putProjectById(id, {
                name,
                description,
                files
            })
                .pipe(
                    map(() => panesActions.saveFileSuccess(action.data.fileId, action.data.code)),
                    catchError(() => [ panesActions.saveFileFail(action.data.fileId, oldCode) ])
                );
        } else {
            return [panesActions.saveFileSuccess(action.data.fileId, action.data.code), projectsActions.createForkedProject(name, description, files)];
        }
    })
);
