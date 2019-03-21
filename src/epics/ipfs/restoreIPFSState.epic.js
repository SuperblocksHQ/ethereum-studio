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

import { from, of } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError, first, tap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { projectSelectors } from '../../selectors';
import { ipfsActions, projectsActions } from '../../actions';

const restoreIPFSState = (action$, state$, { backend }) => action$.pipe(
    ofType(projectsActions.SELECT_PROJECT),
    withLatestFrom(state$),
    switchMap(([,state]) => {
        const projectId = projectSelectors.getProjectId(state);
        return from(backend.loadFilePromise(projectId, '/.super/ipfs.json'))
        .pipe(
            switchMap(file => from(JSON.parse(file))),
            first(),
            map(ipfsActions.restoreIPFSStateSuccess),
            catchError(() => {
                console.log("IPFS backup information not available");
                return of(ipfsActions.restoreIPFSStateFail())
            })
        )
    })
);

export default restoreIPFSState;
