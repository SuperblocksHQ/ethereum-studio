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

import { IProjectItem } from '../models';

export const compilerActions = {
    HANDLE_COMPILE_OUTPUT: 'HANDLE_COMPILE_OUTPUT',
    handleCompileOutput(data: any) {
        return {
            type: compilerActions.HANDLE_COMPILE_OUTPUT,
            data
        };
    },

    COMPILER_READY: 'COMPILER_READY',
    compilerReady(version: string) {
        return {
            type: compilerActions.COMPILER_READY,
            data: version
        };
    },

    INIT_COMPILATION: 'INIT_COMPILATION',
    initCompilation(item: IProjectItem) {
        return {
            type: compilerActions.INIT_COMPILATION,
            data: item
        };
    }
};
