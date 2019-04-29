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
import { githubActions } from '../../actions';
import { githubService } from '../../services';

const getUserReposList: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(githubActions.GET_USER_REPOS_LIST),
    withLatestFrom(state$),
    switchMap(([, ]) => {
        return from(githubService.getUserRepos()).pipe(
            map(githubActions.getUserReposSuccess),
            catchError((error) => {
                console.log('There was an issue fetching the user repos: ' + error);
                return of(githubActions.getUserReposFail(error));
            })
        );
    })
);

export default getUserReposList;
