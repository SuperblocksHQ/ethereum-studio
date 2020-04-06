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

import { of, empty } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { compilerActions, explorerActions, outputLogActions, deployerActions } from '../../actions';

export const handleCompilerOutputEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(compilerActions.HANDLE_COMPILE_OUTPUT),
    switchMap(() => {
        const compilerState = state$.value.compiler;
        const compileDataState = state$.value.explorer.currentItem;
        if (compilerState.outputFolderPath.length && compilerState.outputFiles.length && compileDataState && compileDataState.shouldBeDeployed) {
            return of(
                // save files
                explorerActions.createPathWithContent(compilerState.outputFolderPath, compilerState.outputFiles),
                // show output in console
                outputLogActions.addRows(compilerState.consoleRows),
                deployerActions.deployContract(compileDataState.item),
            );

        }
        if (compilerState.outputFolderPath.length && compilerState.outputFiles.length) {
            return of(
                // save files
                explorerActions.createPathWithContent(compilerState.outputFolderPath, compilerState.outputFiles),
                // show output in console
                outputLogActions.addRows(compilerState.consoleRows),

            );

        } else {
            return of(
                // show output in console
                outputLogActions.addRows(compilerState.consoleRows)
            );
        }
    })
);
