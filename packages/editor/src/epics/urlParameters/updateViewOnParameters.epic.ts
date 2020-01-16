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

import {  switchMap, withLatestFrom } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { projectsActions, panelsActions } from '../../actions';
import { Panels } from '../../models/state';
import { from } from 'rxjs';

export const updateViewOnParameters: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.LOAD_PROJECT_SUCCESS),
    withLatestFrom(state$),
    switchMap(([_action, state]) => {
        const actions = [];
        const url = String(window.location);
        if (url.includes('hideExplorer=1')) {
            actions.push(panelsActions.closePanel(Panels.Explorer));
        } else {
            actions.push(panelsActions.openPanel(Panels.Explorer));
        }
        if (url.includes('showTransactions=1')) {
            actions.push(panelsActions.openPanel(Panels.Transactions));
        }
        if (url.includes('hidePreview=1')) {
            actions.push(panelsActions.closePanel(Panels.Preview));
        } else {
            actions.push(panelsActions.openPanel(Panels.Preview));
        }

        return from(actions);
    })
);
