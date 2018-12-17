import app from './app';
import projects from './projects.reducer';
import settings from './settings';
import view from './view';
import panes from './panes.reducer';

const rehydrated = (state = false, action) => {
    switch (action.type) {
        case 'persist/REHYDRATE':
            return true;
        default:
            return state;
    }
};

export default {
    rehydrated,
    app,
    settings,
    projects,
    view,
    panes
};
