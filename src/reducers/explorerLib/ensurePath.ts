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

import { IProjectItem } from '../../models';
import { replaceInArray } from '../utils';
import { createFolder, sortProjectItems } from '.';

/**
 * Makes sure that provided path exists on the provided item. Obs: this function modifies root item.
 * Returns deepest folder from the path.
 * @param root 
 * @param path 
 */
export function ensurePath(root: IProjectItem, path: string[]) {
    let currItem = root;

    for (const folderName of path) {
        let foundIndex: Nullable<number> = null;
        // updating references in the tree, so that changes can rendered
        currItem.children = replaceInArray(currItem.children, c => c.name === folderName, (item, index) => {
            foundIndex = index;
            return { ...item };
        });

        if (foundIndex === null) {
            const newFolder = createFolder(folderName);
            currItem.children = sortProjectItems(currItem.children.concat([ newFolder ]));
            currItem = newFolder;
        } else {
            currItem = currItem.children[foundIndex];
        }
    }

    return currItem;
}
