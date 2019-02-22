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

import { of, empty } from 'rxjs';
import { switchMap, map, catchError, tap, mergeMap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { projectSelectors } from '../../selectors';
import { projectsActions, userActions } from '../../actions';
import { projectService } from '../../services';
import { fetchJSON } from '../../services/utils/fetchJson';

export const forkProjectById: Epic = (action$, state$) => action$.pipe(
    ofType(projectsActions.FORK_PROJECT_BY_ID),
    switchMap((action) => {
        return projectService.getProjectById(action.data.projectId)
        .pipe(
            switchMap((selectedProject) => {
                return projectService.createProject({
                    name: selectedProject.name,
                    description: selectedProject.description,
                    files: selectedProject.files
                }).pipe(
                    switchMap((project) =>  {
                        if (project.anonymousToken) {
                            fetchJSON.setAnonymousToken(project.anonymousToken);
                        }
                        return [userActions.getProjectList(), projectsActions.forkProjectSuccess()];
                    }),
                    catchError((error) => {
                        console.log('There was an issue forking the project: ' + error);
                        return of(projectsActions.forkProjectFail(error.message));
                    })
                );
            }
        ));
    })
);
