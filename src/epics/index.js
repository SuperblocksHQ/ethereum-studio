import { ipfsEpics } from './ipfs';
import { settingsEpics } from './settings';

export const epics = [
    ...ipfsEpics,
    ...settingsEpics
];
