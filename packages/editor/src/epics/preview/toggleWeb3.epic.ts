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

import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { previewActions } from '../../actions';
import { previewService } from '../../services';

export const toggleWeb3Epic = (action$: any, state$: any) => action$.pipe(
    ofType(previewActions.TOGGLE_WEB3),
    switchMap(() => {
        previewService.disableWeb3 = state$.value.preview.disableWeb3;
        return EMPTY;
    }));
