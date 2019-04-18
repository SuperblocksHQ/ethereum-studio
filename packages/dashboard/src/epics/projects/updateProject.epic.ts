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

import { from, of } from 'rxjs';
import { switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { projectsActions, userActions } from '../../actions';
import { projectService } from '../../services/project.service';

export const updateProject: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.UPDATE_PROJECT),
    withLatestFrom(state$),
    switchMap(([action]) => {
        return projectService.getProjectById(action.data.project.id)
        .pipe(
            switchMap((selectedProject) => {
                selectedProject.name = action.data.project.name;
                selectedProject.description = action.data.project.description;

                return from(projectService.putProjectById(selectedProject.id, selectedProject))
                    .pipe(
                        switchMap(() => {
                            return [projectsActions.updateProjectSuccess(selectedProject)];
                        }
                    )
                );
            }),
            catchError((error) => {
                console.log('There was an issue updating the project: ' + error);
                return of(projectsActions.updateProjectFail(error.message));
            })
        );
    })
);
