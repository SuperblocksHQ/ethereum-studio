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

import { switchMap, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { projectsActions } from '../../actions';
import { projectSelectors } from '../../selectors';
import { projectService } from '../../services';
import { of } from 'rxjs';
import { fetchJSON } from '../../services/utils/fetchJson';

export const createForkedProject: Epic = (action$, state$) => action$.pipe(
    ofType(projectsActions.CREATE_FORKED_PROJECT),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        return projectService.createProject({
            name: action.data.name,
            description: action.data.description,
            files: action.data.tree
        }).pipe(
                switchMap((newProject) =>  {
                    if (newProject.anonymousToken) {
                        fetchJSON.setAnonymousToken(newProject.anonymousToken);
                    }

                    // redirect
                    window.location.href = `${window.location.origin}/${newProject.id}`;

                    return [projectsActions.forkProjectSuccess()];
                }),
                catchError((error) => {
                    console.log('There was an issue forking the project: ' + error);
                    return of(projectsActions.forkProjectFail(error.message));
                })
            );
        }
    )
);

