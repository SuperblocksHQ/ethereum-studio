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

import { IProjectItem, ProjectItemTypes } from '../../models';

export interface IFindResult {
    item: Nullable<IProjectItem>;
    parentItem: Nullable<IProjectItem>;
    path: string[];
}

/**
 * Returns item and its parent item in the tree
 * @param item root item
 * @param id find item by this id
 * @param parentItem parent item in case of subtree search
 */
export function findItemById(item: Nullable<IProjectItem>, id: string): IFindResult {
    return findItemByIdImpl(item, id, null, []);
}

export function findItemByIdImpl(item: Nullable<IProjectItem>, id: string, parentItem: Nullable<IProjectItem>, path: string[]): IFindResult {
    if (!item) {
        return { item: null, parentItem: null, path };
    }

    if (!item.isRoot) {
        path.push(item.name);
    }

    if (item.id === id) {
        return { item, parentItem, path };
    }

    for (const childItem of item.children) {
        const result = findItemByIdImpl(childItem, id, item, path);
        if (result.item) { // item was found
            return result;
        }
    }

    path.pop();

    return { item: null, parentItem: null, path };
}

export function findItemByPath(root: IProjectItem, path: string[], itemType: ProjectItemTypes): Nullable<IProjectItem> {
    let currItem: IProjectItem | undefined = root;
    for (const folder of path) {
        currItem = currItem.children.find(i => i.name === folder && i.type === itemType);
        if (!currItem) {
            return null;
        }
    }

    return currItem;
}
