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

import { switchMap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { panesActions, compilerActions } from '../../actions';
import { empty } from 'rxjs';

export const openFileEpic: Epic = (action$, state$) => action$.pipe(
    ofType(panesActions.OPEN_FILE),
    switchMap((action) => {
        const file = action.data;
        const isSolidityFile = file && file.name.toLowerCase().endsWith('.sol');
        if (isSolidityFile) {
            return [compilerActions.initCompilation(file)];
        } else {
            return empty();
        }
    })
);
