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

/**
 * Adds or replaces item's content by name (and type)
 * @param item 
 * @param itemsToAdd
 */
export function addOrReplaceChildItems(item: IProjectItem, itemsToAdd: IProjectItem[]) {
    const children = item.children.filter(c => !itemsToAdd.some(ci => ci.name === c.name && ci.type === c.type));
    children.push.apply(children, itemsToAdd);
    return { ...item, children: sortProjectItems(children) };
}
