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

import { switchMap, withLatestFrom, catchError, map, retry, mergeMap, first } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { compilerActions, projectsActions } from '../../actions';
import { projectService } from '../../services/project.service';
import { interval, of, throwError } from 'rxjs';
import { projectSelectors, panesSelectors, explorerSelectors } from '../../selectors';
import { updateItemInTree } from '../../reducers/explorerLib';

export const saveProject: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.SAVE_PROJECT),
    withLatestFrom(state$),
    switchMap(([action]) => interval(50)
        .pipe(
            map(() => explorerSelectors.hasUnstoredChanges(state$.value)),
            mergeMap(val => {
                if (val) {
                    console.log('error');
                    return throwError('Error!');
                }
                return of(val);
            }),
            retry(5)
        )
        .pipe(
            first(),
            switchMap(() => {
                const state = state$.value;
                const project = projectSelectors.getProject(state);
                const unsavedChanges = panesSelectors.getPanes(state);
                const { description, name, id } =  project;

                const isOwnProject = state.projects.isOwnProject;
                let files = state.explorer.tree;
                const item = action.data.item;

                unsavedChanges.map((pane: any) => {
                    if (pane.hasUnsavedChanges) {
                        files = updateItemInTree(files, pane.file.id, i => ({...i, code: pane.file.code}))[0];
                    }
                });

                if (isOwnProject) {
                    return projectService.putProjectById(id, {
                        name,
                        description,
                        files
                    })
                        .pipe(
                            mergeMap(() => item ? [projectsActions.saveProjectSuccess(files), compilerActions.initCompilation(item)] : [projectsActions.saveProjectSuccess(files)]),
                            catchError((err) => [ projectsActions.saveProjectFail(err) ])
                        );
                } else {
                    // fork with new tree structure
                    return of(projectsActions.createForkedProject(name, description, files));
                }
            })
        )
    ),
    catchError(err => [projectsActions.saveProjectFail(err)])
);
