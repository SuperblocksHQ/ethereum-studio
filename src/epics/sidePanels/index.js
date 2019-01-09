import { downloadEpic } from './download.epic';
import { toggleWeb3AccountsEpic } from './toggleWeb3Accounts.epic';

export const sidePanelsEpics = [
    downloadEpic,
    toggleWeb3AccountsEpic
];
