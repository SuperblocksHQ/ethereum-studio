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

import { of, empty } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { projectSelectors } from '../../selectors';
import { ipfsActions, projectsActions } from '../../actions';
import { ipfsService } from '../../services';

const updateIPFSActionButtons = (action$, state$) => action$.pipe(
    ofType(projectsActions.SELECT_PROJECT),
    withLatestFrom(state$),
    switchMap(([,state]) => {
        return of(projectSelectors.getProjectId(state))
        .pipe(
            map(projectId => {
                if (ipfsService.isTemporaryProject(projectId)) {
                    return ipfsActions.updateIpfsActionButtons({
                        showUploadButton: false,
                        showForkButton: true,
                        showShareButton: true,
                    });
                } else if(projectId === 0) { // Welcome screen
                    return ipfsActions.updateIpfsActionButtons({
                        showUploadButton: false,
                        showForkButton: false,
                        showShareButton: false,
                    });
                }
                else {
                    return ipfsActions.updateIpfsActionButtons({
                        showUploadButton: true,
                        showForkButton: true,
                        showShareButton: false,
                    });
                }
            }),
            catchError(() => {
                console.log("Fail silently");
                return empty()
            })
        )
    })
);

export default updateIPFSActionButtons;
