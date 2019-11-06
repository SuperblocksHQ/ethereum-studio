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

import { switchMap, withLatestFrom } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { panesActions, explorerActions } from '../../actions';
import { from } from 'rxjs';
import { IProjectItem, ProjectItemTypes } from '../../models';
import { findItemByPath } from '../../reducers/explorerLib';

export const openFileEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(explorerActions.INIT_EXPLORER_SUCCESS),
    withLatestFrom(state$),
    switchMap(([_action, state]) => {
        const actions = [];
        const url = String(window.location);

        const params = new URLSearchParams(location.search);
        const openFile = params && params.get('openFile');
        if (openFile) {
            const path = openFile.split('/');
            const readmeItem: Nullable<IProjectItem> = findItemByPath(state.explorer.tree, path, ProjectItemTypes.File);
            if (readmeItem && readmeItem !== null) {
                actions.push(panesActions.openFile(readmeItem));
            }
        }

        return from(actions);
    })
);
