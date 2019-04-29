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

import { empty, of } from 'rxjs';
import { switchMap, withLatestFrom, tap, catchError } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { organizationActions } from '../../actions';
import { organizationService } from '../../services';

export const deleteOrganization: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(organizationActions.DELETE_ORGANIZATION),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        if (confirm('Are you sure you want to delete the organization?')) {
            return organizationService.deleteOrganizationById(action.data.organizationId)
                .pipe(
                    switchMap(() => [organizationActions.deleteOrganizationSuccess()]),
                    tap(() => action.data.redirect ? document.location.href = '/' : null),
                    catchError((error) => {
                        console.log('There was an issue deleting the organization: ' + error);
                        return of(organizationActions.deleteOrganizationFail(error));
                    })
                );
        } else {
            return empty();
        }
    })
);
