import { updateAccountNameEpic } from './updateAccountName.epic';
import { createNewAccountEpic } from './createNewAccount.epic';

export const accountEpics = [
    updateAccountNameEpic,
    createNewAccountEpic,
];
