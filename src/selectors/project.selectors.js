export const projectSelectors = {
    getSelectedProject: state => state.project.selectedProject,
    getSelectedProjectId: state => state.project.selectedProject.id,
    getSelectedProjectName: state => state.project.selectedProject.name,
}



