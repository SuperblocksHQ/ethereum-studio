import restoreIPFSState from './restoreIPFSState.epic';
import uploadToIPFS from './uploadToIPFS.epic';
import forkProject from './forkProject.epic';
import importProjectFromIPFS from './importProjectFromIPFS.epic';
import updateIPFSActionButtons from './updateIPFSActionButtons.epic';
import reportIPFSEvents from './reportIPFSEvents.epic';

export const ipfsEpics = [
    restoreIPFSState,
    uploadToIPFS,
    forkProject,
    importProjectFromIPFS,
    updateIPFSActionButtons,
    reportIPFSEvents
];
