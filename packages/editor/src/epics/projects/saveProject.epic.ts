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
import {explorerActions, projectsActions} from '../../actions';
import { projectService } from '../../services/project.service';
import { projectSelectors } from '../../selectors';
import {EMPTY, of} from 'rxjs';

export const saveProject: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.SAVE_PROJECT),
    withLatestFrom(state$),
    switchMap(([, state]) => {
        const project = projectSelectors.getProject(state);
        const { description, name, id } =  project;

        const isOwnProject = state.projects.isOwnProject;
        const files = state.explorer.tree;

        if (isOwnProject) {
            return projectService.putProjectById(id, {
                name,
                description,
                files
            })
                .pipe(
                    switchMap(() => [projectsActions.saveProjectSuccess()]),
                    catchError((err) => [ projectsActions.saveProjectFail(err) ])
                );
        } else {
            // fork with new tree structure
            return of(projectsActions.createForkedProject(name, description, files));
        }
    }),
    catchError(err => [projectsActions.saveProjectFail(err)])
);
