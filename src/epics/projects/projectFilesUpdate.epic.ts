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

import { map } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { explorerActions, projectsActions } from '../../actions';

/**
 * This epic listen to any changes in file system and rises an update action, which will be propagated to plugin
 */
export const projectFilesUpdateEpic: Epic = (action$: any) => action$.pipe(
    ofType(explorerActions.CREATE_ITEM, explorerActions.CREATE_PATH_WITH_CONTENT, explorerActions.DELETE_ITEM_SUCCESS,
        explorerActions.MOVE_ITEM_SUCCESS, explorerActions.RENAME_ITEM_SUCCESS),
    map(() => projectsActions.projectFilesUpdate())
);
