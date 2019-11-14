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

import { of } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError, first, tap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { projectsActions } from '../../actions';
import { projectService} from '../../services/project.service';
import { IProject } from '../../models';

export function loadProjectById(projectId: string) {
    return projectService.getProjectById(projectId)
        .pipe(
            map((project: IProject) => {
                document.title = `${project.name} | Ethereum Studio`;
                return projectsActions.loadProjectSuccess(project);
            }),
            catchError((error) => {
                console.log('There was an issue loading the project: ' + error);
                window.location.href = '/';
                return of(projectsActions.loadProjectFail(error));
            })
        );
}

// TODO - Make sure that we render correctly the 404 screen say
export const loadProject: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.LOAD_PROJECT_REQUEST),
    withLatestFrom(state$),
    switchMap(([action, _state]) => {
        const projectId = action.data.projectId;
        return action$.pipe(
            withLatestFrom(state$),
            // wait until dev wallet is initialized before loading the project
            first(([, state]) => !!state.projects.openWallets.development),
            switchMap(() => loadProjectById(projectId))
        );
    })
);

