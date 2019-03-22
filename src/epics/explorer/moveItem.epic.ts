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

import { switchMap, catchError, map } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { explorerActions, projectsActions } from '../../actions';
import { projectSelectors } from '../../selectors';
import { projectService } from '../../services';
import { of } from 'rxjs';

export const moveItemEpic: Epic = (action$, state$) => action$.pipe(
    ofType(explorerActions.MOVE_ITEM),
    switchMap((data) => {
        const project = projectSelectors.getProject(state$.value);
        const { name, description, id } = project;

        const explorerState = state$.value.explorer;
        const files = explorerState.tree;
        const isOwnProject = state$.value.projects.isOwnProject;

        if (isOwnProject) {
            return projectService.putProjectById(id, {
                name,
                description,
                files
            })
                .pipe(
                    map(() => explorerActions.moveItemSuccess(data.sourceId)),
                    catchError(() => [ explorerActions.moveItemFail(data.sourceId) ])
                );
        } else {
            // fork with new tree structure
            return [explorerActions.moveItemSuccess(data.id), projectsActions.createForkedProject(name, description, files)];
        }
    })
);
