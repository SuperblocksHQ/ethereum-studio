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

import { from } from 'rxjs';
import { switchMap, tap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { projectActions } from '../../actions';

export const updateProjectSettings = (action$, state$, { router }) => action$.pipe(
    ofType(projectActions.UPDATE_PROJECT_SETTINGS),
    withLatestFrom(state$),
    switchMap(([action, ]) => {
        const activeProject = router.control.getActiveProject();

        // TODO - This is some legacy code that could be moved to redux state
        activeProject.setName(action.data.name);
        activeProject.setTitle(action.data.title);

        return from(activeProject.saveDappfile())
        .pipe(
            map(() => projectActions.updateProjectSettingsSuccess(action.data)),
            // This should not be here but for simplicity lets leave it here
            tap(() => router.control.redrawMain(true)),
            catchError(error => {
                console.log("Error saving the DappFile: " + error);
                return of(ipfsActions.updateProjectSettingsFail(error))
            })
        );
    }));
