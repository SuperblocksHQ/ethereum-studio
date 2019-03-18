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

import { switchMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { projectsActions } from '../../actions';
import { projectService } from '../../services/project.service';
import { projectSelectors } from '../../selectors';
import { of } from 'rxjs';
import { fetchJSON } from '../../services/utils/fetchJson';

export const renameProjectEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.RENAME_PROJECT),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const project = projectSelectors.getProject(state);
        const isOwnProject = state.projects.isOwnProject;

        if (isOwnProject) {
            // update
            return projectService.putProjectById(project.id, {
                name: action.data.newName,
                description: project.description,
                files: state.explorer.tree
            })
                .pipe(
                    switchMap(() => projectService.getProjectById(project.id)),
                    map(projectsActions.updateProjectSuccess),
                );
        } else {
            // fork with new name
            return projectService.createProject({
                name: action.data.newName,
                description: project.description,
                files: state.explorer.tree
            }).pipe(
                switchMap((newProject) =>  {
                    if (newProject.anonymousToken) {
                        fetchJSON.setAnonymousToken(newProject.anonymousToken);
                    }

                    // redirect
                    window.location.href = `${window.location.origin}/${newProject.id}`;

                    return [projectsActions.updateProjectSuccess(newProject), projectsActions.forkProjectSuccess()];
                }),
                catchError((error) => {
                    console.log('There was an issue forking the project: ' + error);
                    return of(projectsActions.forkProjectFail(error.message));
                })
            );
        }
    }),
    catchError(err => [projectsActions.renameProjectFail(err)])
);
