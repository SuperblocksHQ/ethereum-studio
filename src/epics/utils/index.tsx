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

import { interval } from 'rxjs';
import { map,
    retry,
    take
 } from 'rxjs/operators';

export const epicUtils = {
    /**
     * Simple Observable which will only finish once the router.control is actually available
     *
     * @param {*} router - The router object containing the control.js reference
     */
    controlAvailable$: (router: any) => interval(100)
        .pipe(
            map(() => router.control),
            retry(),
            take(1)
        )
};
