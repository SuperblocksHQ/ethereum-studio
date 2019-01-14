import { ipfsEpics } from './ipfs';
import { settingsEpics } from './settings';
import { sidePanelsEpics } from './sidePanels';
import { projectEpics } from './project';

export const epics = [
    ...ipfsEpics,
    ...settingsEpics,
    ...sidePanelsEpics,
    ...projectEpics
];
