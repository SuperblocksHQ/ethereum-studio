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
import { sortProjectItems } from './sortProjectItems';
import { replaceOrRemoveInArray, replaceInArray } from '../utils';

export function updateItemInTreeImpl(item: IProjectItem, id: string, modify: (i: IProjectItem) => Nullable<IProjectItem>): Nullable<IProjectItem> {
    if (item.children.some(c => c.id === id)) {
        let replacedItem: Nullable<IProjectItem> = null;
        item.children = sortProjectItems(replaceOrRemoveInArray(item.children, (c: IProjectItem) => c.id === id, x => {
            replacedItem = x;
            return modify(x);
        }));
        return replacedItem;
    } else {
        let itemToUpdate: Nullable<IProjectItem> = null;
        let replacedTargetItem: Nullable<IProjectItem> = null;

        for (const childItem of item.children) {
            const replacedItem = updateItemInTreeImpl(childItem, id, modify);
            if (replacedItem) {
                replacedTargetItem = replacedItem;
                itemToUpdate = childItem;
                break;
            }
        }

        if (itemToUpdate) {
            item.children = replaceInArray(item.children, i => i === itemToUpdate, i => ({ ...i }));
            return replacedTargetItem;
        }
    }

    return null;
}

export function updateItemInTree(item: Nullable<IProjectItem>, id: string, modify: (i: IProjectItem) => Nullable<IProjectItem>): [Nullable<IProjectItem>, Nullable<IProjectItem>] {
    if (!item) {
        return [ item, null ];
    }

    const virtualRoot: any = { children: [ item ] };
    const replacedTargetItem = updateItemInTreeImpl(virtualRoot, id, modify);
    return [ virtualRoot.children[0], replacedTargetItem ];
}
