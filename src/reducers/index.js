import app from './app';
import projects from './projects';
import settings from './settings';

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
  projects
};
