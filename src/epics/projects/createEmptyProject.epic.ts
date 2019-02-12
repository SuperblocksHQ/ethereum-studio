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

import { of, from } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError, tap } from 'rxjs/operators';
import data from '../../assets/static/json/emptyProject.json';
import { ofType, Epic } from 'redux-observable';
import { projectsActions } from '../../actions';
import { projectService} from '../../services/project.service';

// TODO - Make sure that we render correctly the 404 screen say
export const createEmptyProject: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.CREATE_EMPTY_PROJECT),
    withLatestFrom(state$),
    switchMap(([, ]) => {
        return from(projectService.createProject(data))
            .pipe(
                map(projectsActions.loadProjectSuccess),
                catchError((error) => {
                    console.log('There was an issue loading the project: ' + error);
                    return of(projectsActions.loadProjectFail(error));
                })
        );
    })
);

