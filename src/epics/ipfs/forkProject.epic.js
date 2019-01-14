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

import { from, of, empty } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError, tap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { projectSelectors } from '../../selectors';
import { ipfsActions } from '../../actions';
import { ipfsService } from '../../services';

/**
 * Add the current temporary project to the user's list. This way the project will be actually
 * stored and displayed in the projects list.
 *
 * @param {*} backend - The Backend.js to perform file operations
 * @param {*} control - the Control.js to perform project operations
 */
const addProjectToUserList = (backend, control) => {
    return new Promise((resolve, reject) => {
        backend.assignNewInode(1, () => {
            control._loadProjects(() => {
                control._closeProject(status => {
                    if (status == 0) {
                        // Open last project
                        control.openProject(
                            control._projectsList[
                                control._projectsList.length - 1
                            ]
                        );
                        resolve();
                    } else {
                        reject("Couldn't close the project")
                    }
                })
            })
        })
    })
};

const forkTempProject$ = (backend, router) => from(addProjectToUserList(backend, router.control)).pipe(
    tap(() => ipfsService.clearTempProject())
);

const forkOwnProject$ = (projectId, backend, router) => of(projectId).pipe(
    switchMap(() => {
        if(confirm('Are you sure you want to fork your own project?')) {
            return from(backend.getProjectFiles(projectId)).pipe(
                map(backend.modifyDappFile),
                tap(modifiedFiles => router.control.importProject(modifiedFiles, false))
            )
        } else {
            return empty();
        }
    })
);

/**
 * Epic in charge of forking the current project:
 *
 * There are 2 case scenarios:
 *
 * 1. A temporary project is created when downloading a project from ipfs. This project is
 * not actually added to the user's project list until a fork occurrs, therefore we avoid
 * spamming the user's project list with projects they just openned to consult something and then
 * discarded.
 *
 * 2. A user is trying to fork it's own project. When done so, we will ammend a unique identifier, making
 * sure the new project is easy to distinguish from the previous one.
 */
const forkProject = (action$, state$, { backend, router }) => action$.pipe(
    ofType(ipfsActions.FORK_PROJECT),
    withLatestFrom(state$),
    switchMap(([,state]) => {
        const projectId = projectSelectors.getSelectedProjectId(state);
        return of(projectId)
        .pipe(
            switchMap(projectId => {
                if (ipfsService.isTemporaryProject(projectId)) {
                    return forkTempProject$(backend, router);
                } else {
                    return forkOwnProject$(projectId, backend, router);
                }
            }),
            map(ipfsActions.forkProjectSuccess),
            catchError((error) => {
                console.log("There was an issue forking the project: " + error);
                return of(ipfsActions.forkProjectFail())
            })
        )
    })
);

export default forkProject;
