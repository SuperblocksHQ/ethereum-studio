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
import { traverseTree } from './traverseTree';
import { ensurePath } from './ensurePath';

/**
 * Adds and merges item's content by name
 * @param item
 * @param itemsToAdd
 */
export function addAndMergeChildItems(item: IProjectItem, itemsToAdd: IProjectItem[]) {
    // Merge two arrays without duplicates
    const mergedArray = [...itemsToAdd, ...item.children];
    item.children = [];

    // Find duplicates
    const noDuplicates: any = [];
    const set = new Set();

    mergedArray.forEach((child) => {
        traverseTree(child, (projectItem: IProjectItem, path: () => string[]) => {
            const route = path();
            if (route[route.length - 1].endsWith('.sol') && !set.has(route[route.length - 1])) {
                noDuplicates.push({route, projectItem});
                set.add(route[route.length - 1]);
            }
        });
    }, []);

    // Rebuild tree without any duplicates
    noDuplicates.forEach((elem: any) => {
        const { projectItem, route } = elem;
        // remove last element from route, which is filename
        route.pop();
        const path = ensurePath(item, route);
        path.children.push(projectItem);
    });

    return { ...item, children: sortProjectItems(item.children) };
}
