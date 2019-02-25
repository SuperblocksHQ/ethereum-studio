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

export function isSolitidyFile(item: IProjectItem): boolean {
    return item.type === ProjectItemTypes.File && item.name.toLowerCase().endsWith('.sol');
}

const UNIX_RESERVED_CHARS_REGEX = /[<>:"\/\\|?*\x00-\x1F]/g;
const WINDOWS_RESERVED_CHARS_REGEX = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;

export function isValidProjectItemName(name: string): boolean {
    name = name.trim();
    return name.length > 0 && name.length < 255 && !UNIX_RESERVED_CHARS_REGEX.test(name) && !WINDOWS_RESERVED_CHARS_REGEX.test(name);
}
