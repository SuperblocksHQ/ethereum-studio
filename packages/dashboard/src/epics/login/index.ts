import { githubLogin } from './githubLogin.epic';
import { logout } from './logout.epic';
import { silentLogin } from './silentLogin.epic';
import { refreshAuthStart } from './refreshAuth.epic';

export const loginEpics = [
    githubLogin,
    logout,
    silentLogin,
    refreshAuthStart
];
