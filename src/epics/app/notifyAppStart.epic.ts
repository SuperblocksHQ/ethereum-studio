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

import { map } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { appActions } from '../../actions';
export const notifyAppStart: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(appActions.APP_START),
    map(() => appActions.notifyAppStarted()));
