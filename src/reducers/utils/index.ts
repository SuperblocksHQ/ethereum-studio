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

export function replaceInArray<T>(array: T[], where: (item: T) => boolean, modify: (item: T, index: number) => T): T[] {
    const index = array.findIndex(where);
    if (index < 0) {
        return array;
    }
    return [ ...array.slice(0, index), modify(array[index], index), ...array.slice(index + 1)];
}

export function replaceOrRemoveInArray<T>(array: T[], where: (item: T) => boolean, modify: (item: T) => Nullable<T>): T[] {
    const index = array.findIndex(where);
    if (index < 0) {
        return array;
    }
    const resultItem = modify(array[index]);
    if (resultItem) {
        return [ ...array.slice(0, index), resultItem, ...array.slice(index + 1)];
    } else {
        return [ ...array.slice(0, index), ...array.slice(index + 1)];
    }
}

export function moveInArray<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    const resultArray = [...array];
    resultArray.splice(toIndex, 0, resultArray.splice(fromIndex, 1)[0]);
    return resultArray;
}

export * from './fileUtils';
