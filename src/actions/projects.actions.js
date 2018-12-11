export function selectProject(id, name) {
    return {
        type: 'SELECT_PROJECT',
        data: { id, name }
    };
}
