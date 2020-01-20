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

import { from, interval, concat, of } from 'rxjs';
import { switchMap, first, withLatestFrom } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { compilerActions, panelsActions, projectsActions } from '../../actions';
import { compilerService } from '../../services';
import { Panels } from '../../models/state';
import { projectSelectors } from '../../selectors';

function compileContract(compilerState: any) {
    return from(
        new Promise((resolve) => {
            compilerService.queue(
                { input: JSON.stringify(compilerState.input), files: compilerState.files },
                (data: any) => resolve(compilerActions.handleCompileOutput(JSON.parse(data)))
            );
        })
    );
}

export const initCompilation: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(compilerActions.INIT_COMPILATION),
    withLatestFrom(state$),
    switchMap(([, state]) => {
        const project = projectSelectors.getProject(state);
        const isOwnProject = state.projects.isOwnProject;

        if (isOwnProject) {
            compilerService.init();
            return concat(
                interval(200).pipe(
                    first(() => compilerService.isReady()), // compiler has to be ready to be able to do smth
                    switchMap(() => concat(
                        of(compilerActions.compilerReady(compilerService.getVersion())),
                        compileContract(state.compiler)
                    ))
                )
            );
        } else {
            return [projectsActions.forkProject(project.id, true)];
        }
    })
);
