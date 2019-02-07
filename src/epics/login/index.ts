import { githubLogin } from './githubLogin.epic';
import { githubCallback } from './githubCallback.epic';
import { logout } from './logout.epic';

export const loginEpics = [
    githubLogin,
    githubCallback,
    logout
];
