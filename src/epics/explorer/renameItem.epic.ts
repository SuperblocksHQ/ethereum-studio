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

import { switchMap, catchError, map } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { explorerActions, projectsActions } from '../../actions';
import { projectSelectors } from '../../selectors';
import { projectService } from '../../services';
import { EMPTY, of } from 'rxjs';
import { fetchJSON } from '../../services/utils/fetchJson';

export const renameItemEpic: Epic = (action$, state$) => action$.pipe(
    ofType(explorerActions.RENAME_ITEM),
    switchMap((action) => {
        const project = projectSelectors.getProject(state$.value);
        const explorerState = state$.value.explorer;
        const isOwnProject = state$.value.projects.isOwnProject;

        if (explorerState.itemNameValidation.isValid) {
            if (isOwnProject) {
                return projectService.putProjectById(project.id, {
                    name: project.name,
                    description: project.description,
                    files: explorerState.tree
                })
                    .pipe(
                        map(() => explorerActions.renameItemSuccess(action.data.id, action.data.name)),
                        catchError(() => [ explorerActions.renameItemFail(explorerState.itemNameValidation.itemId, explorerState.itemNameValidation.oldName) ])
                    );
            } else {
                // fork with new filename
                return projectService.createProject({
                    name: project.name,
                    description: project.description,
                    files: explorerState.tree
                }).pipe(
                    switchMap((newProject) =>  {
                        if (newProject.anonymousToken) {
                            fetchJSON.setAnonymousToken(newProject.anonymousToken);
                        }

                        // redirect
                        window.location.href = `${window.location.origin}/${newProject.id}`;

                        return [explorerActions.renameItemSuccess(action.data.id, action.data.name), projectsActions.forkProjectSuccess()];
                    }),
                    catchError((error) => {
                        console.log('There was an issue forking the project: ' + error);
                        return of(projectsActions.forkProjectFail(error.message));
                    })
                );
            }
        } else {
            alert('Invalid file or folder name.');
            return EMPTY;
        }
    })
);
