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

import { of } from 'rxjs';
import { switchMap, withLatestFrom, catchError, tap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { explorerActions } from '../../actions';
import { projectService } from '../../services/project.service';
import { projectSelectors } from '../../selectors';

export const updateEntireTreeEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(explorerActions.CREATE_PATH_WITH_CONTENT),
    withLatestFrom(state$),
    switchMap(([_, state]) => {
        const project = projectSelectors.getProject(state);

        return projectService.putProjectById(project.id, {
            name: project.name,
            description: project.description,
            files: state.explorer.tree
        }).pipe(
            switchMap(() => [explorerActions.updateTreeSuccess()]),
            catchError((error) => of(explorerActions.updateTreeFail(error)))
        );
    })
);
