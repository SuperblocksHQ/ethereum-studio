import { ipfsEpics } from './ipfs';
import { settingsEpics } from './settings';
import { sidePanelsEpics } from './sidePanels';

export const epics = [
    ...ipfsEpics,
    ...settingsEpics,
    ...sidePanelsEpics
];
