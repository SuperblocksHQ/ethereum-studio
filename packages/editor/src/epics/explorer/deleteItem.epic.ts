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

import { catchError, switchMap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { explorerActions, panesActions, projectsActions } from '../../actions';
import { projectSelectors } from '../../selectors';
import { projectService } from '../../services';
import { updateItemInTree } from '../../reducers/explorerLib';
import { of } from 'rxjs';
import {fetchJSON} from '../../services/utils/fetchJson';

export const deleteItemEpic: Epic = (action$, state$) => action$.pipe(
    ofType(explorerActions.DELETE_ITEM),
    switchMap((action) => {
        const project = projectSelectors.getProject(state$.value);
        const { name, description, id } = project;

        const explorerState = state$.value.explorer;
        // TODO: remove usage of updateItemInTree. This is done only temporary.
        const files = updateItemInTree(explorerState.tree, explorerState.lastDeletedId, () => null)[0];
        const isOwnProject = state$.value.projects.isOwnProject;

        if (isOwnProject) {
            return projectService.putProjectById(id, {
                name,
                description,
                files
            })
                .pipe(
                    switchMap(() => {
                        return [panesActions.closePane(action.data.id), explorerActions.deleteItemSuccess(action.data.id)];
                    }),
                    catchError(() => [explorerActions.deleteItemFail(action.data.id)])
                );
        } else {
            // fork with new tree structure
            return [projectsActions.createForkedProject(name, description, files), panesActions.closePane(action.data.id)];
        }
    })
);
