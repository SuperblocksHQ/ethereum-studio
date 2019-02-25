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

/**
 * Returns item and its parent item in the tree
 * @param item root item
 * @param id find item by this id
 * @param parentItem parent item in case of subtree search
 */
export function findItemInTree(item: Nullable<IProjectItem>, id: string, parentItem: Nullable<IProjectItem> = null): [Nullable<IProjectItem>, Nullable<IProjectItem>] {
    if (!item) {
        return [null, null];
    }

    if (item.id === id) {
        return [item, parentItem];
    }

    for (const childItem of item.children) {
        const result = findItemInTree(childItem, id, item);
        if (result[0]) {
            return result;
        }
    }

    return [null, null];
}
