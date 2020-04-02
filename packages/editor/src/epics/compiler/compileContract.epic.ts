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

import { of } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { explorerActions, compilerActions, projectsActions, deployerActions } from '../../actions';
import { IPane } from '../../models/state';
import { explorerSelectors, panesSelectors } from '../../selectors';

export const compileContractsEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(explorerActions.COMPILE_CONTRACT),
    withLatestFrom(state$),
    switchMap(([action]) => {
        const hasUnstoredChanges = explorerSelectors.hasUnstoredChanges(state$.value);
        const panes = panesSelectors.getPanes(state$.value);
        const hasUnsavedChanges = panes.reduce((acc: any, curr: IPane) => {
            if (acc === true) {
                return true;
            }
            return curr.hasUnsavedChanges;
        }, []);

        if (hasUnsavedChanges || hasUnstoredChanges) {
            return of(projectsActions.saveProject(action.data.item));
        }

        return of(compilerActions.initCompilation(action.data.item));
    })
);
