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

import { from, of } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { userActions } from '../../actions';
import { userService } from '../../services';

const getUserRepositoryList: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(userActions.GET_USER_REPOSITORY_LIST),
    withLatestFrom(state$),
    switchMap(([, ]) => {
        return from(userService.getUserRepositories()).pipe(
            map(userActions.getUserRepositoryListSuccess),
            catchError((error) => {
                console.log('There was an issue fetching the user repositories: ' + error);
                return of(userActions.getUserRepositoryListFail(error));
            })
        );
    })
);

export default getUserRepositoryList;
