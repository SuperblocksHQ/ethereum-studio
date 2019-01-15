import { environmentUpdateEpic } from './environmentUpdate.epic';
import { updateProjectSettings } from './updateProjectSettings.epic';

export const projectsEpics = [
    environmentUpdateEpic,
    updateProjectSettings
];
