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
import { explorerActions } from '../../actions';
import { projectSelectors } from '../../selectors';
import { projectService } from '../../services';
import { updateItemInTree } from '../../reducers/explorerLib';

export const deleteItemEpic: Epic = (action$, state$) => action$.pipe(
    ofType(explorerActions.DELETE_ITEM),
    switchMap((action) => {
        const project = projectSelectors.getProject(state$.value);
        const explorerState = state$.value.explorer;

        return projectService.putProjectById(project.id, {
            name: project.name,
            description: project.description,
            // TODO: remove usage of updateItemInTree. This is done only temporary.
            files: updateItemInTree(explorerState.tree, explorerState.lastDeletedId, () => null)[0]
        })
        .pipe(
            map(() => explorerActions.deleteItemSuccess(action.data.id)),
            // TODO: error handling
        );
    })
);
