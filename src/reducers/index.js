import app from './app.reducer';
import projects from './projects.reducer';
import settings from './settings.reducer';
import view from './view.reducer';
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
