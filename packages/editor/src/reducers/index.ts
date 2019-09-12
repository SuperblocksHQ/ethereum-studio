// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import app from './app.reducer';
import projects from './projects.reducer';
import settings from './settings.reducer';
import panels from './panels.reducer';
import panes from './panes.reducer';
import explorer from './explorer.reducer';
import auth from './auth.reducer';
import toast from './toast.reducer';
import user from './user.reducer';
import view from './view.reducer';
import compiler from './compiler.reducer';
import deployer from './deployer.reducer';
import console from './outputLog.reducer';
import messageLog from './messageLog.reducer';
import outputLog from './outputLog.reducer';
import modal from './modal.reducer';
import transactions from './transactions.reducer';
import interact from './interact.reducer';
import preview from './preview.reducer';
import contractConfig from './contractConfig.reducer';
import accountActions from './account.reducer';
import { AnyAction } from 'redux';

const rehydrated = (state = false, action: AnyAction) => {
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
    panes,
    auth,
    toast,
    panels,
    explorer,
    user,
    view,
    compiler,
    deployer,
    console,
    messageLog,
    outputLog,
    transactions,
    interact,
    modal,
    preview,
    contractConfig,
    accountActions
};
