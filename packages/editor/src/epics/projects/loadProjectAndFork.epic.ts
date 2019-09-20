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

import { of } from 'rxjs';
import { switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { projectsActions } from '../../actions';
import { projectService} from '../../services/project.service';
import { IProject } from '../../models';

export const loadProjectAndForkEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.LOAD_PROJECT_AND_FORK),
    withLatestFrom(state$),
    switchMap(([action, _state]) => {
        const projectId = action.data.projectId;
        return projectService.getProjectById(projectId)
            .pipe(
                switchMap((project: IProject) => projectService.createProject({
                    name: project.name,
                    description: project.description,
                    files: project.files
                })),
                switchMap((newProject: IProject) =>  {
                    // redirect
                    window.location.href = `${window.location.origin}/${newProject.id}`;

                    return [projectsActions.loadProjectSuccess(newProject)];
                }),
                catchError((error) => {
                    console.log('There was an issue loading the project: ' + error);
                    return of(projectsActions.loadProjectFail(error));
                })
            );
    })
);

