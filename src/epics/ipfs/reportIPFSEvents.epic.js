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

import { empty } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { ipfsActions } from '../../actions';
import { logEvent } from '../../utils/analytics';

const reportIPFSEvents = (action$, state$) => action$.pipe(
    ofType(ipfsActions.UPLOAD_TO_IPFS, ipfsActions.IMPORT_PROJECT_FROM_IPFS),
    withLatestFrom(state$),
    switchMap(([action]) => {
        logEvent(action.type);
        return empty();
    })
);

export default reportIPFSEvents;
