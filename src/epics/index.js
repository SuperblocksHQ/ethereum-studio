import { settingsEpics } from './settings';
import { sidePanelsEpics } from './sidePanels';

export const epics = [
    ...settingsEpics,
    ...sidePanelsEpics
];
