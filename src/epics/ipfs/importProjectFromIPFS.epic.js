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

import { from, of } from 'rxjs';
import { switchMap,
    withLatestFrom,
    map,
    catchError,
    tap,
    delayWhen,
 } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { ipfsActions } from '../../actions';
import { ipfsService } from '../../services';
import { epicUtils } from '../utils';

const files = {
    '/': {
        type: 'd',
        children: {}
    }
};

/**
 * Convert IPFS result into our internal files/dir format.
 *
 * @param {*} file - A file object in IPFS format
 */
const convertFile = (file) => {
    if (file.content) {
        const a = file.path.match("[^/]+(.*/)([^/]+)$");
        const fragments = a[1].split('/');
        let node = files['/'].children;
        for(let i = 1; i < fragments.length - 1; i++) {
            if (!node[fragments[i]]) {
                node[fragments[i]] = {
                    type: 'd',
                    children: {},
                };
            }
            node = node[fragments[i]].children;
        }
        node[a[2]] = {
            type: 'f',
            contents: file.content.toString(),
        };
    }
}

/**
 * Epic in charge of importing a project from IPFS.
 */
const importProjectFromIPFS = (action$, state$, { router }) => action$.pipe(
    ofType(ipfsActions.IMPORT_PROJECT_FROM_IPFS),
    withLatestFrom(state$),
    switchMap(([action,]) => {
        const hash = action.data;
        return from(ipfsService.ipfsFetchFiles(hash))
        .pipe(
            delayWhen(() => epicUtils.controlAvailable$(router)),
            map(response => response.map(f => convertFile(f))),
            tap(() => router.control.importProject(files, true)),
            map(ipfsActions.importProjectFromIpfsSuccess),
            catchError((error) => {
                console.log("There was an issue importing the project from IPFS: " + error);
                ipfsService.clearTempProject();
                return of(ipfsActions.importProjectFromIpfsFail())
            })
        )
    })
);

export default importProjectFromIPFS;
