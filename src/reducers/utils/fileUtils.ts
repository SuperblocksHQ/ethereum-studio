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
import { createFile, createFolder, sortProjectItems } from '../explorerLib';

export function isSolitidyFile(item: IProjectItem): boolean {
    return item.type === ProjectItemTypes.File && item.name.toLowerCase().endsWith('.sol');
}

const UNIX_RESERVED_CHARS_REGEX = /[<>:"\/\\|?*\x00-\x1F]/g;
const WINDOWS_RESERVED_CHARS_REGEX = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;

export function isValidProjectItemName(name: string): boolean {
    name = name.trim();
    return name.length > 0 && name.length < 255 && !UNIX_RESERVED_CHARS_REGEX.test(name) && !WINDOWS_RESERVED_CHARS_REGEX.test(name);
}

// Insert path into directory tree structure:
export function insert(children: any[], [head, ...tail]: any, code: string): IProjectItem[] {
    let child = children.find((item: IProjectItem)  => item.name === head);
    if (!child) {
        if (head.endsWith('.sol')) {
            // file
            children.push(child = createFile(head, code));
        } else {
            // folder
            children.push(child = createFolder(head));
        }
    }
    if (tail.length > 0) {
        insert(child.children, tail, code);
    }
    return children;
}

/**
 * Insert item into tree structure overwriting items with same type and name and then sorting the resulting array.
 * @param {IProjectItem[]} baseArray - array we are appending to
 * @param {IProjectItem[]} newArray - array to be appended
 */
export function appendWithoutDuplicate(baseArray: IProjectItem[], newArray: IProjectItem[]): IProjectItem[] {
    const filtered = baseArray.filter((entry: IProjectItem) => {
        const newEntry = newArray[0];
        return (entry.type !== newEntry.type || entry.name !== newEntry.name);
    });
    return sortProjectItems(filtered.concat(newArray));
}
