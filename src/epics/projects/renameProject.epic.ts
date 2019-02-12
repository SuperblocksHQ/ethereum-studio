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

import { from } from 'rxjs';
import { switchMap, withLatestFrom, map, tap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { projectsActions } from '../../actions';
import { projectService } from '../../services/project.service';

// TODO - Make sure to handle errors correctly
export const renameProject: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.RENAME_PROJECT),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const project = state.projects.project;
        project.name = action.data.newName;
        return from(projectService.putProjectById(project.id, project))
            .pipe(
                switchMap(() => from(projectService.getProjectById(project.id))),
                map(projectsActions.updateProjectSuccess),
            );
    })
);
