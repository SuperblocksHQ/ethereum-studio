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

import { from, interval, concat, of, empty } from 'rxjs';
import { switchMap, first, tap, withLatestFrom } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { explorerActions, compilerActions, panelsActions, panesActions } from '../../actions';
import { compilerService } from '../../services';
import { Panels } from '../../models/state';
import { IProjectItem, ProjectItemTypes } from '../../models';
import { findItemByPath } from '../../reducers/explorerLib';

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

function cleanBuildFolder(tree: IProjectItem) {
    const buildFolder = findItemByPath(tree, [ 'build' ], ProjectItemTypes.Folder);
    if (buildFolder === null) {
        return empty();
    }

    return explorerActions.deleteItem(buildFolder.id);
}

export const compileContractsEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(explorerActions.COMPILE_CONTRACT),
    withLatestFrom(state$),
    switchMap(([_action, state]) => {
        compilerService.init();

        return concat(
            of(panelsActions.openPanel(Panels.OutputLog)), // show output
            of(cleanBuildFolder(state.explorer.tree)),
            interval(200).pipe(
                first(() => compilerService.isReady()), // compiler has to be ready to be able to do smth
                switchMap(() => concat(
                    of(compilerActions.compilerReady(compilerService.getVersion())),
                    compileContract(state.compiler)
                ))
            )
        );
    })
);
