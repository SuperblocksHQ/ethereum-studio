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

function traverseTreeImpl(item: IProjectItem, currentPath: string[], callback: (item: IProjectItem, path: () => string[]) => void) {
    if (!item.isRoot) {
        currentPath.push(item.name);
    }
    // argument should always be copied, otherwise it is a reference which may be modified later
    callback(item, () => currentPath.slice());

    for (const childItem of item.children) {
        traverseTreeImpl(childItem, currentPath, callback);
    }
    currentPath.pop();
}

/**
 * Goes though every node in the tree and executes callback with the node and its path
 * @param item 
 * @param callback 
 */
export function traverseTree(item: IProjectItem, callback: (item: IProjectItem, path: () => string[]) => void) {
    return traverseTreeImpl(item, [], callback);
}
