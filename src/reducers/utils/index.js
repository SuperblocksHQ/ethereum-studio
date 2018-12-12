export function replaceInArray(array, where, modify) {
    const index = array.findIndex(where);
    if (index < 0) {
        return array;
    }
    return [ ...array.slice(0, index), modify(array[index]), ...array.slice(index + 1)];
}