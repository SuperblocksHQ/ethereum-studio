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

import { switchMap, withLatestFrom, map, tap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { projectsActions } from '../../actions';
import { projectService } from '../../services/project.service';
import { projectSelectors } from '../../selectors';

// TODO - Make sure to handle errors correctly
export const renameProjectEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.RENAME_PROJECT),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const project = projectSelectors.getProject(state);

        return projectService.putProjectById(project.id, {
            name: action.data.newName,
            description: project.description,
            files: state.explorer.tree
        })
        .pipe(
            switchMap(() => projectService.getProjectById(project.id)),
            map(projectsActions.updateProjectSuccess),
        );
    })
);
