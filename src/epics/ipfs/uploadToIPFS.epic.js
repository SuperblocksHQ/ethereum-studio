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
import { switchMap, withLatestFrom, map, catchError, tap, delayWhen } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { projectSelectors } from '../../selectors';
import { ipfsActions } from '../../actions';
import { ipfsService } from '../../services';

/**
 * Add a timestamp to the upload object we are about to save in order to have the possibility to build a timeline
 * of backups
 * @param {string} shareURL The share URL given to the user
 */
const addTimeStamp = (shareURL) => {
    return { shareURL: shareURL, timestamp: Date.now() }
}

/**
 * This is needed becase atm the file explorer has no way to auto update itself when the
 * underlying state has actually changed (per example by using the backend.js class)
 *
 * @param {ProjectItem} activeProject - The current active project to update the state
 * @returns {Promise} A promise which will only resolve once the file system has successfully updated
 * the state
 */
const updateFileSystemState = (activeProject) => {
    return new Promise((resolve) => {
        activeProject.getChildren()[0].getChildren(true, () => {
            resolve();
        });
    });
}

const uploadToIPFS = (action$, state$, { backend, router }) => action$.pipe(
    ofType(ipfsActions.UPLOAD_TO_IPFS),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const projectId = projectSelectors.getSelectedProjectId(state);
        const { uploadSettings } = action.data;
        return from(ipfsService.ipfsSyncUp(projectId, uploadSettings))
        .pipe(
            map(hash => document.location.href + 'ipfs/' + hash),
            map(addTimeStamp),
            switchMap(({shareURL, timestamp}) => from( backend.loadFilePromise(projectId, '/.super/ipfs.json'))
                .pipe(
                    map(JSON.parse),
                    catchError(() => {
                        console.log("Wrong format or missing ipfs.json. Creating a new one");
                        // Make sure that if there is any error while reading the file (ex. does not exists), we can continue
                        return of([]);
                    }),
                    map(array => {
                        // Keep the history from top to bottom (most recent in the beginning of the array)
                        array.unshift({ timestamp: timestamp, shareURL: shareURL });
                        return array;
                    }),
                    switchMap(array => from(backend.saveFilePromise(projectId, {
                        path: '/.super/ipfs.json',
                        contents: JSON.stringify(array, null, 4)
                    }))),
                    delayWhen(() => from(updateFileSystemState(router.control.getActiveProject()))),
                    map(() => ({shareURL, timestamp})), // Finally simply return the original object we are interested on for the UI
                    catchError(error => {
                        console.log(error);
                        return of('Error saving the file ipfs.json file.')
                    }),
                )
            ),
            map(ipfsActions.uploadToIPFSSuccess),
            catchError(error => {
                console.log(error);
                return of(ipfsActions.uploadToIPFSFail(error))
            })
        )
    })
);

export default uploadToIPFS;
