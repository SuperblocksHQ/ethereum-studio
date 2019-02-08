import { githubLogin } from './githubLogin.epic';
import { logout } from './logout.epic';

export const loginEpics = [
    githubLogin,
    logout
];
