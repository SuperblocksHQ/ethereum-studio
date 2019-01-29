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

import { switchMap, map, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { projectsActions } from '../../actions';
import { previewService } from '../../services';
import { projectSelectors } from '../../selectors';
import Networks from '../../networks';
import { empty, from } from 'rxjs';

function hasEnvironments(state) {
    return state.projects.selectedProject.environments.length
}

export const environmentUpdateEpic = (action$, state$) => action$.pipe(
    ofType(projectsActions.SET_ENVIRONMENT, projectsActions.SELECT_PROJECT),
    switchMap(() => {
        if (!hasEnvironments(state$.value)) {
            return empty();
        }

        const selectedEnvironment = projectSelectors.getSelectedEnvironment(state$.value);
        // update preview service
        previewService.setEnvironment(selectedEnvironment);

        // enable metamask
        if (typeof web3 !== 'undefined' &&
            selectedEnvironment.name !== Networks.browser.name &&
            selectedEnvironment.name !== Networks.custom.name) {
            return from(web3.currentProvider.enable()).pipe(
                // do nothing if user gives access to metamask
                switchMap(() => empty()),
                // set env back to browser in case user reject metamask access
                catchError(() => [projectsActions.setEnvironment(Networks.browser.name)])
            );
        }
        return empty();
    }));
