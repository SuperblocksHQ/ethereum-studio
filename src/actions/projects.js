export function selectProject(project) {
    return {
        type: 'SELECT_PROJECT',
        data: {
            project: project,
        }
    };
}
