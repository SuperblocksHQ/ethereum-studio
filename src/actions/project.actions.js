export const projectActions = {
    SELECT_PROJECT: 'SELECT_PROJECT',
    selectProject(project) {
        return {
            type: projectActions.SELECT_PROJECT,
            data: project
        };
    },
    UPDATE_PROJECT_SETTINGS: 'UPDATE_PROJECT_SETTINGS',
    updateProjectSettings(projectSettings) {
        return {
            type: projectActions.UPDATE_PROJECT_SETTINGS,
            data: projectSettings
        };
    },
    UPDATE_PROJECT_SETTINGS_SUCCESS: 'UPDATE_PROJECT_SETTINGS_SUCCESS',
    updateProjectSettingsSuccess(newProjectSettings) {
        return {
            type: projectActions.UPDATE_PROJECT_SETTINGS_SUCCESS,
            data: newProjectSettings,
        };
    },
    UPDATE_PROJECT_SETTINGS_FAIL: 'UPDATE_PROJECT_SETTINGS_FAIL',
    updateProjectSettingsFail(error) {
        return {
            type: projectActions.UPDATE_PROJECT_SETTINGS_FAIL,
            error: error
        };
    }
}


