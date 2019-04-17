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

import { generateUniqueId } from './common';
import { IProjectItem, ProjectItemTypes } from '../../models';

export function convertProject1_1to1_2(childNodes: any, resultItem: IProjectItem) {
    for (const key in childNodes) {
        if (childNodes.hasOwnProperty(key)) {
            const data = childNodes[key];

            let mutable = true;
            if (key === 'dappfile.json') {
                mutable = false;
            }

            const item: IProjectItem = {
                id: generateUniqueId(),
                name: key,
                mutable,
                type: data.type === 'f' ? ProjectItemTypes.File : ProjectItemTypes.Folder,
                opened: false,
                code: data.contents,
                children: []
            };
            resultItem.children.push(item);

            if (data.children) {
                convertProject1_1to1_2(data.children, item);
            }
        }
    }
}
