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

import { empty, of } from 'rxjs';
import { switchMap, withLatestFrom, tap, catchError } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { projectsActions } from '../../actions';
import { projectService } from '../../services/project.service';

// TODO - Make sure to handle errors correctly
export const deleteProject: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.DELETE_PROJECT),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        if (confirm('Are you sure you want to delete the project?')) {
            return projectService.deleteProjectById(action.data.projectId)
                .pipe(
                    switchMap(() => [projectsActions.deleteProjectSuccess()]),
                    tap(() => action.data.redirect ? document.location.href = '/' : null),
                    catchError((error) => {
                        console.log('There was an issue deleting the project: ' + error);
                        return of(projectsActions.deleteProjectFail(error));
                    })
                );
        } else {
            return empty();
        }
    })
);
