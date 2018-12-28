export const projectActions = {
    SELECT_PROJECT: 'SELECT_PROJECT',
    selectProject(project) {
        return {
            type: projectActions.SELECT_PROJECT,
            data: project
        };
    }
}


