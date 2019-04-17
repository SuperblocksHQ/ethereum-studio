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

import { switchMap, catchError } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { explorerActions, projectsActions } from '../../actions';
import { projectSelectors } from '../../selectors';
import { EMPTY, of } from 'rxjs';
import { projectService } from '../../services';

export const createItemEpic: Epic = (action$, state$) => action$.pipe(
    ofType(explorerActions.CREATE_ITEM),
    switchMap(() => {
        const project = projectSelectors.getProject(state$.value);
        const { name, description, id } = project;

        const explorerState = state$.value.explorer;
        const files = explorerState.tree;
        const isOwnProject = state$.value.projects.isOwnProject;

        if (explorerState.itemNameValidation.isValid) {
            if (isOwnProject) {
                return projectService.putProjectById(id, {
                    name,
                    description,
                    files
                }).pipe(
                    switchMap(() => [explorerActions.createItemSuccess()]),
                    catchError(() => [ explorerActions.createItemFail(explorerState.itemNameValidation.itemId) ])
                );
            } else {
                // fork with new tree structure
                return of(projectsActions.createForkedProject(name, description, files));
            }
        } else {
            alert('Invalid file or folder name.');
            return EMPTY;
        }
    })
);
