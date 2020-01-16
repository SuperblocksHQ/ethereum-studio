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

import { IOutputLogRow } from '../models/state';

export const outputLogActions = {
    ADD_ROWS: 'ADD_ROWS',
    addRows(rows: IOutputLogRow[]) {
        return {
            type: outputLogActions.ADD_ROWS,
            data: rows
        };
    },

    CLEAR_OUTPUT_LOG: 'CLEAR_OUTPUT_LOG',
    clearOutputLog() {
        return {
            type: outputLogActions.CLEAR_OUTPUT_LOG
        };
    },
};
