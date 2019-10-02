import { updateAccountNameEpic } from './updateAccountName.epic';
import { createNewAccountEpic } from './createNewAccount.epic';
import { deleteAccountEpic } from './deleteAccount.epic';
import { fetchBalanceEpic } from './fetch-balance.epic';
import { updateAccountAddressEpic } from './updateAccountAddress.epic';

export const accountEpics = [
    updateAccountNameEpic,
    updateAccountAddressEpic,
    createNewAccountEpic,
    deleteAccountEpic,
    fetchBalanceEpic
];
