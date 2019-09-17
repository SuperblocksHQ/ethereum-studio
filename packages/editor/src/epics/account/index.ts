import { updateAccountNameEpic } from './updateAccountName.epic';
import { createNewAccountEpic } from './createNewAccount.epic';
import { deleteAccountEpic } from './deleteAccount.epic';

export const accountEpics = [
    updateAccountNameEpic,
    createNewAccountEpic,
    deleteAccountEpic,
];
