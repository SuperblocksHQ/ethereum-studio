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
import {EMPTY} from 'rxjs';
import { IProject } from '../../models';

export const renameProjectEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.RENAME_PROJECT),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const project = projectSelectors.getProject(state);
        const { description, id } =  project;
        const name = action.data.newName;

        const isOwnProject = state.projects.isOwnProject;
        const files = state.explorer.tree;

        if (isOwnProject) {
            // update
            return projectService.putProjectById(id, {
                name,
                description,
                files
            })
                .pipe(
                    switchMap(() => projectService.getProjectById(project.id)),
                    map((updatedProject: IProject) => {
                        document.title = `${updatedProject.name} | Ethereum Studio`;
                        return projectsActions.updateProjectSuccess(updatedProject);
                    }),
                    catchError(err => [projectsActions.renameProjectFail(err)])
                );
        } else {
            return EMPTY;
        }
    }),
);
