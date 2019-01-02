import restoreIPFSState from './restoreIPFSState.epic';
import uploadToIPFS from './uploadToIPFS.epic';

export const ipfsEpics = [
    restoreIPFSState,
    uploadToIPFS
];
